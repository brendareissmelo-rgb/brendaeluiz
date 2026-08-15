import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

const items = [
  { href: "/dresscode", label: "Dresscode", internal: true },
  { href: "/#manual", label: "Manuais", internal: false },
  { href: "/#presente", label: "Presente", internal: false },
  { href: "/mesa-dos-convidados", label: "Mesa", internal: true },
];

export function SiteNav() {
  const cls =
    "rounded px-2.5 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary";
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-1 px-3 py-2 sm:gap-2">
        <Link to="/" aria-label="Início" className={cls + " flex items-center"}>
          <Home className="h-4 w-4" />
        </Link>
        {items.map((i) =>
          i.internal ? (
            <Link key={i.href} to={i.href} className={cls}>
              {i.label}
            </Link>
          ) : (
            <a key={i.href} href={i.href} className={cls}>
              {i.label}
            </a>
          ),
        )}
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-10 text-center">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Obrigado por fazer parte deste momento tão especial das nossas vidas. A presença de vocês
          é o que torna esse dia inesquecível.
        </p>
        <div className="text-[11px] uppercase tracking-[0.3em] text-primary">Brenda &amp; Luiz</div>
        <Link
          to="/login"
          className="mt-2 rounded-md border border-border/60 px-3 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </footer>
  );
}
