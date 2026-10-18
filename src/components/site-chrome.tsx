import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock, X } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { Branch, Monogram, Ornament } from "@/components/ornaments";
import { cn } from "@/lib/utils";

type NavLink = { label: string; to: "/" | "/mesa-dos-convidados" | "/dresscode"; hash?: string };

/** Links do menu do convite. Os que têm `hash` são seções da home. */
const LINKS: NavLink[] = [
  { label: "Início", to: "/" },
  { label: "O grande dia", to: "/", hash: "roteiro" },
  { label: "Manuais", to: "/", hash: "manual" },
  { label: "Presente", to: "/", hash: "presente" },
  { label: "Mesa", to: "/mesa-dos-convidados" },
  { label: "Traje", to: "/dresscode" },
];

/** Leva até uma seção da home, rolando suavemente se já estivermos nela. */
function useGoTo(onDone?: () => void) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (l: NavLink) => (e: React.MouseEvent) => {
    e.preventDefault();
    onDone?.();
    if (l.to === "/" && path === "/") {
      // espera o menu fechar antes de rolar
      setTimeout(() => {
        if (l.hash) document.getElementById(l.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }, 60);
      return;
    }
    void navigate({ to: l.to, hash: l.hash }).then(() => {
      if (!l.hash) window.scrollTo({ top: 0 });
    });
  };
}

function isActive(l: NavLink, path: string, hash: string) {
  if (l.hash) return path === "/" && hash === l.hash;
  return l.to === "/" ? path === "/" && !hash : path === l.to;
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const goTo = useGoTo(() => setOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300",
          scrolled ? "bg-background/80 shadow-[0_1px_0_var(--color-border)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="/" onClick={goTo(LINKS[0])} aria-label="Início" className="flex items-center gap-2.5">
            <Monogram className="h-10 w-10 bg-card/70 text-[19px] backdrop-blur" />
            <span className="hidden font-display text-[15px] tracking-tight sm:inline">Brenda &amp; Luiz</span>
          </a>

          {/* Desktop: links compactos, sem ícones */}
          <nav aria-label="Navegação principal" className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 backdrop-blur md:flex">
            {LINKS.map((l) => {
              const active = isActive(l, path, hash);
              return (
                <a
                  key={l.label}
                  href={l.hash ? `/#${l.hash}` : l.to}
                  onClick={goTo(l)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-wide transition-colors",
                    active ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <span className="hidden text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground md:inline">
            12 · 12 · 26
          </span>

          {/* Mobile: botão de menu */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="flex h-10 items-center gap-2.5 rounded-full border border-border/70 bg-card/80 pl-4 pr-3 text-[12px] font-medium uppercase tracking-[0.2em] backdrop-blur md:hidden"
          >
            Menu
            <span className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-foreground" />
              <span className="ml-auto h-px w-3 bg-foreground" />
            </span>
          </button>
        </div>
      </header>

      {/* Menu em tela cheia (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="paper fixed inset-0 z-[60] flex flex-col overflow-y-auto overflow-x-hidden px-6 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[env(safe-area-inset-top)] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <Branch className="pointer-events-none absolute -right-10 bottom-16 h-56 w-56 text-caramel/40" />
            <div className="flex h-16 items-center justify-between">
              <Monogram className="h-10 w-10 text-[19px]" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-8 flex flex-1 flex-col" aria-label="Navegação principal">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.hash ? `/#${l.hash}` : l.to}
                  onClick={goTo(l)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-baseline gap-4 border-b border-border/70 py-4"
                >
                  <span className="w-6 font-display text-[13px] italic text-caramel">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "flex-1 font-display text-[32px] font-light leading-none tracking-tight",
                      isActive(l, path, hash) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {l.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-active:translate-x-0.5" />
                </motion.a>
              ))}
            </nav>

            <div className="relative mt-10 flex items-end justify-between">
              <div>
                <div className="font-script text-[34px] leading-none text-primary">Brenda &amp; Luiz</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  12 de dezembro de 2026 · Belém
                </div>
              </div>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] text-muted-foreground ring-1 ring-border"
              >
                <Lock className="h-3 w-3" /> Noivos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Título de seção: etiqueta, título serifado e ornamento. */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <FadeIn className={cn("mb-10", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && <div className="eyebrow mb-3 text-primary">{eyebrow}</div>}
      <h2 className="font-display text-[34px] font-normal leading-[1.05] tracking-tight text-foreground sm:text-[44px]">
        {title}
      </h2>
      {align === "center" && <Ornament className="mt-4" />}
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
    <header className="relative overflow-hidden px-6 pb-10 pt-28 text-center sm:pt-36">
      <div className="watercolor absolute -left-24 -top-24 h-72 w-72" />
      <div className="watercolor absolute -right-24 top-10 h-64 w-64 opacity-70" />
      <Branch className="absolute -left-6 top-16 h-36 w-36 -scale-x-100 rotate-[200deg] text-caramel/60 sm:h-48 sm:w-48" />
      <Branch className="absolute -right-6 top-32 h-32 w-32 rotate-[160deg] text-caramel/50 sm:h-44 sm:w-44" />
      <FadeIn className="relative">
        <div className="eyebrow text-primary">{eyebrow}</div>
        <h1 className="mt-3 font-display text-[42px] font-light leading-[1.02] tracking-tight sm:text-6xl">{title}</h1>
        <Ornament className="mt-5" />
        {children && <div className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{children}</div>}
      </FadeIn>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-cocoa text-cream">
      <Branch className="absolute -bottom-8 -left-8 h-44 w-44 text-cream/15" />
      <Branch className="absolute -right-8 -top-8 h-40 w-40 rotate-180 text-cream/15" />
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 pb-[calc(env(safe-area-inset-bottom)+48px)] pt-16 text-center">
        <div className="whitespace-nowrap font-script text-[50px] leading-none text-blush">Brenda &amp; Luiz</div>
        <div className="mt-4 text-[11px] uppercase tracking-[0.3em] text-cream/60">12 · 12 · 2026 — Belém, PA</div>
        <p className="mt-8 max-w-sm font-display text-[17px] font-light italic leading-relaxed text-cream/85">
          Obrigado por fazer parte deste momento tão especial das nossas vidas. A presença de vocês é o que torna esse
          dia inesquecível.
        </p>
        <Link
          to="/login"
          className="mt-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-cream/55 ring-1 ring-cream/15 transition hover:text-cream hover:ring-cream/40"
        >
          <Lock className="h-3 w-3" /> Área dos noivos
        </Link>
      </div>
    </footer>
  );
}
