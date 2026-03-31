import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Flame,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WandSparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Security-first analysis",
    description:
      "Surface risky auth patterns, unsafe input handling, and hidden trust boundary issues before review hits production.",
  },
  {
    icon: WandSparkles,
    title: "Refactors with context",
    description:
      "Get actionable rewrite ideas, clearer structure, and practical suggestions your team can actually adopt.",
  },
  {
    icon: TimerReset,
    title: "Fast review cycles",
    description:
      "Turn raw snippets into structured quality feedback, performance notes, and testing prompts in one pass.",
  },
];

const steps = [
  "Drop in a function, component, or file you want reviewed.",
  "Let the engine score quality, flag issues, and suggest improvements.",
  "Save reports, compare findings, and keep iterating with confidence.",
];

const Landing = () => {
  return (
    <div className="page-shell">
      <div className="page-orb left-[-10rem] top-[-8rem] h-72 w-72 bg-primary/20" />
      <div
        className="page-orb right-[-8rem] top-20 h-80 w-80 bg-accent/20"
        style={{ animationDelay: "1.2s" }}
      />

      <header className="sticky top-0 z-50 border-b border-white/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">AI Code Reviewer</p>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Studio
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <a
              href="#features"
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#workflow"
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/60 hover:text-foreground"
            >
              Workflow
            </a>
            <Link to="/auth">
              <Button variant="ghost" className="rounded-full">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="rounded-full px-6">Launch App</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="animate-rise">
            <div className="section-eyebrow mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Ship cleaner code with less review drag
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
              Build a review flow your team actually wants to use.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A polished AI workspace for catching bugs, exposing security
              issues, and turning rough code into decisions you can act on.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/auth">
                <Button size="lg" className="w-full rounded-full px-7 sm:w-auto">
                  Start Reviewing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-white/70 bg-white/70 px-7 sm:w-auto"
                >
                  Explore Features
                </Button>
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["90%", "faster review loops"],
                ["24/7", "analysis on demand"],
                ["1 place", "reports, scores, and fixes"],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`premium-card px-5 py-4 ${index === 0 ? "animate-rise-delay-1" : index === 1 ? "animate-rise-delay-2" : "animate-rise-delay-3"}`}
                >
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-rise-delay-1">
            <div className="premium-card relative overflow-hidden p-6">
              <div className="absolute inset-x-8 top-0 h-24 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative rounded-[1.5rem] border border-slate-900/10 bg-slate-950 p-5 text-left text-slate-50 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Flame className="h-4 w-4 text-amber-400" />
                    Review Session
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-300">
                    Ready
                  </span>
                </div>

                <pre className="overflow-hidden rounded-2xl bg-white/5 p-4 text-xs leading-6 text-slate-300">
{`function login(user, password) {
  if (user.password === password) {
    return createSession(user)
  }
}`}
                </pre>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-amber-400/20 bg-amber-300/10 p-4">
                    <p className="text-sm font-semibold text-amber-200">
                      Security concern
                    </p>
                    <p className="mt-1 text-sm text-slate-200/90">
                      Plain text password comparison detected. Switch to hashed
                      validation and timing-safe comparison.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      ["82", "Quality"],
                      ["2", "Risks"],
                      ["4", "Suggestions"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-white/5 px-3 py-4"
                      >
                        <p className="text-2xl font-bold text-white">{value}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="section-eyebrow">Feature Set</div>
            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">
              A cleaner product feel from first click to saved report.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <Card
                key={feature.title}
                className={`premium-card p-7 ${index === 1 ? "lg:-translate-y-4" : ""}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="premium-card grid gap-10 p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div>
              <div className="section-eyebrow">Workflow</div>
              <h2 className="mt-5 text-4xl font-bold">From raw snippet to clear next step.</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                The product now feels like a focused review studio, not just a
                form and a results box.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-[1.35rem] border border-white/70 bg-white/70 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-white">
                    0{index + 1}
                  </div>
                  <p className="pt-2 text-base text-foreground/85">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
