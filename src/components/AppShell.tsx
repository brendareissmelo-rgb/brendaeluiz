import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, LayoutGrid, LogOut, ReceiptText, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/painel", label: "Resumo", icon: LayoutGrid },
  { to: "/despesas", label: "Despesas", icon: ReceiptText },
  { to: "/site", label: "Conteúdo do site", short: "Site", icon: SlidersHorizontal },
] as const;

/** Marca do painel: iniciais em sans, sem caligrafia. */
export function Brand({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-[13px] font-extrabold tracking-tight text-primary-foreground",
        className,
      )}
    >
      B&amp;L
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="font-ui flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f6f1ea]">
        <Brand className="h-12 w-12 animate-pulse" />
        <span className="text-[13px] font-medium text-muted-foreground">Carregando…</span>
      </div>
    );
  }

  const isActive = (to: string) => (to === "/painel" ? path === "/painel" : path.startsWith(to));
  const current = navItems.find((n) => isActive(n.to));
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="font-ui min-h-screen bg-[#f6f1ea] text-foreground">
      {/* Barra lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border/70 bg-card/70 px-4 py-6 backdrop-blur lg:flex">
        <div className="flex items-center gap-3 px-2">
          <Brand />
          <div className="leading-tight">
            <div className="text-[14px] font-bold">Brenda &amp; Luiz</div>
            <div className="text-[12px] text-muted-foreground">Painel do casamento</div>
          </div>
        </div>
        <nav className="mt-10 space-y-1">
          {navItems.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition-colors",
                  isActive(n.to) ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-[18px] w-[18px]" /> Ver o convite
          </a>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <LogOut className="h-[18px] w-[18px]" /> Sair
          </button>
          <div className="truncate px-3 pt-3 text-[11.5px] text-muted-foreground/80">{user.email}</div>
        </div>
      </aside>

      {/* Cabeçalho (mobile/tablet) */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-[#f6f1ea]/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Brand />
            <div className="min-w-0 leading-tight">
              <div className="text-[11.5px] font-medium text-muted-foreground">Brenda &amp; Luiz</div>
              <div className="truncate text-[16px] font-bold">{current?.label ?? "Painel"}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver o convite"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border/70"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={signOut}
              aria-label="Sair"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-border/70"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      {/* Abas inferiores (mobile/tablet) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch">
          {navItems.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {active && <span className="absolute top-0 h-[3px] w-10 rounded-b-full bg-primary" />}
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                {"short" in n ? n.short : n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/** Cabeçalho padrão das páginas do painel. */
export function PageTitle({
  title,
  subtitle,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight sm:text-[30px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[13.5px] text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Cartão base do painel. */
export const panelCard =
  "rounded-3xl bg-card ring-1 ring-border/60 shadow-[0_1px_2px_rgba(58,40,32,0.04),0_12px_32px_-24px_rgba(58,40,32,0.35)]";
