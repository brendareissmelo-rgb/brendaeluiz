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
import { AppShell, PageTitle } from "@/components/AppShell";
import { useExpenses, summarize, computeAmounts, BRL, type Expense } from "@/lib/expenses";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DonutRing,
  FIN_COLORS as C,
  LegendDot,
  Meter,
  OwnerTag,
  StatusBadge,
  ownerOf,
  OWNER_STYLES,
} from "@/components/finance-ui";

export const Route = createFileRoute("/painel")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const cardBase = "rounded-[22px] border-border/70 bg-card/90 shadow-[0_18px_36px_-28px_rgba(58,40,32,0.55)]";

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className = "",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
  tone?: "default" | "success" | "warning" | "primary" | "info";
  className?: string;
}) {
  const tones = {
    default: { v: "text-foreground", i: "text-muted-foreground bg-muted" },
    success: { v: "text-success", i: "text-success bg-success/10" },
    warning: { v: "text-warning", i: "text-warning bg-warning/10" },
    primary: { v: "text-primary", i: "text-primary bg-primary/10" },
    info: { v: "text-info", i: "text-info bg-info/10" },
  }[tone];

  return (
    <Card className={`${cardBase} p-4 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${tones.i}`}>
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
      <div className={`mt-2 truncate text-[19px] font-semibold leading-none tracking-tight tabular-nums sm:text-[24px] ${tones.v}`}>
        {value}
      </div>
      {hint && <div className="mt-1.5 truncate text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}

function PersonCard({ person, items }: { person: "Luiz" | "Brenda"; items: Expense[] }) {
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
            reserved: person === "Brenda" ? a.reservedBrenda : a.reservedLuiz,
            remaining: a.remaining * share,
            total: a.total * share,
          };
        })
        .sort((a, b) => b.remaining - a.remaining || b.total - a.total),
    [items, person],
  );

  const paid = rows.reduce((n, r) => n + r.paid, 0);
  const reserved = rows.reduce((n, r) => n + r.reserved, 0);
  const remaining = rows.reduce((n, r) => n + r.remaining, 0);
  const total = paid + reserved + remaining;
  const pct = total > 0 ? Math.round(((paid + reserved) / total) * 100) : 0;

  return (
    <Card className={`${cardBase} p-5`}>
      <div className="flex items-center gap-4">
        <DonutRing
          size={84}
          thickness={8}
          segments={[
            { value: paid, color: s.stroke },
            { value: reserved, color: C.reserved },
            { value: remaining, color: "transparent" },
          ]}
        >
          <span className={`text-base font-semibold tabular-nums ${s.text}`}>{pct}%</span>
          <span className="text-[8.5px] uppercase tracking-widest text-muted-foreground">coberto</span>
        </DonutRing>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${s.dot}`} />
            <h3 className="font-display text-[20px] leading-none">{person}</h3>
            <span className="text-[11px] text-muted-foreground">· {rows.length} itens</span>
          </div>
          <div className="mt-2 truncate text-[24px] font-semibold leading-none tabular-nums">{BRL(total)}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-muted/60 px-3 py-2.5">
        <LegendDot color={C.paid} label="Pago" value={BRL(paid)} />
        <LegendDot color={C.reserved} label="Caixinha" value={BRL(reserved)} />
        <LegendDot color={C.remaining} label="A pagar" value={BRL(remaining)} />
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex w-full items-center justify-between rounded-full border border-border/70 px-4 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        {open ? "Ocultar itens" : "Ver itens"}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul className="mt-2 divide-y divide-border/60">
          {rows.length === 0 && <li className="py-3 text-[12px] text-muted-foreground">Nenhum item.</li>}
          {rows.map((r) => (
            <li key={r.e.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-medium">{r.e.name}</span>
                  {r.share === 0.5 && (
                    <span className="rounded-full bg-muted px-1.5 text-[9px] font-medium text-muted-foreground">50%</span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <StatusBadge status={r.e.status} />
                  <span className="truncate text-[10.5px] text-muted-foreground">{r.e.category}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[13px] font-semibold tabular-nums">{BRL(r.total)}</div>
                <div className="text-[10.5px] tabular-nums text-warning">falta {BRL(r.remaining)}</div>
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
    <div className="space-y-5">
      <PageTitle
        icon={Wallet}
        title="Resumo"
        subtitle="Tudo que vocês já pagaram, estão pagando e ainda precisam pagar."
        action={
          <Button asChild size="sm" className="hidden h-10 rounded-full px-5 sm:inline-flex">
            <Link to="/despesas">
              Gerenciar despesas <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      {/* HERO */}
      {isLoading ? (
        <Skeleton className="h-[300px] w-full rounded-[26px]" />
      ) : (
        <div className="panel-dark relative overflow-hidden rounded-[26px] p-6 shadow-[0_28px_50px_-30px_rgba(58,40,32,0.9)]">
          <div className="pointer-events-none absolute -right-6 -top-10 font-script text-[150px] leading-none text-cream/[0.06]">
            B&amp;L
          </div>
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex items-center gap-5">
              <DonutRing
                size={128}
                thickness={12}
                track="rgba(255,248,240,0.12)"
                segments={[
                  { value: s.paid, color: C.paid },
                  { value: s.reserved, color: C.reserved },
                  { value: s.remaining, color: C.remaining },
                ]}
              >
                <span className="text-[9px] uppercase tracking-[0.18em] text-cream/65">Coberto</span>
                <span className="font-display text-[34px] leading-none tabular-nums">{pct}%</span>
              </DonutRing>
              <div className="min-w-0 md:hidden">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cream/65">Orçamento total</div>
                <div className="mt-1.5 font-display text-[30px] leading-none tabular-nums">{BRL(s.total)}</div>
                <div className="mt-1.5 text-[12px] text-cream/65">{s.count} despesas</div>
              </div>
            </div>

            <div className="min-w-0">
              <div className="hidden md:block">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cream/65">Orçamento total</div>
                <div className="mt-1.5 font-display text-5xl leading-none tabular-nums">{BRL(s.total)}</div>
                <div className="mt-1.5 text-[12px] text-cream/65">{s.count} despesa(s) cadastrada(s)</div>
              </div>
              <div className="md:mt-5">
                <Meter
                  height={10}
                  track="rgba(255,248,240,0.12)"
                  segments={[
                    { value: s.paid, color: C.paid },
                    { value: s.reserved, color: C.reserved },
                    { value: s.remaining, color: C.remaining },
                  ]}
                />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <LegendDot light color={C.paid} label="Pago" value={BRL(s.paid)} />
                  <LegendDot light color={C.reserved} label="Caixinha" value={BRL(s.reserved)} />
                  <LegendDot light color={C.remaining} label="A pagar" value={BRL(s.remaining)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 [&>*]:min-w-0">
        <Stat label="Total previsto" value={BRL(s.total)} hint={`${s.count} despesa(s)`} icon={Layers} />
        <Stat label="Já pago" value={BRL(s.paid)} hint={`${paidPct}% do total`} icon={CheckCircle2} tone="success" />
        <Stat label="Na caixinha" value={BRL(s.reserved)} hint="Reservado por fora" icon={PiggyBank} tone="info" />
        <Stat label="A pagar" value={BRL(s.remaining)} hint={`${100 - pct}% restante`} icon={Timer} tone="warning" />
        <Stat
          label="Em parcelamento"
          value={BRL(s.inProgress)}
          hint="Saldo das parcelas"
          icon={CreditCard}
          tone="primary"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {s.gifts > 0 && (
        <Card className={`${cardBase} border-[#d9a54a]/35 bg-gradient-to-r from-[#d9a54a]/10 to-card p-4`}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d9a54a]/15 text-[#9a6a2c]">
              <Gift className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#9a6a2c]/85">Presentes recebidos</div>
              <div className="mt-1 font-display text-[26px] leading-none tabular-nums text-[#7f5422]">{BRL(s.gifts)}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{s.giftsCount} item(ns) — não entram no orçamento</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 [&>*]:min-w-0">
        {(["Luiz", "Brenda"] as const).map((p) => (
          <PersonCard key={p} person={p} items={items} />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2 [&>*]:min-w-0">
        <Card className={`${cardBase} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-[19px]">
              <Layers className="h-4 w-4 text-primary" /> Por categoria
            </h2>
            <span className="text-[11px] text-muted-foreground">{cats.length} categoria(s)</span>
          </div>
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Carregando...</p>
          ) : cats.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma despesa cadastrada ainda.</p>
          ) : (
            <ul className="space-y-4">
              {cats.map(([name, v]) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[13px] font-medium">{name}</span>
                    <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      <span className="font-semibold text-foreground">{BRL(v.paid)}</span> / {BRL(v.total)}
                    </span>
                  </div>
                  <div className="mt-1.5" style={{ width: `${Math.max((v.total / maxCat) * 100, 8)}%` }}>
                    <Meter
                      height={7}
                      segments={[
                        { value: v.paid, color: C.paid },
                        { value: v.reserved, color: C.reserved },
                        { value: v.remaining, color: C.remaining },
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className={`${cardBase} p-5`}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-[19px]">
              <CalendarClock className="h-4 w-4 text-warning" /> Próximos vencimentos
            </h2>
            <span className="text-[11px] text-muted-foreground">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nada agendado.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {upcoming.map((e) => {
                const a = computeAmounts(e);
                const d = new Date(e.due_date!);
                return (
                  <li key={e.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl bg-sand/70 leading-none text-primary">
                      <span className="font-display text-[17px]">{d.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })}</span>
                      <span className="mt-0.5 text-[8.5px] uppercase tracking-wider">
                        {d.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "")}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[14px] font-medium">{e.name}</span>
                        <OwnerTag owner={ownerOf(e)} />
                      </div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{e.category}</div>
                    </div>
                    <div className="shrink-0 text-[14px] font-semibold tabular-nums text-warning">{BRL(a.remaining)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Button asChild className="h-12 w-full rounded-full sm:hidden">
        <Link to="/despesas">
          Gerenciar despesas <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
