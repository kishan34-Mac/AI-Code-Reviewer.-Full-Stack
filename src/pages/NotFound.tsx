import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="page-orb left-[-8rem] top-10 h-72 w-72 bg-primary/20" />
      <div className="page-orb bottom-0 right-[-8rem] h-80 w-80 bg-accent/20" />

      <div className="premium-card relative z-10 max-w-xl p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[image:var(--gradient-primary)] text-white shadow-[var(--shadow-glow)]">
          <Compass className="h-7 w-7" />
        </div>
        <p className="mt-8 text-sm uppercase tracking-[0.28em] text-muted-foreground">
          404 Error
        </p>
        <h1 className="mt-4 text-5xl font-bold">This route drifted off the map.</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          The page you tried to open does not exist anymore or never existed in
          this workspace.
        </p>
        <Link to="/">
          <Button className="mt-8 rounded-full px-6">Return Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
