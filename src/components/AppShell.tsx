import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, LayoutDashboard, LogOut, Receipt, Settings } from "lucide-react";
import { Monogram } from "@/components/ornaments";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/painel", label: "Resumo", icon: LayoutDashboard },
  { to: "/despesas", label: "Despesas", icon: Receipt },
  { to: "/site", label: "Site", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="paper flex min-h-screen flex-col items-center justify-center gap-4">
        <Monogram className="h-16 w-16 animate-pulse text-[30px]" />
        <span className="eyebrow text-muted-foreground">Carregando</span>
      </div>
    );
  }

  const isActive = (to: string) => (to === "/painel" ? path === "/painel" : path.startsWith(to));
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="paper min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Monogram className="h-10 w-10 text-[19px]" />
            <div className="leading-tight">
              <div className="font-display text-[17px]">Brenda &amp; Luiz</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Finanças do casamento</div>
            </div>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 md:flex">
            {navItems.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    isActive(n.to) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <span className="mr-2 hidden text-xs text-muted-foreground lg:inline">{user.email}</span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir o convite"
              title="Abrir o convite"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 text-muted-foreground transition hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={signOut}
              aria-label="Sair"
              title="Sair"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/70 text-muted-foreground transition hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 md:pb-12">{children}</main>

      {/* Barra inferior (celular) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] md:hidden">
        <div className="mx-auto flex max-w-sm items-stretch gap-1 rounded-full border border-white/60 bg-card/90 p-1.5 shadow-[0_18px_40px_-16px_rgba(58,40,32,0.45)] backdrop-blur-xl">
          {navItems.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[10.5px] font-medium tracking-wide transition-colors",
                  active ? "bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_var(--color-primary)]" : "text-muted-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                {n.label}
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
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/80 text-primary">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </span>
          <h1 className="font-display text-[30px] font-normal leading-none tracking-tight">{title}</h1>
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
