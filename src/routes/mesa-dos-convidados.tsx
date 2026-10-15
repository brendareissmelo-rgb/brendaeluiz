import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent, type GuestTable } from "@/lib/site-content";

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

type Guest = { name: string; relation?: string };

function parseGuest(raw: string): Guest {
  const m = raw.match(/^(.*?)\s*\((.*)\)\s*$/);
  if (m) return { name: m[1].trim(), relation: m[2].trim() };
  return { name: raw.trim() };
}

/**
 * Planta baixa de uma mesa redonda: cada convidado vira uma cadeira ao redor
 * da mesa, com o nome logo fora dela. As distâncias vêm de variáveis CSS
 * (--rc = anel das cadeiras, --rn = anel dos nomes) para poder mudar no mobile.
 */
function TablePlan({ id, guests }: { id: number; guests: Guest[] }) {
  const n = guests.length;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] [--rc:21%] [--rn:36%] sm:[--rc:23%] sm:[--rn:39%]">
      {/* Halo dourado atrás da planta */}
      <div className="table-halo absolute -inset-[6%] rounded-full" />

      {/* Anel pontilhado onde as cadeiras se apoiam */}
      <div className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold-400/80 sm:h-[46%] sm:w-[46%]" />
      {/* Anel externo do salão */}
      <div className="absolute left-1/2 top-1/2 h-[56%] w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-300/60 sm:h-[60%] sm:w-[60%]" />

      {/* Mesa */}
      <div className="table-surface absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full border border-gold-200/80 text-center shadow-[0_18px_38px_-14px_var(--gold-700)] sm:h-[32%] sm:w-[32%]">
        <div className="table-shine pointer-events-none absolute inset-0" />
        <span className="relative font-sora text-[11px] font-bold leading-none tracking-wide text-gold-900 sm:text-sm">
          Mesa {id}
        </span>
        <span className="relative mt-1 text-[9px] font-medium leading-none text-gold-900/85 sm:text-[10px]">
          {n} cadeiras
        </span>

      </div>

      {guests.map((g, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const c = Math.cos(a).toFixed(4);
        const s = Math.sin(a).toFixed(4);
        const deg = (a * 180) / Math.PI + 90;

        return (
          <div key={g.name}>
            {/* Cadeira */}
            <span
              className="chair-surface absolute h-[9px] w-[19px] rounded-full border border-gold-200 shadow-[0_3px_7px_-2px_var(--gold-700)] sm:h-[11px] sm:w-[25px]"
              style={{
                left: `calc(50% + var(--rc) * ${c})`,
                top: `calc(50% + var(--rc) * ${s})`,
                transform: `translate(-50%, -50%) rotate(${deg.toFixed(2)}deg)`,
              }}
            />
            {/* Nome do convidado */}
            <span
              className="absolute max-w-[80px] text-center leading-tight sm:max-w-[132px]"
              style={{
                left: `calc(50% + var(--rn) * ${c})`,
                top: `calc(50% + var(--rn) * ${s})`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="block font-sora text-[9px] text-foreground sm:text-[11px]">
                {g.name}
              </span>
              {g.relation ? (
                <span className="mt-0.5 block text-[8px] font-medium uppercase tracking-[0.08em] text-gold-700 sm:text-[9px]">
                  {g.relation}
                </span>

              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );

}

function TableCard({ table }: { table: GuestTable }) {
  const guests = table.guests.map(parseGuest);
  return (
    <div className="card-warm rounded-2xl border border-gold-300/70 p-5 shadow-[0_18px_44px_-20px_var(--gold-600)] sm:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="font-sora text-base font-bold tracking-tight text-foreground sm:text-lg">
          Mesa {table.id}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-300 bg-gold-100/70 px-3 py-1 text-[11px] text-gold-800">
          <Users className="h-3 w-3 text-gold-600" />
          {table.guests.length} convidados
        </span>
      </div>
      <TablePlan id={table.id} guests={guests} />
    </div>
  );
}


function MesaPage() {
  const { data, isLoading } = useSiteContent();
  const [minWait, setMinWait] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setMinWait(false), 450);
    return () => clearTimeout(id);
  }, []);

  const tables = data?.tables.list ?? [];
  const loading = isLoading || minWait;
  const totalGuests = tables.reduce((sum, t) => sum + t.guests.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 pb-14 pt-28">
        <FadeIn>
          <div className="mb-10 text-center">
            <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-gold-600">
              {data?.tables.eyebrow ?? "Recepção"}
            </div>
            <h1 className="font-sora text-3xl font-bold tracking-tight sm:text-4xl">
              {data?.tables.title ?? "Mesa dos Convidados"}
            </h1>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
            <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
              Cada cadeira ao redor da mesa é um convidado. Toque no nome da mesa para saber quem
              senta com você.
            </p>
            <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100/70 px-4 py-1.5 text-xs text-gold-800">
              <Users className="h-3.5 w-3.5 text-gold-600" />
              {totalGuests} convidados distribuídos em {tables.length} mesas
            </div>

          </div>
        </FadeIn>

        {loading ? (
          <div className="space-y-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[420px] w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <StaggerContainer className="space-y-6" staggerDelay={0.08}>
            {tables.map((t) => (
              <StaggerItem key={t.id}>
                <TableCard table={t} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
