import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";

import logo from "@/assets/logo-casal.png.asset.json";

type Item = { href: string; label: string; internal: boolean; glow?: boolean };

const items: Item[] = [
  { href: "/#manual", label: "Manuais", internal: false },
  { href: "/#presente", label: "Presente", internal: false, glow: true },
  { href: "/dresscode", label: "Dresscode", internal: true },
  { href: "/mesa-dos-convidados", label: "Mesa", internal: true },
];

function scrollTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

export function SiteNav() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const cls =
    "rounded px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary";

  const goHash = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.split("#")[1];
    if (path !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-1 px-3 py-2 sm:gap-2">
        <Link to="/" aria-label="Início" onClick={scrollTop} className={cls + " flex items-center"}>
          <Home className="h-4 w-4" />
        </Link>
        {items.map((i) =>
          i.internal ? (
            <Link key={i.href} to={i.href} onClick={scrollTop} className={cls}>
              {i.label}
            </Link>
          ) : (
            <a
              key={i.href}
              href={i.href}
              onClick={goHash(i.href)}
              className={
                i.glow
                  ? cls +
                    " font-medium text-primary drop-shadow-[0_0_10px_var(--color-primary)] hover:opacity-90"
                  : cls
              }
            >
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
        <img src={logo.url} alt="Brenda e Luiz" className="h-10 w-auto opacity-90" />
        <Link
          to="/login"
          className="mt-2 rounded-md border border-border/60 px-3 py-1.5 text-[12px] tracking-wide text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          Login
        </Link>
      </div>
    </footer>
  );
}
