import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Users } from "lucide-react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";

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

const TABLES: { id: number; guests: string[] }[] = [
  {
    id: 1,
    guests: [
      "Manoel Gomes (Pai do Noivo)",
      "Maria do Socorro (Mãe do Noivo)",
      "João Souza",
      "Mirian Souza (Mãe da Noiva)",
      "Suzete Lopes (Avó da Noiva)",
      "Rayla Cristina",
      "Alberto Melo (Pai da Noiva)",
      "Verônica Souza",
    ],
  },
  {
    id: 2,
    guests: [
      "Thaline Costa (Madrinha)",
      "Henrique",
      "Cássia Costa",
      "Antony Gabriel",
      "Marluce Silva",
      "Paloma Silva",
      "Sandro Gaia",
      "Cybelle Botelho",
    ],
  },
  {
    id: 3,
    guests: [
      "Brubs",
      "Maria Rita",
      "Gabrielly Cristina",
      "Ana Reis (Avó da Noiva)",
      "Milena Reis",
      "Andrei Souza",
      "Naza Melo",
      "Ronildo",
      "Joelma",
    ],
  },
  {
    id: 4,
    guests: [
      "Renan Carvalho (Padrinho)",
      "Lirian Barros",
      "Sumano",
      "Mocotó",
      "Alan Rendrix",
      "Jonatha David",
      "Luiz Horizonte (Noivo)",
      "Brenda Melo (Noiva)",
    ],
  },
  {
    id: 5,
    guests: [
      "Juliana",
      "Dayane Lobo",
      "Isaac Lobo",
      "Carol Barros",
      "Henrique de Moraes",
      "Silvia",
      "Bené (Avô da Noiva)",
      "Carina Leray",
    ],
  },
];

function MesaPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  const totalGuests = TABLES.reduce((sum, t) => sum + t.guests.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <div className="mb-10 text-center">
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">Recepção</div>
          <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
            Mesa dos Convidados
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-primary/50" />
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
            Toque em uma mesa para ver quem vai sentar com você no salão.
          </p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            {totalGuests} convidados distribuídos em {TABLES.length} mesas
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[58px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
        <div className="space-y-3">
          {TABLES.map((t) => {
            const isOpen = open === t.id;
            return (
              <div key={t.id} className="overflow-hidden rounded-lg border border-border/60 bg-card">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : t.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-accent/40"
                >
                  <span className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-serif text-lg">Mesa {t.id}</span>
                    <span className="text-xs text-muted-foreground">{t.guests.length} convidados</span>
                  </span>
                  <ChevronDown
                    className={
                      "h-4 w-4 shrink-0 text-primary transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </button>
                {isOpen && (
                  <ul className="grid gap-2 border-t border-border/60 px-5 py-5 sm:grid-cols-2">
                    {t.guests.map((g, i) => (
                      <li key={g} className="flex items-center gap-3 text-sm text-foreground/90">
                        <span className="font-serif text-sm text-primary tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {g}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
