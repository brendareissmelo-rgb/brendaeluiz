import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
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

function SecretCard({ label, caption }: { label: string; caption?: string }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:border-primary/40">
      <div className="relative flex aspect-[3/4] items-center justify-center bg-gradient-to-b from-[#f7f2e9] to-[#ece3d5]">
        <span className="font-serif text-2xl font-light tracking-[0.2em] text-[#8a7a63]">
          Segredo
        </span>
      </div>
      <figcaption className="border-t border-border/60 p-4">
        <div className="text-sm font-medium">{label}</div>
        {caption ? <div className="mt-1 text-xs text-muted-foreground">{caption}</div> : null}
      </figcaption>
    </figure>
  );
}

function DresscodePage() {
  const { data, isLoading } = useSiteContent();
  const c = (data ?? DEFAULT_CONTENT).dresscode;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-5 py-14">
          <div className="mb-10 flex flex-col items-center gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          {[0, 1, 2].map((s) => (
            <div key={s} className="mb-14">
              <Skeleton className="mb-6 h-7 w-64" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
                ))}
              </div>
            </div>
          ))}
        </main>
        <SiteFooter />
      </div>
    );
  }

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

        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
