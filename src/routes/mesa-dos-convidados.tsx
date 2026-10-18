import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, Check, Search, X, Armchair } from "lucide-react";

import { FadeIn } from "@/components/fade-in";
import { PageHeader, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent, type GuestTable, type Guest } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mesa-dos-convidados")({
  head: () => ({
    meta: [
      { title: "Mesa dos Convidados — Brenda & Luiz" },
      {
        name: "description",
        content: "Veja em qual mesa você vai sentar na recepção do casamento de Brenda e Luiz.",
      },
      { property: "og:title", content: "Mesa dos Convidados — Brenda & Luiz" },
      {
        property: "og:description",
        content: "Consulte a distribuição das mesas do salão no pós-casamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MesaPage,
});

type GuestInfo = { name: string; relation?: string; invited: boolean };

function parseGuest(g: Guest): GuestInfo {
  const m = g.name.match(/^(.*?)\s*\((.*)\)\s*$/);
  return {
    name: (m ? m[1] : g.name).trim(),
    relation: m ? m[2].trim() : undefined,
    invited: !!g.invited,
  };
}

/** Normaliza para busca: sem acento, minúsculo. */
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

/**
 * Planta compacta da mesa redonda: só as cadeiras ao redor (verde = convite
 * entregue, terracota = resultado da busca). Os nomes ficam na lista ao lado.
 */
function MiniPlan({ id, guests, hit }: { id: number; guests: GuestInfo[]; hit: (g: GuestInfo) => boolean }) {
  const n = guests.length;
  return (
    <div className="relative h-[124px] w-[124px] shrink-0">
      <div className="table-halo absolute -inset-3 rounded-full" />
      <div className="absolute inset-[18px] rounded-full border border-dashed border-gold-300" />
      <div className="table-surface absolute inset-[34px] flex flex-col items-center justify-center overflow-hidden rounded-full border border-gold-100 shadow-[0_12px_24px_-12px_var(--gold-700)]">
        <div className="table-shine pointer-events-none absolute inset-0" />
        <span className="relative font-display text-[8px] uppercase leading-none tracking-[0.2em] text-gold-900/75">Mesa</span>
        <span className="relative font-display text-[24px] leading-none text-gold-900">{id}</span>
      </div>
      {guests.map((g, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const deg = (a * 180) / Math.PI + 90;
        return (
          <span
            key={i}
            title={g.name}
            className={cn(
              "absolute h-[9px] w-[18px] rounded-full border shadow-[0_2px_5px_-2px_var(--gold-700)]",
              hit(g)
                ? "border-primary bg-primary ring-4 ring-primary/20"
                : g.invited
                  ? "border-invite bg-invite"
                  : "chair-surface border-gold-200",
            )}
            style={{
              left: `calc(50% + 46px * ${Math.cos(a).toFixed(4)})`,
              top: `calc(50% + 46px * ${Math.sin(a).toFixed(4)})`,
              transform: `translate(-50%, -50%) rotate(${deg.toFixed(2)}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function TableCard({ table, query, focused }: { table: GuestTable; query: string; focused?: boolean }) {
  const guests = table.guests.map(parseGuest);
  const invitedCount = guests.filter((g) => g.invited).length;
  const q = norm(query);
  const hit = (g: GuestInfo) => q.length >= 2 && norm(g.name).includes(q);
  const pct = guests.length ? Math.round((invitedCount / guests.length) * 100) : 0;

  return (
    <FadeIn>
      <article
        id={`mesa-${table.id}`}
        className={cn(
          "card-invite scroll-mt-36 overflow-hidden rounded-[30px] transition-shadow",
          focused && "ring-4 ring-primary/25",
        )}
      >
        {/* Cabeçalho com a planta */}
        <div className="flex items-center gap-5 bg-gradient-to-br from-gold-wash to-gold-100/70 px-5 py-5">
          <MiniPlan id={table.id} guests={guests} hit={hit} />
          <div className="min-w-0 flex-1">
            <div className="eyebrow !text-[9.5px] text-primary">Recepção</div>
            <h2 className="mt-1 font-display text-[30px] font-normal leading-none">Mesa {table.id}</h2>
            <div className="mt-2 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-caramel" /> {guests.length} lugares
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-invite" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-1.5 text-[11.5px] font-medium text-invite-ink">
                {invitedCount} de {guests.length} convites entregues
              </div>
            </div>
          </div>
        </div>

        {/* Lista de convidados */}
        <ul className="grid gap-1.5 p-3 sm:grid-cols-2">
          {guests.map((g, i) => {
            const isHit = hit(g);
            return (
              <li
                key={g.name + i}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors",
                  isHit ? "bg-primary/10 ring-2 ring-primary/40" : g.invited ? "bg-invite-soft" : "bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold",
                    isHit
                      ? "bg-primary text-primary-foreground"
                      : g.invited
                        ? "bg-invite text-white"
                        : "bg-sand text-gold-800",
                  )}
                >
                  {initials(g.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[15.5px] font-semibold leading-tight",
                      isHit ? "text-primary" : g.invited ? "text-invite-ink" : "text-foreground",
                    )}
                  >
                    {g.name}
                  </span>
                  {g.relation && (
                    <span className="mt-0.5 block truncate text-[10.5px] font-semibold uppercase tracking-[0.12em] text-caramel">
                      {g.relation}
                    </span>
                  )}
                </span>
                {g.invited && (
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-invite text-white"
                    title="Convite entregue pessoalmente"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </article>
    </FadeIn>
  );
}

function MesaPage() {
  const { data, isLoading } = useSiteContent();
  const [minWait, setMinWait] = useState(true);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState<number | null>(null);

  const goToTable = (id: number) => {
    setFocused(id);
    requestAnimationFrame(() =>
      document.getElementById(`mesa-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  useEffect(() => {
    const id = setTimeout(() => setMinWait(false), 450);
    return () => clearTimeout(id);
  }, []);

  const tables = data?.tables.list ?? [];
  const loading = isLoading || minWait;
  const totalGuests = tables.reduce((sum, t) => sum + t.guests.length, 0);
  const totalInvited = tables.reduce((sum, t) => sum + t.guests.filter((g) => g.invited).length, 0);

  const matches = useMemo(() => {
    const q = norm(query);
    if (q.length < 2) return [];
    return tables.flatMap((t) =>
      t.guests
        .map(parseGuest)
        .filter((g) => norm(g.name).includes(q))
        .map((g) => ({ table: t.id, name: g.name, relation: g.relation })),
    );
  }, [query, tables]);

  const visible = query.trim().length >= 2 ? tables.filter((t) => matches.some((m) => m.table === t.id)) : tables;

  return (
    <div className="paper min-h-screen">
      <SiteNav />
      <PageHeader eyebrow={data?.tables.eyebrow ?? "Recepção"} title={data?.tables.title ?? "Mesa dos Convidados"}>
        Busque seu nome para encontrar o seu lugar no salão.
      </PageHeader>

      <main className="mx-auto max-w-3xl px-5 pb-20">
        {/* Busca */}
        <FadeIn className="mx-auto mb-5 max-w-md">
          <div className="card-invite rounded-[26px] p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFocused(null);
                }}
                placeholder="Encontre seu nome"
                aria-label="Buscar convidado"
                className="h-12 w-full rounded-full border border-border bg-background/70 pl-11 pr-11 text-[15px] outline-none transition placeholder:text-muted-foreground/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setFocused(null);
                  }}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            {query.trim().length >= 2 ? (
              matches.length ? (
                <ul className="mt-3 space-y-1.5">
                  {matches.slice(0, 6).map((m, i) => (
                    <li key={m.name + i}>
                      <button
                        type="button"
                        onClick={() => goToTable(m.table)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-sand/50 px-4 py-2.5 text-left transition hover:bg-sand"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-semibold">{m.name}</span>
                          {m.relation && <span className="block text-[11px] text-muted-foreground">{m.relation}</span>}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-display text-[15px] text-primary">
                          <Armchair className="h-4 w-4" strokeWidth={1.6} /> Mesa {m.table}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-center text-[13px] text-muted-foreground">Nenhum nome encontrado. Tente só o primeiro nome.</p>
              )
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-2xl bg-sand/50 px-3 py-2.5">
                  <div className="font-display text-[22px] leading-none">{loading ? "–" : totalGuests}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">convidados</div>
                </div>
                <div className="rounded-2xl bg-invite-soft px-3 py-2.5">
                  <div className="font-display text-[22px] leading-none text-invite-ink">{loading ? "–" : totalInvited}</div>
                  <div className="mt-1 text-[11px] text-invite-ink/80">convites entregues</div>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Legenda */}
        <FadeIn className="mx-auto mb-6 max-w-md">
          <div className="flex items-start gap-2.5 rounded-2xl bg-invite-soft px-4 py-3 text-[12.5px] leading-snug text-foreground/80 ring-1 ring-invite/40">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-invite text-white">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span>
              <b className="font-semibold text-invite-ink">Nomes em verde</b> já receberam o convite pessoalmente, junto com o
              convite do salão.
            </span>
          </div>
        </FadeIn>

        {/* Atalhos para as mesas */}
        {!loading && visible.length > 1 && (
          <div className="sticky top-16 z-30 -mx-5 mb-5 bg-background/85 px-5 py-2.5 backdrop-blur-md">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {visible.map((t) => {
                const inv = t.guests.filter((g) => g.invited).length;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goToTable(t.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium ring-1 transition-colors",
                      focused === t.id ? "bg-foreground text-background ring-foreground" : "bg-card text-foreground ring-border",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full font-display text-[14px]",
                        focused === t.id ? "bg-background text-foreground" : "bg-sand text-gold-800",
                      )}
                    >
                      {t.id}
                    </span>
                    <span className={cn("text-[11.5px]", focused === t.id ? "text-background/80" : "text-muted-foreground")}>
                      {inv}/{t.guests.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[420px] w-full rounded-[30px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {visible.map((t) => (
              <TableCard key={t.id} table={t} query={query} focused={focused === t.id} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
