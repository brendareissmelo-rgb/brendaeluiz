import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useExpenses, summarize, summarizeByOwner, computeAmounts, BRL } from "@/lib/expenses";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/painel")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Stat({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: "primary" | "success" | "warning" | "muted" }) {
  const color =
    accent === "success" ? "text-success"
    : accent === "warning" ? "text-warning"
    : accent === "primary" ? "text-primary"
    : "text-foreground";
  return (
    <Card className="border-border/60 bg-card p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-xl font-semibold tabular-nums ${color}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function Dashboard() {
  const { data: items = [], isLoading } = useExpenses();
  const s = summarize(items);
  const byOwner = summarizeByOwner(items);
  const pct = s.total > 0 ? Math.round((s.paid / s.total) * 100) : 0;

  const byCategory = new Map<string, { paid: number; remaining: number; total: number }>();
  for (const e of items) {
    if ((((e as any).owner as string) ?? "Ambos") === "Presente") continue;
    const a = computeAmounts(e);
    const cur = byCategory.get(e.category) ?? { paid: 0, remaining: 0, total: 0 };
    cur.paid += a.paid;
    cur.remaining += a.remaining;
    cur.total += a.total;
    byCategory.set(e.category, cur);
  }
  const cats = [...byCategory.entries()].sort((a, b) => b[1].total - a[1].total);

  const upcoming = items
    .filter((e) => e.status !== "paid" && e.due_date)
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Resumo</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tudo que você pagou, está pagando e ainda precisa pagar.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/despesas">Gerenciar despesas</Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total previsto" value={BRL(s.total)} hint={`${s.count} despesa(s)`} />
        <Stat label="Já pago" value={BRL(s.paid)} accent="success" hint={`${pct}% do total`} />
        <Stat label="A pagar" value={BRL(s.remaining)} accent="warning" />
        <Stat label="Em parcelamento" value={BRL(s.inProgress)} accent="primary" hint="Saldo restante das parcelas" />
      </div>

      <Card className="border-border/60 bg-card p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progresso geral</span>
          <span className="tabular-nums text-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="mt-2 h-2" />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground tabular-nums">
          <span>Pago {BRL(s.paid)}</span>
          <span>Total {BRL(s.total)}</span>
        </div>
      </Card>

      {s.gifts > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-amber-400/80">🎁 Presentes recebidos</div>
              <div className="mt-1 text-xl font-semibold tabular-nums text-amber-300">{BRL(s.gifts)}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{s.giftsCount} item(ns) — não entram no orçamento</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(["Luiz", "Brenda"] as const).map((person) => {
          const v = byOwner[person];
          const p = v.total > 0 ? Math.round((v.paid / v.total) * 100) : 0;
          const accent = person === "Luiz" ? "text-blue-400" : "text-pink-400";
          const dot = person === "Luiz" ? "bg-blue-500" : "bg-pink-500";
          return (
            <Card key={person} className="border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  <h3 className={`text-sm font-semibold ${accent}`}>{person}</h3>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{p}% pago</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 tabular-nums">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</div>
                  <div className="text-sm font-semibold">{BRL(v.total)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Pago</div>
                  <div className="text-sm font-semibold text-success">{BRL(v.paid)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">A pagar</div>
                  <div className="text-sm font-semibold text-warning">{BRL(v.remaining)}</div>
                </div>
              </div>
              <Progress value={p} className="mt-3 h-1.5" />
              {v.inProgress > 0 && (
                <div className="mt-2 text-[11px] text-muted-foreground">
                  Em parcelamento: <span className="tabular-nums text-primary">{BRL(v.inProgress)}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Por categoria</h2>
            <span className="text-[11px] text-muted-foreground">{cats.length} categoria(s)</span>
          </div>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Carregando...</p>
          ) : cats.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3">
              {cats.map(([name, v]) => {
                const p = v.total > 0 ? Math.round((v.paid / v.total) * 100) : 0;
                return (
                  <li key={name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {BRL(v.paid)} / {BRL(v.total)}
                      </span>
                    </div>
                    <Progress value={p} className="mt-1.5 h-1.5" />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="border-border/60 bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Próximos vencimentos</h2>
            <span className="text-[11px] text-muted-foreground">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nada agendado.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {upcoming.map((e) => {
                const a = computeAmounts(e);
                return (
                  <li key={e.id} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{e.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {e.category} · vence em {new Date(e.due_date!).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-sm font-semibold tabular-nums text-warning">
                      {BRL(a.remaining)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
