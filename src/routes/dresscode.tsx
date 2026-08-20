import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { useSiteContent, DEFAULT_CONTENT } from "@/lib/site-content";

import trajeNoivo from "@/assets/traje-noivo.png.asset.json";
import trajeConvidado from "@/assets/traje-convidado.png.asset.json";
import vestidoBranco from "@/assets/vestido-branco.png.asset.json";
import vestidoRosa from "@/assets/vestido-rosa-madrinha.png.asset.json";

export const Route = createFileRoute("/dresscode")({
  head: () => ({
    meta: [
      { title: "Dresscode — Brenda & Luiz" },
      {
        name: "description",
        content: "Sugestões de traje para noivos, padrinhos e convidados do casamento de Brenda e Luiz.",
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

function SectionTitle({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
      <h2 className="mt-1 font-serif text-2xl font-light tracking-tight sm:text-[28px]">{title}</h2>
      {note ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
}

function LookCard({
  src,
  label,
  caption,
  forbidden = false,
  forbiddenLabel = "Não pode",
}: {
  src: string;
  label: string;
  caption?: string;
  forbidden?: boolean;
  forbiddenLabel?: string;
}) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:border-primary/40">
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#f7f2e9] to-[#ece3d5]">
        <img
          src={src}
          alt={label}
          loading="lazy"
          className={`h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03] ${
            forbidden ? "opacity-70 grayscale-[35%]" : ""
          }`}
        />
        {forbidden ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top left, transparent calc(50% - 1.5px), rgba(220,38,38,.85) 50%, transparent calc(50% + 1.5px)), linear-gradient(to top right, transparent calc(50% - 1.5px), rgba(220,38,38,.85) 50%, transparent calc(50% + 1.5px))",
              }}
            />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-destructive-foreground shadow">
              <X className="h-3 w-3" /> {forbiddenLabel}
            </span>
          </>
        ) : null}
      </div>
      <figcaption className="border-t border-border/60 p-4">
        <div className="text-sm font-medium">{label}</div>
        {caption ? <div className="mt-1 text-xs text-muted-foreground">{caption}</div> : null}
      </figcaption>
    </figure>
  );
}

function Gallery({ title, images, alt }: { title: string; images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const total = images.length;
  if (total === 0) return null;
  const idx = ((i % total) + total) % total;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <h3 className="font-serif text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-muted-foreground">
            {idx + 1}/{total}
          </span>
          <button
            type="button"
            onClick={() => setI(idx - 1)}
            aria-label="Anterior"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 transition hover:border-primary/50 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setI(idx + 1)}
            aria-label="Próxima"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 transition hover:border-primary/50 hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] bg-[#f5efe4]">
        <img
          src={images[idx]}
          alt={`${alt} ${idx + 1}`}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto p-3">
        {images.map((src, n) => (
          <button
            key={src + n}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Ver opção ${n + 1}`}
            className={`h-14 w-12 shrink-0 overflow-hidden rounded-md border bg-[#f5efe4] transition ${
              n === idx ? "border-primary" : "border-border/50 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
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
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground">{c.intro}</p>
        </div>

        {/* Noivos */}
        <section className="mb-14">
          <SectionTitle
            eyebrow="Categoria 01"
            title="Dresscode dos noivos"
            note="O traje do noivo será terno e calça azul marinho com gravata azul marinho — esta combinação é exclusiva dele."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <LookCard
              src={trajeNoivo.url}
              label="Noivo"
              caption="Terno e calça azul marinho, camisa branca, gravata azul marinho e sapato preto."
            />
          </div>
        </section>

        {/* Padrinhos e madrinhas */}
        <section className="mb-14">
          <SectionTitle
            eyebrow="Categoria 02"
            title="Dresscode do padrinho e madrinha"
            note="Padrinhos e madrinhas seguem a paleta combinada com os noivos."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <LookCard
              src={trajeConvidado.url}
              label="Padrinho"
              caption="Terno e calça preto, camisa branca, gravata azul bebê e sapato preto."
            />
            <LookCard
              src={vestidoRosa.url}
              label="Madrinha"
              caption="Vestido longo rosa — tom exclusivo das madrinhas."
            />
          </div>
        </section>

        {/* Convidados */}
        <section className="mb-14">
          <SectionTitle
            eyebrow="Categoria 03"
            title="Dresscode dos convidados"
            note="Traje social, tons neutros e terrosos. Veja abaixo as combinações que pedimos que sejam evitadas."
          />

          <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <LookCard
              src={trajeConvidado.url}
              label="Convidado"
              caption="Terno social em tom neutro, camisa branca e gravata clara."
            />
            <LookCard
              src={trajeNoivo.url}
              label="Terno azul marinho com gravata azul marinho"
              caption="Reservado ao noivo — por favor, evite esta combinação."
              forbidden
            />
            <LookCard
              src={vestidoBranco.url}
              label="Vestido branco"
              caption="Reservado à noiva — por favor, evite."
              forbidden
            />
            <LookCard
              src={vestidoRosa.url}
              label="Vestido rosa"
              caption="Reservado às madrinhas — por favor, evite."
              forbidden
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Gallery title={c.menTitle} images={c.men} alt="Sugestão de traje masculino" />
            <Gallery title={c.womenTitle} images={c.women} alt="Sugestão de traje feminino" />
          </div>
        </section>

        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
          <div className="text-[11px] uppercase tracking-widest text-destructive">{c.avoidTitle}</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-pink-400" /> Rosa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-white" /> Branco
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-[#1b2a4a]" /> Azul marinho completo
            </span>
            <span className="text-xs text-muted-foreground">— {c.avoidNote}</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
