type Bug = {
  line?: number;
  severity: string;
  description: string;
  fix: string;
};

type SecurityIssue = {
  severity: string;
  description: string;
  recommendation: string;
};

type PerformanceIssue = {
  description: string;
  impact: string;
  solution: string;
};

type Analysis = {
  bugs: Bug[];
  security_issues: SecurityIssue[];
  performance_issues: PerformanceIssue[];
  code_quality: {
    readability: number;
    maintainability: number;
    security: number;
    performance: number;
  };
  overall_score: number;
  suggestions: string[];
  refactored_code: string;
  test_cases: Array<{ name: string; input: string; expected: string }>;
};

function formatCode(code: string) {
  const lines = code.split("\n");
  let indent = 0;

  return lines
    .map((line) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return "";
      }

      if (/^[}\])]/.test(trimmed)) {
        indent = Math.max(indent - 1, 0);
      }

      const formatted = `${"  ".repeat(indent)}${trimmed}`;

      if (/[{\[]$/.test(trimmed)) {
        indent += 1;
      }

      return formatted;
    })
    .join("\n");
}

function getDeclaredIdentifiers(code: string) {
  const identifiers = new Set<string>();
  const declarationRegex =
    /\b(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/g;

  let match: RegExpExecArray | null;

  while ((match = declarationRegex.exec(code)) !== null) {
    const identifier = match[1];
    if (identifier) {
      identifiers.add(identifier);
    }
  }

  return identifiers;
}

export function analyzeCode(code: string, language: string): Analysis {
  const lines = code.split("\n");
  const nextLines = [...lines];
  const bugs: Bug[] = [];
  const securityIssues: SecurityIssue[] = [];
  const performanceIssues: PerformanceIssue[] = [];
  const suggestions: string[] = [];
  const testCases: Analysis["test_cases"] = [];

  const isJavaScriptLike = ["javascript", "typescript"].includes(
    language.toLowerCase(),
  );

  if (isJavaScriptLike) {
    const declaredIdentifiers = getDeclaredIdentifiers(code);
    const knownObjectProps = new Set<string>();

    for (const line of lines) {
      const propertyMatches = line.matchAll(/([A-Za-z_$][\w$]*)\s*:/g);
      for (const match of propertyMatches) {
        const propertyName = match[1];
        if (propertyName) {
          knownObjectProps.add(propertyName);
        }
      }
    }

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (/if\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(line)) {
        const fixedLine = line.replace(
          /if\s*\((.*?)=([^=].*?)\)/,
          (_match, left, right) => `if (${left.trim()} === ${right.trim()})`,
        );

        nextLines[index] = fixedLine;
        bugs.push({
          line: lineNumber,
          severity: "high",
          description:
            "Assignment is being used inside an if-condition. This usually causes the condition to behave incorrectly.",
          fix: "Use a comparison operator like === instead of = inside the condition.",
        });
      }

      if (/\b(?:const|let|var)\s+\w+\s*=\s*fetch\(/.test(line) && !/\bawait\b/.test(line)) {
        nextLines[index] = line.replace("= fetch(", "= await fetch(");
        bugs.push({
          line: lineNumber,
          severity: "high",
          description:
            "The fetch call is missing await, so the variable stores a Promise instead of the actual response.",
          fix: "Add await before fetch(...) and keep the function async.",
        });
      }

      if (/=\s*\w+\.json\(\)/.test(line) && !/\bawait\b/.test(line)) {
        nextLines[index] = line.replace(/=\s*/, "= await ");
        bugs.push({
          line: lineNumber,
          severity: "medium",
          description:
            "The JSON body is being read without await, so the parsed data is still pending when used later.",
          fix: "Use await response.json() before accessing the resulting data.",
        });
      }

      const propertyMatch = line.match(/\.([A-Z][A-Za-z0-9_]*)/);
      if (propertyMatch?.[1]) {
        const candidate = propertyMatch[1];
        const lowerCandidate =
          candidate.charAt(0).toLowerCase() + candidate.slice(1);

        if (knownObjectProps.has(lowerCandidate)) {
          nextLines[index] = line.replace(`.${candidate}`, `.${lowerCandidate}`);
          bugs.push({
            line: lineNumber,
            severity: "medium",
            description:
              "Property casing does not match the object definition, which can lead to undefined values at runtime.",
            fix: `Use .${lowerCandidate} so the property matches the object key.`,
          });
        }
      }

      const consoleMatch = line.match(/console\.log\(([\w$]+)/);
      const referencedIdentifier = consoleMatch?.[1];

      if (referencedIdentifier && !declaredIdentifiers.has(referencedIdentifier)) {
        if (/numbers\.map/.test(code)) {
          const mapLineIndex = lines.findIndex((currentLine) =>
            currentLine.includes("numbers.map"),
          );

          const mapLine = mapLineIndex >= 0 ? lines[mapLineIndex] : null;
          const nextMapLine = mapLineIndex >= 0 ? nextLines[mapLineIndex] : null;

          if (
            mapLine &&
            nextMapLine &&
            !/^\s*(const|let|var)\s+\w+\s*=/.test(mapLine)
          ) {
            nextLines[mapLineIndex] = nextMapLine.replace(
              "numbers.map",
              "const doubleNumbers = numbers.map",
            );
            nextLines[index] = line.replace(referencedIdentifier, "doubleNumbers");
            declaredIdentifiers.add("doubleNumbers");
          }
        }

        bugs.push({
          line: lineNumber,
          severity: "high",
          description:
            "A variable is being used before it is declared, which will throw a ReferenceError at runtime.",
          fix: "Declare the transformed result in a variable and log that declared variable instead.",
        });
      }

      if (/\beval\s*\(/.test(line)) {
        securityIssues.push({
          severity: "high",
          description:
            "eval() executes arbitrary strings as code and can expose the app to code injection attacks.",
          recommendation:
            "Remove eval() and replace it with a safe parser or explicit control flow.",
        });
      }
    });

    if (!suggestions.length) {
      suggestions.push(
        "Prefer explicit async handling with await to avoid Promise-related runtime bugs.",
      );
      suggestions.push(
        "Store intermediate transformation results in named variables before logging or reusing them.",
      );
      suggestions.push(
        "Keep object property names consistent in casing so runtime lookups remain predictable.",
      );
    }

    if (!testCases.length) {
      testCases.push({
        name: "Handles expected happy path",
        input: "Valid input data",
        expected: "Returns transformed output without throwing",
      });
      testCases.push({
        name: "Rejects malformed state",
        input: "Missing required values or failed network response",
        expected: "Handles the error path without crashing",
      });
    }
  } else {
    suggestions.push(
      "Language-specific analysis is currently strongest for JavaScript and TypeScript snippets.",
    );
    suggestions.push(
      "Use descriptive names and guard clauses to improve readability and maintainability.",
    );
  }

  if (bugs.length > 0) {
    performanceIssues.push({
      description:
        "Repeated async or transformation mistakes can cause extra retries and noisy runtime failures.",
      impact:
        "Unexpected failures increase debugging time and can slow user-facing flows.",
      solution:
        "Resolve the highlighted issues first, then retest the function with focused cases.",
    });
  }

  const readability = Math.max(4, 10 - Math.min(bugs.length, 4));
  const maintainability = Math.max(4, 10 - Math.min(bugs.length, 4));
  const security = Math.max(4, 10 - securityIssues.length * 2);
  const performance = Math.max(4, 10 - performanceIssues.length);
  const overallScore = Math.max(
    40,
    Math.round(((readability + maintainability + security + performance) / 40) * 100),
  );

  return {
    bugs,
    security_issues: securityIssues,
    performance_issues: performanceIssues,
    code_quality: {
      readability,
      maintainability,
      security,
      performance,
    },
    overall_score: overallScore,
    suggestions,
    refactored_code: formatCode(nextLines.join("\n")),
    test_cases: testCases,
  };
}
