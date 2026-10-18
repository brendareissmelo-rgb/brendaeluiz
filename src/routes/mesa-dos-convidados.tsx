import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Users, Check, Search, X, Armchair } from "lucide-react";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { PageHeader, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent, type GuestTable, type Guest } from "@/lib/site-content";

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

/**
 * Planta baixa de uma mesa redonda: cada convidado vira uma cadeira ao redor
 * da mesa, com o nome logo fora dela. As distâncias vêm de variáveis CSS
 * (--rc = anel das cadeiras, --rn = anel dos nomes) para poder mudar no mobile.
 */
function TablePlan({ id, guests, highlight }: { id: number; guests: GuestInfo[]; highlight: (name: string) => boolean }) {
  const n = guests.length;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] [--rc:21%] [--rn:37%] sm:[--rc:23%] sm:[--rn:39%]">
      <div className="table-halo absolute -inset-[4%] rounded-full" />

      {/* Anel pontilhado onde as cadeiras se apoiam */}
      <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold-400/70 sm:h-[46%] sm:w-[46%]" />
      {/* Anel externo do salão */}
      <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300/50 sm:h-[60%] sm:w-[60%]" />

      {/* Mesa */}
      <div className="table-surface absolute left-1/2 top-1/2 flex h-[27%] w-[27%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full border border-gold-100/80 text-center shadow-[0_18px_38px_-14px_var(--gold-700)] sm:h-[32%] sm:w-[32%]">
        <div className="table-shine pointer-events-none absolute inset-0" />
        <span className="relative font-display text-[9px] uppercase leading-none tracking-[0.2em] text-gold-900/80 sm:text-[10px]">
          Mesa
        </span>
        <span className="relative font-display text-[26px] font-normal leading-none text-gold-900 sm:text-[34px]">
          {id}
        </span>
      </div>

      {guests.map((g, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const c = Math.cos(a).toFixed(4);
        const s = Math.sin(a).toFixed(4);
        const deg = (a * 180) / Math.PI + 90;
        const hit = highlight(g.name);

        return (
          <div key={g.name + i}>
            {/* Cadeira */}
            <span
              className={`chair-surface absolute h-[9px] w-[20px] rounded-full border shadow-[0_3px_7px_-2px_var(--gold-700)] sm:h-[11px] sm:w-[25px] ${
                hit ? "!bg-none bg-primary border-primary ring-4 ring-primary/20" : g.invited ? "border-gold-400" : "border-gold-200"
              }`}
              style={{
                left: `calc(50% + var(--rc) * ${c})`,
                top: `calc(50% + var(--rc) * ${s})`,
                transform: `translate(-50%, -50%) rotate(${deg.toFixed(2)}deg)`,
              }}
            />
            {/* Nome do convidado */}
            <span
              className="absolute max-w-[84px] text-center leading-tight sm:max-w-[132px]"
              style={{
                left: `calc(50% + var(--rn) * ${c})`,
                top: `calc(50% + var(--rn) * ${s})`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span
                className={`block text-[10px] sm:text-[12px] ${
                  hit ? "rounded-full bg-primary px-2 py-0.5 font-medium text-primary-foreground" : "text-foreground"
                }`}
              >
                {g.name}
              </span>
              {g.relation ? (
                <span className="mt-0.5 block text-[7.5px] font-medium uppercase tracking-[0.1em] text-gold-700 sm:text-[9px]">
                  {g.relation}
                </span>
              ) : null}
              {g.invited ? (
                <span
                  className="mx-auto mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-400 text-gold-900"
                  title="Convite entregue"
                >
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TableCard({ table, query }: { table: GuestTable; query: string }) {
  const guests = table.guests.map(parseGuest);
  const invitedCount = guests.filter((g) => g.invited).length;
  const q = norm(query);
  const highlight = (name: string) => q.length >= 2 && norm(name).includes(q);
  return (
    <div id={`mesa-${table.id}`} className="card-warm scroll-mt-6 rounded-[28px] border border-gold-200 p-4 shadow-[0_22px_44px_-26px_var(--gold-700)] sm:p-7">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <span className="font-display text-[22px] font-normal tracking-tight text-foreground">Mesa {table.id}</span>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-[11px] text-gold-800 ring-1 ring-gold-200">
            <Users className="h-3 w-3 text-gold-600" />
            {table.guests.length}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-[11px] text-gold-800 ring-1 ring-gold-200">
            <Check className="h-3 w-3 text-gold-600" />
            {invitedCount}/{table.guests.length}
          </span>
        </div>
      </div>
      <TablePlan id={table.id} guests={guests} highlight={highlight} />
    </div>
  );
}

function MesaPage() {
  const { data, isLoading } = useSiteContent();
  const [minWait, setMinWait] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setMinWait(false), 450);
    return () => clearTimeout(id);
  }, []);

  const tables = data?.tables.list ?? [];
  const loading = isLoading || minWait;
  const totalGuests = tables.reduce((sum, t) => sum + t.guests.length, 0);

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
        Cada cadeira ao redor da mesa é um convidado. O check dourado indica quem já recebeu o convite.
      </PageHeader>

      <main className="mx-auto max-w-3xl px-5 pb-20">
        <FadeIn className="mx-auto mb-8 max-w-md">
          <div className="card-invite rounded-[24px] p-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Encontre seu nome"
                aria-label="Buscar convidado"
                className="h-12 w-full rounded-full border border-border bg-background/70 pl-11 pr-11 text-[15px] outline-none transition placeholder:text-muted-foreground/80 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
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
                      <a
                        href={`#mesa-${m.table}`}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-sand/50 px-4 py-2.5 transition hover:bg-sand"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[14px] font-medium">{m.name}</span>
                          {m.relation && <span className="block text-[11px] text-muted-foreground">{m.relation}</span>}
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5 font-display text-[15px] text-primary">
                          <Armchair className="h-4 w-4" strokeWidth={1.6} /> Mesa {m.table}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-center text-[13px] text-muted-foreground">
                  Nenhum nome encontrado. Tente só o primeiro nome.
                </p>
              )
            ) : (
              <div className="mt-3 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-caramel" />
                {loading ? "Carregando mesas…" : `${totalGuests} convidados em ${tables.length} mesas`}
              </div>
            )}
          </div>
        </FadeIn>

        {loading ? (
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-[28px]" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="space-y-6" staggerDelay={0.08}>
            {visible.map((t) => (
              <StaggerItem key={t.id}>
                <TableCard table={t} query={query} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
