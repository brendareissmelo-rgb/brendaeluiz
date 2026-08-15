import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { useSiteContent, DEFAULT_CONTENT } from "@/lib/site-content";

export const Route = createFileRoute("/dresscode")({
  head: () => ({
    meta: [
      { title: "Dresscode — Brenda & Luiz" },
      {
        name: "description",
        content: "Sugestões de traje para os convidados do casamento de Brenda e Luiz.",
      },
      { property: "og:title", content: "Dresscode — Brenda & Luiz" },
      {
        property: "og:description",
        content: "O que vestir (e o que evitar) no casamento de Brenda e Luiz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DresscodePage,
});

function DresscodeCarousel({ title, images, alt }: { title: string; images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const total = images.length;
  if (total === 0) return null;
  const idx = i % total;
  const prev = () => setI((c) => (c - 1 + total) % total);
  const next = () => setI((c) => (c + 1) % total);

  return (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
      <div className="relative bg-[#f5efe4]">
        <img
          src={images[idx]}
          alt={`${alt} ${idx + 1}`}
          loading="lazy"
          className="h-80 w-full object-contain"
        />
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow backdrop-blur transition hover:bg-background"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Próxima"
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow backdrop-blur transition hover:bg-background"
        >
          ›
        </button>
        <div className="absolute bottom-2 right-3 rounded-full bg-background/70 px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground backdrop-blur">
          {idx + 1} / {total}
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-serif text-xl">{title}</h2>
      </div>
    </div>
  );
}

function DresscodePage() {
  const { data } = useSiteContent();
  const c = (data ?? DEFAULT_CONTENT).dresscode;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="mb-10 text-center">
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">{c.eyebrow}</div>
          <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">{c.title}</h1>
          <div className="mx-auto mt-4 h-px w-12 bg-primary/50" />
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">{c.intro}</p>

        <div className="grid gap-8 sm:grid-cols-2">
          <DresscodeCarousel title={c.menTitle} images={c.men} alt="Sugestão de traje masculino" />
          <DresscodeCarousel title={c.womenTitle} images={c.women} alt="Sugestão de traje feminino" />
        </div>

        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <div className="text-[11px] uppercase tracking-widest text-destructive">{c.avoidTitle}</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-pink-400" /> Rosa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-white" /> Branco
            </span>
            <span className="text-xs text-muted-foreground">— {c.avoidNote}</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
