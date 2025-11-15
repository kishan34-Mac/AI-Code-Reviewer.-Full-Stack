import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert code reviewer and bug finder. Analyze the provided code and return a structured analysis.

Your analysis must include:
1. bugs: Array of bugs found (line number, severity, description, suggested fix)
2. security_issues: Array of security vulnerabilities
3. performance_issues: Array of performance problems
4. code_quality: Object with scores (readability, maintainability, security, performance) out of 10
5. overall_score: Number 0-100 representing code quality
6. suggestions: Array of improvement suggestions
7. refactored_code: Optimized version of the code
8. test_cases: Array of test cases to verify fixes

Be thorough and specific. Provide line numbers where applicable.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this ${language} code:\n\n${code}` }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_code',
              description: 'Return structured code analysis',
              parameters: {
                type: 'object',
                properties: {
                  bugs: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        line: { type: 'number' },
                        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                        description: { type: 'string' },
                        fix: { type: 'string' }
                      },
                      required: ['severity', 'description', 'fix']
                    }
                  },
                  security_issues: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                        description: { type: 'string' },
                        recommendation: { type: 'string' }
                      }
                    }
                  },
                  performance_issues: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        description: { type: 'string' },
                        impact: { type: 'string' },
                        solution: { type: 'string' }
                      }
                    }
                  },
                  code_quality: {
                    type: 'object',
                    properties: {
                      readability: { type: 'number' },
                      maintainability: { type: 'number' },
                      security: { type: 'number' },
                      performance: { type: 'number' }
                    }
                  },
                  overall_score: { type: 'number' },
                  suggestions: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  refactored_code: { type: 'string' },
                  test_cases: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        input: { type: 'string' },
                        expected: { type: 'string' }
                      }
                    }
                  }
                },
                required: ['bugs', 'security_issues', 'performance_issues', 'code_quality', 'overall_score', 'suggestions', 'refactored_code']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_code' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});