import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, ChevronDown, Gift, ReceiptText } from "lucide-react";
import { AppShell, PageTitle, panelCard } from "@/components/AppShell";
import { useExpenses, summarize, computeAmounts, BRL, type Expense } from "@/lib/expenses";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutRing, FIN_COLORS as C, Meter, OwnerTag, StatusBadge, ownerOf, OWNER_STYLES } from "@/components/finance-ui";

export const Route = createFileRoute("/painel")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

const WEDDING = new Date("2026-12-12T17:30:00-03:00").getTime();

/** Paleta das categorias no gráfico de rosca. */
const CAT_COLORS = ["#9a5236", "#c8894a", "#6f8a5c", "#7d97ad", "#c06b82", "#b9a27a", "#5f4a3e", "#d8b48a", "#8c6f9e", "#4f7a78"];

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};

/** Valor compacto: R$ 12,5 mil. */
const short = (n: number) =>
  n >= 1000 ? `R$ ${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : BRL(n);

function HeroCard({ s, pct }: { s: ReturnType<typeof summarize>; pct: number }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#a85b3c] via-primary to-[#6e3a27] p-6 text-primary-foreground shadow-[0_30px_60px_-30px_rgba(122,62,40,0.9)] sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[12.5px] font-semibold text-white/75">Orçamento total</div>
          <div className="mt-1 text-[34px] font-extrabold leading-none tracking-tight tabular-nums sm:text-[44px]">
            {BRL(s.total)}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12.5px] text-white/70">
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white ring-1 ring-white/20">{pct}% coberto</span>
            {s.count} despesas
          </div>
        </div>
      </div>

      <div className="relative mt-7">
        <div className="flex h-3 w-full gap-[3px] overflow-hidden rounded-full bg-white/15">
          {[
            { v: s.paid, c: "#fff8f0" },
            { v: s.reserved, c: "rgba(255,248,240,0.55)" },
          ].map((seg, i) =>
            seg.v > 0 ? (
              <div key={i} className="h-full rounded-full" style={{ width: `${(seg.v / (s.total || 1)) * 100}%`, background: seg.c }} />
            ) : null,
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { l: "Pago", v: s.paid, dot: "#fff8f0" },
            { l: "Caixinha", v: s.reserved, dot: "rgba(255,248,240,0.55)" },
            { l: "A pagar", v: s.remaining, dot: "rgba(255,248,240,0.18)" },
          ].map((x) => (
            <div key={x.l} className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/70">
                <span className="h-2 w-2 shrink-0 rounded-full ring-1 ring-white/40" style={{ background: x.dot }} />
                {x.l}
              </div>
              <div className="mt-1 truncate text-[13px] font-bold tabular-nums sm:text-[18px]">{BRL(x.v)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Upcoming({ items }: { items: Expense[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[17px] font-bold">
          <CalendarClock className="h-[18px] w-[18px] text-primary" /> Próximos pagamentos
        </h2>
        <Link to="/despesas" className="text-[13px] font-semibold text-primary">
          Ver tudo
        </Link>
      </div>
      {items.length === 0 ? (
        <div className={`${panelCard} p-5 text-[13px] text-muted-foreground`}>Nada agendado por enquanto.</div>
      ) : (
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
          {items.map((e) => {
            const a = computeAmounts(e);
            const d = new Date(e.due_date!);
            const days = Math.ceil((d.getTime() - Date.now()) / 86400000);
            const late = days < 0;
            return (
              <div key={e.id} className={`${panelCard} w-[66vw] max-w-[260px] shrink-0 snap-start p-4 sm:w-auto sm:max-w-none`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-[#f6f1ea] leading-none">
                    <span className="text-[17px] font-extrabold">{d.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "UTC" })}</span>
                    <span className="mt-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                      {d.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "")}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      late ? "bg-destructive/10 text-destructive" : days <= 15 ? "bg-warning/12 text-warning" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {late ? `${-days}d atrasado` : days === 0 ? "hoje" : `em ${days}d`}
                  </span>
                </div>
                <div className="mt-4 truncate text-[14.5px] font-bold">{e.name}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <OwnerTag owner={ownerOf(e)} />
                  <span className="truncate text-[11.5px] text-muted-foreground">{e.category}</span>
                </div>
                <div className="mt-3 text-[20px] font-extrabold tabular-nums">{BRL(a.remaining)}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PersonRow({ person, items }: { person: "Luiz" | "Brenda"; items: Expense[] }) {
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
    <div className="py-4 first:pt-1 last:pb-1">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 text-left" aria-expanded={open}>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white ${s.dot}`}>
          {person[0]}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[15px] font-bold">{person}</span>
            <span className="text-[15px] font-extrabold tabular-nums">{BRL(total)}</span>
          </div>
          <div className="mt-2 flex items-center gap-2.5">
            <Meter
              height={7}
              segments={[
                { value: paid, color: C.paid },
                { value: reserved, color: C.reserved },
                { value: remaining, color: C.remaining },
              ]}
            />
            <span className="w-9 shrink-0 text-right text-[12px] font-bold tabular-nums text-muted-foreground">{pct}%</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11.5px] text-muted-foreground">
            <span>
              Falta <b className="font-bold text-foreground">{BRL(remaining)}</b>
            </span>
            <span className="flex items-center gap-1 font-semibold">
              {rows.length} itens <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </span>
          </div>
        </div>
      </button>

      {open && (
        <ul className="ml-14 mt-3 divide-y divide-border/60 rounded-2xl bg-[#f6f1ea] px-3">
          {rows.length === 0 && <li className="py-3 text-[12px] text-muted-foreground">Nenhum item.</li>}
          {rows.map((r) => (
            <li key={r.e.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-semibold">{r.e.name}</span>
                  {r.share === 0.5 && <span className="rounded-full bg-card px-1.5 text-[9.5px] font-bold text-muted-foreground">50%</span>}
                </div>
                <div className="mt-1">
                  <StatusBadge status={r.e.status} />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[13px] font-bold tabular-nums">{BRL(r.total)}</div>
                <div className="text-[11px] font-semibold tabular-nums text-warning">falta {BRL(r.remaining)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Categories({ items }: { items: Expense[] }) {
  const cats = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of items) {
      if (ownerOf(e) === "Presente") continue;
      map.set(e.category, (map.get(e.category) ?? 0) + computeAmounts(e).total);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const total = cats.reduce((n, [, v]) => n + v, 0);

  return (
    <div className={`${panelCard} p-5 sm:p-6`}>
      <h2 className="text-[17px] font-bold">Para onde vai o dinheiro</h2>
      {cats.length === 0 ? (
        <p className="mt-3 text-[13px] text-muted-foreground">Nenhuma despesa cadastrada ainda.</p>
      ) : (
        <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <DonutRing size={150} thickness={20} segments={cats.map(([, v], i) => ({ value: v, color: CAT_COLORS[i % CAT_COLORS.length] }))}>
            <span className="text-[11px] font-semibold text-muted-foreground">{cats.length} categorias</span>
            <span className="text-[16px] font-extrabold tabular-nums">{short(total)}</span>
          </DonutRing>
          <ul className="w-full flex-1 space-y-2.5">
            {cats.map(([name, v], i) => (
              <li key={name} className="flex items-center gap-3">
                <span className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: CAT_COLORS[i % CAT_COLORS.length] }} />
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{name}</span>
                <span className="text-[12px] font-semibold tabular-nums text-muted-foreground">{Math.round((v / total) * 100)}%</span>
                <span className="w-[96px] text-right text-[13px] font-bold tabular-nums">{BRL(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { data: items = [], isLoading } = useExpenses();
  const s = summarize(items);
  const pct = s.total > 0 ? Math.round(((s.paid + s.reserved) / s.total) * 100) : 0;
  const daysLeft = Math.max(0, Math.ceil((WEDDING - Date.now()) / 86400000));

  const upcoming = items
    .filter((e) => e.status !== "paid" && e.due_date && ownerOf(e) !== "Presente")
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageTitle
        title={`${greeting()}!`}
        subtitle={`Faltam ${daysLeft} dias para o grande dia.`}
        action={
          <Link
            to="/despesas"
            className="hidden h-11 items-center gap-2 rounded-full bg-foreground px-5 text-[13.5px] font-bold text-background sm:inline-flex"
          >
            <ReceiptText className="h-4 w-4" /> Gerenciar despesas
          </Link>
        }
      />

      {isLoading ? <Skeleton className="h-[230px] w-full rounded-[28px]" /> : <HeroCard s={s} pct={pct} />}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { l: "Já pago", v: BRL(s.paid), c: "text-success" },
          { l: "Na caixinha", v: BRL(s.reserved), c: "text-info" },
          { l: "A pagar", v: BRL(s.remaining), c: "text-warning" },
          { l: "Em parcelamento", v: BRL(s.inProgress), c: "text-primary" },
        ].map((x) => (
          <div key={x.l} className={`${panelCard} min-w-0 p-4`}>
            <div className="text-[12px] font-semibold text-muted-foreground">{x.l}</div>
            <div className={`mt-1.5 truncate text-[18px] font-extrabold tabular-nums ${x.c}`}>{x.v}</div>
          </div>
        ))}
      </div>

      <Upcoming items={upcoming} />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] [&>*]:min-w-0">
        <div className={`${panelCard} p-5 sm:p-6`}>
          <h2 className="text-[17px] font-bold">Quem paga o quê</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Itens de “Ambos” contam 50% para cada um.</p>
          <div className="mt-3 divide-y divide-border/60">
            {(["Brenda", "Luiz"] as const).map((p) => (
              <PersonRow key={p} person={p} items={items} />
            ))}
          </div>
        </div>
        <Categories items={items} />
      </div>

      {s.gifts > 0 && (
        <div className={`${panelCard} flex items-center gap-4 p-5`}>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d9a54a]/15 text-[#9a6a2c]">
            <Gift className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-muted-foreground">Presentes recebidos · {s.giftsCount} item(ns)</div>
            <div className="text-[20px] font-extrabold tabular-nums">{BRL(s.gifts)}</div>
            <div className="text-[11.5px] text-muted-foreground">Não entram no orçamento</div>
          </div>
        </div>
      )}

      <Link
        to="/despesas"
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground text-[14px] font-bold text-background sm:hidden"
      >
        Gerenciar despesas <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
