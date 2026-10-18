import { Link } from "@tanstack/react-router";
import { Gift, Home, Shirt, Users } from "lucide-react";

import logo from "@/assets/logo-casal.png.asset.json";
import { FadeIn } from "@/components/fade-in";
import { Branch, Ornament } from "@/components/ornaments";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Início", url: "/", icon: Home },
  { name: "Presente", url: "#presente", icon: Gift, highlighted: true },
  { name: "Mesa", url: "/mesa-dos-convidados", icon: Users },
  { name: "Traje", url: "/dresscode", icon: Shirt },
];

export function SiteNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:bottom-auto sm:top-4 sm:pb-0"
    >
      <div className="mx-auto max-w-md sm:max-w-none">
        <NavBar items={navItems} />
      </div>
    </nav>
  );
}

/** Título de seção: etiqueta, título serifado e ornamento. */
export function SectionHeading({
  eyebrow,
  title,
  script,
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Usa a caligrafia em vez da serifada. */
  script?: boolean;
  className?: string;
}) {
  return (
    <FadeIn className={cn("mb-10 text-center", className)}>
      {eyebrow && <div className="eyebrow mb-3 text-primary">{eyebrow}</div>}
      <h2
        className={
          script
            ? "font-script text-[46px] leading-[1.05] text-foreground sm:text-6xl"
            : "font-display text-[32px] font-normal leading-tight tracking-tight text-foreground sm:text-[42px]"
        }
      >
        {title}
      </h2>
      <Ornament className="mt-4" />
    </FadeIn>
  );
}

/** Cabeçalho das páginas internas (Mesa, Traje). */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden px-6 pb-10 pt-14 text-center sm:pt-32">
      <div className="watercolor absolute -left-24 -top-24 h-72 w-72" />
      <div className="watercolor absolute -right-24 top-10 h-64 w-64 opacity-70" />
      <Branch className="absolute -left-6 top-4 h-36 w-36 -scale-x-100 rotate-[200deg] text-caramel/60 sm:h-48 sm:w-48" />
      <Branch className="absolute -right-6 top-24 h-32 w-32 rotate-[160deg] text-caramel/50 sm:h-44 sm:w-44" />
      <FadeIn className="relative">
        <Link to="/" className="font-script text-2xl text-primary/80 transition hover:text-primary">
          Brenda &amp; Luiz
        </Link>
        <div className="eyebrow mt-6 text-muted-foreground">{eyebrow}</div>
        <h1 className="mt-2 font-display text-[40px] font-light leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        <Ornament className="mt-5" />
        {children && <div className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{children}</div>}
      </FadeIn>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-sand/40">
      <Branch className="absolute -bottom-6 -left-8 h-40 w-40 text-caramel/40" />
      <Branch className="absolute -right-8 -top-6 h-36 w-36 rotate-180 text-caramel/40" />
      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-4 px-6 pb-36 pt-14 text-center sm:pb-14">
        <img src={logo.url} alt="Brenda e Luiz" className="h-12 w-auto opacity-90" />
        <p className="font-display text-lg font-light italic leading-relaxed text-foreground/85">
          Obrigado por fazer parte deste momento tão especial das nossas vidas. A presença de vocês é
          o que torna esse dia inesquecível.
        </p>
        <div className="eyebrow mt-1 text-primary">12 · 12 · 2026 — Belém</div>
        <Link
          to="/login"
          className="mt-4 text-[11px] tracking-[0.2em] text-muted-foreground/70 uppercase transition hover:text-primary"
        >
          Área dos noivos
        </Link>
      </div>
    </footer>
  );
}
