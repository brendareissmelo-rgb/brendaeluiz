import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Users } from "lucide-react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";

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
      "Ana Beatriz Souza",
      "Carlos Eduardo Lima",
      "Fernanda Ribeiro",
      "Gustavo Almeida",
      "Helena Martins",
      "João Pedro Castro",
      "Larissa Moreira",
      "Marcelo Tavares",
    ],
  },
  {
    id: 2,
    guests: [
      "Amanda Nogueira",
      "Bruno Carvalho",
      "Camila Duarte",
      "Diego Barbosa",
      "Elisa Fonseca",
      "Felipe Andrade",
      "Giovana Pinto",
      "Henrique Braga",
    ],
  },
  {
    id: 3,
    guests: [
      "Isabela Rocha",
      "Jonas Ferreira",
      "Karina Mendes",
      "Leonardo Prado",
      "Mariana Cunha",
      "Nathan Oliveira",
      "Olívia Santana",
      "Paulo Vinícius",
    ],
  },
  {
    id: 4,
    guests: [
      "Priscila Gomes",
      "Rafael Monteiro",
      "Renata Vasconcelos",
      "Rodrigo Peixoto",
      "Sabrina Freitas",
      "Thiago Bastos",
      "Vanessa Correa",
      "Vitor Hugo Lopes",
    ],
  },
  {
    id: 5,
    guests: [
      "Alice Bezerra",
      "Caio Machado",
      "Daniela Queiroz",
      "Eduardo Pontes",
      "Flávia Menezes",
      "Igor Sampaio",
      "Juliana Teixeira",
      "Lucas Farias",
    ],
  },
];

function MesaPage() {
  const [open, setOpen] = useState<number | null>(null);

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
        </div>

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
                    <span className="text-xs text-muted-foreground">{t.guests.length} lugares</span>
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
      </main>
      <SiteFooter />
    </div>
  );
}
