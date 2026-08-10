import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Gift,
  Layers,
  PiggyBank,
  Timer,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useExpenses, summarize, computeAmounts, BRL, type Expense } from "@/lib/expenses";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DonutRing, Meter, OwnerTag, StatusBadge, ownerOf, OWNER_STYLES } from "@/components/finance-ui";

export const Route = createFileRoute("/painel")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const C = {
  paid: "#3fcfa0",
  reserved: "#3b82f6",
  remaining: "#e0a33c",
  primary: "#e8bd85",
  gift: "#fbbf24",
};

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  tone?: "default" | "success" | "warning" | "primary" | "info";
}) {
  const tones = {
    default: { v: "text-foreground", i: "text-muted-foreground bg-muted/60" },
    success: { v: "text-success", i: "text-success bg-success/10" },
    warning: { v: "text-warning", i: "text-warning bg-warning/10" },
    primary: { v: "text-primary", i: "text-primary bg-primary/10" },
    info: { v: "text-sky-400", i: "text-sky-400 bg-sky-500/10" },
  }[tone];


  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card p-4 transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
          <div className={`mt-2 text-[26px] font-bold leading-none tracking-tight tabular-nums ${tones.v}`}>{value}</div>
          {hint && <div className="mt-1.5 text-[11px] font-normal text-muted-foreground">{hint}</div>}
        </div>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones.i}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Card>
  );
}

function PersonCard({
  person,
  items,
}: {
  person: "Luiz" | "Brenda";
  items: Expense[];
}) {
  const [open, setOpen] = useState(false);
  const s = OWNER_STYLES[person];

  const rows = useMemo(
    () =>
      items
        .filter((e) => {
          const o = ownerOf(e);
          return o === person || o === "Ambos";
        })
        .map((e) => {
          const a = computeAmounts(e);
          const share = ownerOf(e) === "Ambos" ? 0.5 : 1;
          return {
            e,
            share,
            paid: a.paid * share,
            reserved: a.reserved * share,
            remaining: a.remaining * share,
            total: a.total * share,
          };
        })
        .sort((a, b) => b.remaining - a.remaining || b.total - a.total),
    [items, person]
  );

  const paid = rows.reduce((n, r) => n + r.paid, 0);
  const reserved = rows.reduce((n, r) => n + r.reserved, 0);
  const remaining = rows.reduce((n, r) => n + r.remaining, 0);
  const total = paid + reserved + remaining;
  const pct = total > 0 ? Math.round(((paid + reserved) / total) * 100) : 0;

  return (
    <Card className="border-border/50 bg-card p-5">
      <div className="flex items-center gap-4">
        <DonutRing
          size={92}
          thickness={9}
          segments={[
            { value: paid, color: s.stroke },
            { value: reserved, color: C.reserved },
            { value: remaining, color: "rgba(255,255,255,0.07)" },
          ]}
        >
          <span className={`text-base font-bold tabular-nums ${s.text}`}>{pct}%</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground">coberto</span>
        </DonutRing>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <h3 className="text-sm font-bold tracking-tight">{person}</h3>
            <span className="text-[11px] font-normal text-muted-foreground">· {rows.length} item(ns)</span>
          </div>
          <div className="mt-2 text-2xl font-bold leading-none tabular-nums">{BRL(total)}</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pago</div>
              <div className="text-sm font-semibold tabular-nums text-success">{BRL(paid)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Caixinha</div>
              <div className="text-sm font-semibold tabular-nums text-sky-400">{BRL(reserved)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">A pagar</div>
              <div className="text-sm font-semibold tabular-nums text-warning">{BRL(remaining)}</div>
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-md border border-border/50 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        {open ? "Ocultar itens" : "Ver itens"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="mt-2 divide-y divide-border/40">
          {rows.length === 0 && <li className="py-3 text-[11px] text-muted-foreground">Nenhum item.</li>}
          {rows.map((r) => (
            <li key={r.e.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium">{r.e.name}</span>
                  {r.share === 0.5 && (
                    <span className="rounded bg-muted px-1 text-[9px] font-medium text-muted-foreground">50%</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <StatusBadge status={r.e.status} />
                  <span className="text-[10px] text-muted-foreground">{r.e.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold tabular-nums">{BRL(r.total)}</div>
                <div className="text-[10px] tabular-nums text-warning">falta {BRL(r.remaining)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Dashboard() {
  const { data: items = [], isLoading } = useExpenses();
  const s = summarize(items);
  const paidPct = s.total > 0 ? Math.round((s.paid / s.total) * 100) : 0;
  const pct = s.total > 0 ? Math.round(((s.paid + s.reserved) / s.total) * 100) : 0;

  const byCategory = new Map<string, { paid: number; reserved: number; remaining: number; total: number }>();
  for (const e of items) {
    if (ownerOf(e) === "Presente") continue;
    const a = computeAmounts(e);
    const cur = byCategory.get(e.category) ?? { paid: 0, reserved: 0, remaining: 0, total: 0 };
    cur.paid += a.paid;
    cur.reserved += a.reserved;
    cur.remaining += a.remaining;
    cur.total += a.total;
    byCategory.set(e.category, cur);
  }
  const cats = [...byCategory.entries()].sort((a, b) => b[1].total - a[1].total);
  const maxCat = cats.length ? cats[0][1].total : 1;


  const upcoming = items
    .filter((e) => e.status !== "paid" && e.due_date && ownerOf(e) !== "Presente")
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Resumo</h1>
          </div>
          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Tudo que vocês já pagaram, estão pagando e ainda precisam pagar.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/despesas">
            Gerenciar despesas <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* HERO */}
      <Card className="overflow-hidden border-border/50 bg-card p-0">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
          <DonutRing
            size={168}
            thickness={14}
            segments={[
              { value: s.paid, color: C.paid },
              { value: s.reserved, color: C.reserved },
              { value: s.remaining, color: C.remaining },
            ]}
          >
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Coberto</span>
            <span className="text-3xl font-bold leading-none tabular-nums">{pct}%</span>
          </DonutRing>

          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Orçamento total
            </div>
            <div className="mt-1.5 text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-5xl">
              {BRL(s.total)}
            </div>
            <div className="mt-1.5 text-xs font-normal text-muted-foreground">
              {s.count} despesa(s) cadastrada(s)
            </div>

            <div className="mt-5">
              <Meter
                height={10}
                segments={[
                  { value: s.paid, color: C.paid },
                  { value: s.reserved, color: C.reserved },
                  { value: s.remaining, color: C.remaining },
                ]}
              />
              <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: C.paid }} />
                  <span className="text-muted-foreground">Pago</span>
                  <span className="font-semibold tabular-nums text-foreground">{BRL(s.paid)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: C.reserved }} />
                  <span className="text-muted-foreground">Na caixinha</span>
                  <span className="font-semibold tabular-nums text-foreground">{BRL(s.reserved)}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: C.remaining }} />
                  <span className="text-muted-foreground">A pagar</span>
                  <span className="font-semibold tabular-nums text-foreground">{BRL(s.remaining)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Total previsto" value={BRL(s.total)} hint={`${s.count} despesa(s)`} icon={Layers} />
        <Stat label="Já pago" value={BRL(s.paid)} hint={`${paidPct}% do total`} icon={CheckCircle2} tone="success" />
        <Stat label="Na caixinha" value={BRL(s.reserved)} hint="Reservado por fora" icon={PiggyBank} tone="info" />
        <Stat label="A pagar" value={BRL(s.remaining)} hint={`${100 - pct}% restante`} icon={Timer} tone="warning" />
        <Stat label="Em parcelamento" value={BRL(s.inProgress)} hint="Saldo das parcelas" icon={CreditCard} tone="primary" />
      </div>


      {s.gifts > 0 && (
        <Card className="border-amber-500/25 bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Gift className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-400/80">
                Presentes recebidos
              </div>
              <div className="mt-1 text-2xl font-bold leading-none tabular-nums text-amber-300">{BRL(s.gifts)}</div>
              <div className="mt-1 text-[11px] font-normal text-muted-foreground">
                {s.giftsCount} item(ns) — não entram no orçamento
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(["Luiz", "Brenda"] as const).map((p) => (
          <PersonCard key={p} person={p} items={items} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="border-border/50 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight">
              <Layers className="h-4 w-4 text-primary" /> Por categoria
            </h2>
            <span className="text-[11px] font-normal text-muted-foreground">{cats.length} categoria(s)</span>
          </div>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Carregando...</p>
          ) : cats.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3.5">
              {cats.map(([name, v]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs font-semibold">{name}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      <span className="font-semibold text-foreground">{BRL(v.paid)}</span> / {BRL(v.total)}
                    </span>
                  </div>
                  <div className="mt-1.5" style={{ width: `${Math.max((v.total / maxCat) * 100, 8)}%` }}>
                    <Meter
                      height={7}
                      segments={[
                        { value: v.paid, color: C.paid },
                        { value: v.remaining, color: C.remaining },
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="border-border/50 bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-tight">
              <CalendarClock className="h-4 w-4 text-warning" /> Próximos vencimentos
            </h2>
            <span className="text-[11px] font-normal text-muted-foreground">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nada agendado.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {upcoming.map((e) => {
                const a = computeAmounts(e);
                return (
                  <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">{e.name}</span>
                        <OwnerTag owner={ownerOf(e)} />
                      </div>
                      <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                        {e.category} · vence {new Date(e.due_date!).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-sm font-bold tabular-nums text-warning">{BRL(a.remaining)}</div>
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
