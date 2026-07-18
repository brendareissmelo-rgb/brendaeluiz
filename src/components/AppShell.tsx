import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xs text-muted-foreground">
        Carregando...
      </div>
    );
  }

  const navItems = [
    { to: "/painel", label: "Dashboard" },
    { to: "/despesas", label: "Despesas" },
  ];

  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-6">
            <div className="text-sm font-semibold tracking-tight">
              <span className="text-primary">◆</span> Finanças do Casamento
            </div>
            <nav className="flex items-center gap-1">
              {navItems.map((n) => {
                const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={
                      "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors " +
                      (active
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50")
                    }
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/login" });
              }}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6">{children}</main>
    </div>
  );
}
