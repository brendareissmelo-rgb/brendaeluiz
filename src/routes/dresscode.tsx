import { createFileRoute } from "@tanstack/react-router";
import { Ban, Sparkles } from "lucide-react";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, SiteFooter, SiteNav } from "@/components/site-chrome";
import { useSiteContent, DEFAULT_CONTENT } from "@/lib/site-content";

import trajeNoivo from "@/assets/traje-noivo.png.asset.json";
import trajeConvidado from "@/assets/traje-convidado.png.asset.json";
import convidadoNeutro from "@/assets/convidado-neutro.png.asset.json";
import convidadoRosa from "@/assets/convidado-rosa.png.asset.json";
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

/** Tons neutros e terrosos sugeridos aos convidados. */
const PALETTE = [
  { name: "Areia", hex: "#e3d3bb" },
  { name: "Nude", hex: "#cfae94" },
  { name: "Caramelo", hex: "#b4804f" },
  { name: "Terracota", hex: "#9a5236" },
  { name: "Oliva", hex: "#6f7650" },
  { name: "Chocolate", hex: "#4b3226" },
];

function CategoryTitle({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <FadeIn className="mb-5 flex items-start gap-4">
      <span className="font-display text-[40px] font-light italic leading-none text-caramel">{n}</span>
      <div className="pt-1">
        <h2 className="font-display text-[24px] font-normal leading-tight tracking-tight sm:text-[28px]">{title}</h2>
        {note ? <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{note}</p> : null}
      </div>
    </FadeIn>
  );
}

function LookCard({
  src,
  label,
  caption,
  forbidden = false,
}: {
  src: string;
  label: string;
  caption?: string;
  forbidden?: boolean;
}) {
  return (
    <figure className="group card-invite relative flex h-full flex-col overflow-hidden rounded-[22px]">
      <div className="arch relative mx-2 mt-2 aspect-[3/4] overflow-hidden bg-gradient-to-b from-cream to-sand/80">
        <img
          src={src}
          alt={label}
          loading="lazy"
          className={`h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.03] ${
            forbidden ? "opacity-60 grayscale-[45%]" : ""
          }`}
        />
        {forbidden ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top right, transparent calc(50% - 1px), color-mix(in oklab, var(--destructive) 75%, transparent) 50%, transparent calc(50% + 1px))",
              }}
            />
            <span className="absolute bottom-2.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-destructive px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.14em] text-destructive-foreground shadow">
              <Ban className="h-3 w-3" /> Evitar
            </span>
          </>
        ) : null}
      </div>
      <figcaption className="flex flex-1 flex-col px-3.5 pb-4 pt-3">
        <div className="font-display text-[16px] leading-snug">{label}</div>
        {caption ? <div className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{caption}</div> : null}
      </figcaption>
    </figure>
  );
}

function SecretCard({ label, caption }: { label: string; caption?: string }) {
  return (
    <figure className="card-invite relative flex h-full flex-col overflow-hidden rounded-[22px]">
      <div className="arch relative mx-2 mt-2 flex aspect-[3/4] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush/50 to-sand/80">
        <Sparkles className="h-5 w-5 text-primary/60" strokeWidth={1.4} />
        <span className="mt-2 font-script text-[40px] leading-none text-primary">Segredo</span>
      </div>
      <figcaption className="flex flex-1 flex-col px-3.5 pb-4 pt-3">
        <div className="font-display text-[16px] leading-snug">{label}</div>
        {caption ? <div className="mt-1 text-[12.5px] leading-snug text-muted-foreground">{caption}</div> : null}
      </figcaption>
    </figure>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5" staggerDelay={0.07}>
      {children}
    </StaggerContainer>
  );
}

function DresscodePage() {
  const { data, isLoading } = useSiteContent();
  const c = (data ?? DEFAULT_CONTENT).dresscode;

  return (
    <div className="paper min-h-screen">
      <SiteNav />
      <PageHeader eyebrow={c.eyebrow} title={c.title}>
        {isLoading ? <Skeleton className="mx-auto h-4 w-64" /> : c.intro}
      </PageHeader>

      {isLoading ? (
        <main className="mx-auto max-w-5xl space-y-10 px-5 pb-20">
          {[0, 1].map((s) => (
            <div key={s}>
              <Skeleton className="mb-5 h-8 w-56" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="aspect-[3/4.6] w-full rounded-[22px]" />
                <Skeleton className="aspect-[3/4.6] w-full rounded-[22px]" />
              </div>
            </div>
          ))}
        </main>
      ) : (
        <main className="mx-auto max-w-5xl px-5 pb-20">
          {/* Paleta + aviso */}
          <FadeIn className="mx-auto mb-14 max-w-md space-y-3 sm:max-w-2xl">
            <div className="card-invite rounded-[24px] p-5">
              <div className="eyebrow text-center text-primary">Tons bem-vindos</div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {PALETTE.map((p) => (
                  <div key={p.name} className="flex flex-col items-center gap-1.5">
                    <span
                      className="h-10 w-10 rounded-full shadow-[inset_0_-6px_10px_rgba(0,0,0,0.12)] ring-2 ring-card sm:h-12 sm:w-12"
                      style={{ background: p.hex }}
                    />
                    <span className="text-[10px] leading-none text-muted-foreground">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-[24px] border border-destructive/20 bg-destructive/[0.06] px-5 py-4">
              <div className="flex shrink-0 -space-x-2">
                {["#f4b8c5", "#ffffff"].map((hex) => (
                  <span key={hex} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-card" style={{ background: hex }}>
                    <span className="absolute left-1/2 top-[-20%] h-[140%] w-[1.5px] -translate-x-1/2 rotate-45 bg-destructive" />
                  </span>
                ))}
              </div>
              <div>
                <div className="font-display text-[16px] text-destructive">{c.avoidTitle}</div>
                <div className="text-[13px] leading-snug text-foreground/75">{c.avoidNote}</div>
              </div>
            </div>
          </FadeIn>

          {/* Noivos */}
          <section className="mb-14">
            <CategoryTitle
              n="01"
              title="Os noivos"
              note="O traje do noivo será terno e calça azul marinho com gravata azul marinho — esta combinação é exclusiva dele."
            />
            <Grid>
              <StaggerItem>
                <LookCard
                  src={trajeNoivo.url}
                  label="Noivo"
                  caption="Terno e calça azul marinho, camisa branca, gravata azul marinho e sapato preto."
                />
              </StaggerItem>
              <StaggerItem>
                <SecretCard label="Noiva" caption="O vestido é surpresa — revelado só no grande dia." />
              </StaggerItem>
            </Grid>
          </section>

          {/* Padrinhos e madrinhas */}
          <section className="mb-14">
            <CategoryTitle
              n="02"
              title="Padrinhos & madrinhas"
              note="Padrinhos e madrinhas seguem a paleta combinada com os noivos."
            />
            <Grid>
              <StaggerItem>
                <LookCard
                  src={trajeConvidado.url}
                  label="Padrinho"
                  caption="Terno e calça preto, camisa branca, gravata azul bebê e sapato preto."
                />
              </StaggerItem>
              <StaggerItem>
                <LookCard src={vestidoRosa.url} label="Madrinha" caption="Vestido longo rosa — tom exclusivo das madrinhas." />
              </StaggerItem>
            </Grid>
          </section>

          {/* Convidados */}
          <section>
            <CategoryTitle
              n="03"
              title="Convidados"
              note="Traje social, tons neutros e terrosos. Estas combinações estão reservadas — por favor, evite."
            />
            <Grid>
              <StaggerItem>
                <LookCard
                  src={convidadoNeutro.url}
                  label="Camisa branca e calça preta"
                  caption="Esta combinação não será usada."
                  forbidden
                />
              </StaggerItem>
              <StaggerItem>
                <LookCard src={convidadoRosa.url} label="Camisa social rosa" caption="Roupa social masculina rosa." forbidden />
              </StaggerItem>
              <StaggerItem>
                <LookCard
                  src={trajeNoivo.url}
                  label="Terno azul marinho"
                  caption="Com gravata azul marinho — reservado ao noivo."
                  forbidden
                />
              </StaggerItem>
              <StaggerItem>
                <LookCard src={vestidoBranco.url} label="Vestido branco" caption="Reservado à noiva." forbidden />
              </StaggerItem>
              <StaggerItem>
                <LookCard src={vestidoRosa.url} label="Vestido rosa" caption="Reservado às madrinhas." forbidden />
              </StaggerItem>
            </Grid>
          </section>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}
