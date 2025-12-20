// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Code, Shield, Zap, CheckCircle, Star, TrendingUp } from "lucide-react";
// import { Link } from "react-router-dom";

// const Landing = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
//       {/* Header */}
//       <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
//               <Code className="w-5 h-5 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold">AI Code Reviewer</span>
//           </div>
//           <nav className="hidden md:flex items-center gap-6">
//             <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
//             <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
//             <Link to="/auth">
//               <Button variant="ghost">Sign In</Button>
//             </Link>
//             <Link to="/auth">
//               <Button>Get Started</Button>
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="container mx-auto px-4 py-20 lg:py-32">
//         <div className="max-w-4xl mx-auto text-center animate-fade-in">
//           <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6">
//             <Star className="w-4 h-4 text-accent" />
//             <span className="text-sm font-medium">AI-Powered Code Analysis</span>
//           </div>
          
//           <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
//             Find Bugs Before
//             <br />They Find You
//           </h1>
          
//           <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Advanced AI code review that detects bugs, security vulnerabilities, and performance issues instantly. Get actionable insights to write better code.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link to="/auth">
//               <Button size="lg" className="w-full sm:w-auto">
//                 Start Reviewing Code
//               </Button>
//             </Link>
//             <Button size="lg" variant="outline" className="w-full sm:w-auto">
//               Watch Demo
//             </Button>
//           </div>

//           <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-primary" />
//               <span>No credit card required</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4 text-primary" />
//               <span>Free forever</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="container mx-auto px-4 py-20">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
//           <p className="text-xl text-muted-foreground">Everything you need for better code quality</p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
//               <Code className="w-6 h-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Bug Detection</h3>
//             <p className="text-muted-foreground">
//               Advanced AI identifies logical errors, edge cases, and potential runtime issues in your code.
//             </p>
//           </Card>

//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
//               <Shield className="w-6 h-6 text-accent" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Security Analysis</h3>
//             <p className="text-muted-foreground">
//               Detect security vulnerabilities, injection risks, and authentication issues automatically.
//             </p>
//           </Card>

//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
//               <Zap className="w-6 h-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Performance Optimization</h3>
//             <p className="text-muted-foreground">
//               Get suggestions to improve algorithm efficiency, reduce memory usage, and optimize loops.
//             </p>
//           </Card>

//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
//               <TrendingUp className="w-6 h-6 text-accent" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Code Quality Score</h3>
//             <p className="text-muted-foreground">
//               Receive an overall quality score with detailed breakdowns for readability, maintainability, and more.
//             </p>
//           </Card>

//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
//               <Code className="w-6 h-6 text-primary" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Refactored Code</h3>
//             <p className="text-muted-foreground">
//               Get clean, optimized versions of your code with best practices applied automatically.
//             </p>
//           </Card>

//           <Card className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
//             <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
//               <CheckCircle className="w-6 h-6 text-accent" />
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Test Case Generation</h3>
//             <p className="text-muted-foreground">
//               Automatically generate test cases to verify your fixes and ensure code reliability.
//             </p>
//           </Card>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="container mx-auto px-4 py-20 bg-muted/30">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl lg:text-5xl font-bold mb-4">How It Works</h2>
//           <p className="text-xl text-muted-foreground">Three simple steps to better code</p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
//               1
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Paste Your Code</h3>
//             <p className="text-muted-foreground">
//               Simply paste your code or upload a file. Supports JavaScript, Python, Java, C++, and more.
//             </p>
//           </div>

//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
//               2
//             </div>
//             <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
//             <p className="text-muted-foreground">
//               Our AI reviews your code for bugs, security issues, and performance problems in seconds.
//             </p>
//           </div>

//           <div className="text-center">
//             <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
//               3
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Get Results</h3>
//             <p className="text-muted-foreground">
//               Receive detailed analysis, suggested fixes, and optimized code you can use immediately.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="container mx-auto px-4 py-20">
//         <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-hero border-primary/20">
//           <h2 className="text-3xl lg:text-5xl font-bold mb-4">
//             Ready to Write Better Code?
//           </h2>
//           <p className="text-xl text-muted-foreground mb-8">
//             Join thousands of developers improving their code quality with AI
//           </p>
//           <Link to="/auth">
//             <Button size="lg" className="w-full sm:w-auto">
//               Start Free Review
//             </Button>
//           </Link>
//         </Card>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-border/40 py-12">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
//                 <Code className="w-4 h-4 text-primary-foreground" />
//               </div>
//               <span className="font-semibold">AI Code Reviewer</span>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               © 2025 AI Code Reviewer. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import {
  Code,
  Shield,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 relative">
      {/* Floating Glow Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-12 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-48 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">AI Code Reviewer</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </a>

            <Link to="/auth">
              <Button variant="ghost" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="shadow-md shadow-primary/20">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 lg:py-36">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Star className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">AI-Powered Code Analysis</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Build Better Code
            <br /> Before It Breaks
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Intelligent code review that catches bugs, detects security flaws, and boosts performance instantly—so you can ship with confidence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25">
                Start Reviewing Code
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto backdrop-blur-sm border-border/50"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to improve your development workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Code,
              title: "Bug Detection",
              desc: "AI identifies logical flaws, runtime errors, and hidden issues instantly.",
              color: "primary",
            },
            {
              icon: Shield,
              title: "Security Analysis",
              desc: "Catch injection risks, unsafe patterns, and authentication weaknesses.",
              color: "accent",
            },
            {
              icon: Zap,
              title: "Performance Optimization",
              desc: "Get targeted improvements to speed up algorithms and reduce memory usage.",
              color: "primary",
            },
            {
              icon: TrendingUp,
              title: "Code Quality Score",
              desc: "Receive a detailed breakdown of readability, maintainability, and structure.",
              color: "accent",
            },
            {
              icon: Code,
              title: "Refactored Code",
              desc: "Automatically receive cleaner, optimized code following best practices.",
              color: "primary",
            },
            {
              icon: CheckCircle,
              title: "Test Case Generation",
              desc: "Generate test cases to ensure reliability and prevent regressions.",
              color: "accent",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="p-7 relative border-border/40 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-${item.color}/10`}
              >
                <item.icon className={`w-7 h-7 text-${item.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 py-24 bg-muted/20 backdrop-blur-sm"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Transform your code in three steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {["Paste Your Code", "AI Analysis", "Get Results"].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item}</h3>
              <p className="text-muted-foreground">
                {index === 0 &&
                  "Paste your script or upload files. Supports JS, Python, Java, C++, and more."}
                {index === 1 &&
                  "Our AI scans your code for bugs, security risks, and performance problems."}
                {index === 2 &&
                  "Receive results with fixes, recommendations, and optimized code instantly."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <Card className="max-w-4xl mx-auto p-14 text-center shadow-xl bg-gradient-hero border-primary/20 backdrop-blur-sm">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Ready to Improve Your Code?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers upgrading their code quality with AI.
          </p>
          <Link to="/auth">
            <Button size="lg" className="shadow-lg shadow-primary/25">
              Start Free Review
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">AI Code Reviewer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AI Code Reviewer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
