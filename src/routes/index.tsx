import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, CalendarDays, MapPin, ArrowRight } from "lucide-react";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import { Countdown } from "@/components/countdown";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent, DEFAULT_CONTENT, type Manual } from "@/lib/site-content";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brenda & Luiz — 12.12.2026" },
      { name: "description", content: "Nosso convite digital: cerimônia, dresscode, manual do convidado e mensagem dos noivos." },
      { property: "og:title", content: "Casamento de Brenda & Luiz" },
      { property: "og:description", content: "12 de dezembro de 2026 · Igreja Quadrangular Nova Vida · Belém" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: capa.url },
    ],
  }),
  component: Home,
});

function Section({ id, eyebrow, title, children, delay = 0 }: { id: string; eyebrow?: string; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:py-20">
      <FadeIn delay={delay}>
        <div className="mb-10 text-center">
          {eyebrow && (
            <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
          )}
          <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">{title}</h2>
          <div className="mx-auto mt-4 h-px w-12 bg-primary/50" />
        </div>
      </FadeIn>
      {children}
    </section>
  );
}



function ManualAccordion({ manuals }: { manuals: Manual[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <StaggerContainer className="mx-auto max-w-3xl space-y-3" staggerDelay={0.08}>
      {manuals.map((m) => {
        const isOpen = open === m.id;
        return (
          <StaggerItem key={m.id}>
            <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-accent/40"
              >
                <span>
                  <span className="block font-serif text-lg">{m.title}</span>
                  {m.subtitle && (
                    <span className="mt-0.5 block text-xs text-muted-foreground">{m.subtitle}</span>
                  )}
                </span>
                <ChevronDown
                  className={"h-4 w-4 shrink-0 text-primary transition-transform " + (isOpen ? "rotate-180" : "")}
                />
              </button>
              {isOpen && (
                <ol className="space-y-3 border-t border-border/60 px-5 py-5">
                  {m.items.map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="font-serif text-xl text-primary tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-5 py-16 sm:py-20">
      {/* Cerimônia skeleton */}
      <section className="space-y-8">
        <div className="mb-10 space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-56" />
        </div>
        <Skeleton className="mx-auto h-28 w-full max-w-md rounded-2xl" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </section>

      {/* Programação skeleton */}
      <section className="space-y-8">
        <div className="mb-10 space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-56" />
        </div>
        <div className="mx-auto max-w-2xl space-y-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-5 w-48" />
            </div>
          ))}
        </div>
      </section>

      {/* Manuais skeleton */}
      <section className="space-y-8">
        <div className="mb-10 space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-56" />
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </section>

      {/* Pré-wedding skeleton */}
      <section className="space-y-8">
        <div className="mb-10 space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-56" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-md" />
          ))}
        </div>
      </section>

      {/* Presente skeleton */}
      <section className="space-y-8">
        <div className="mb-10 space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-56" />
        </div>
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Skeleton className="mx-auto h-4 w-full" />
          <Skeleton className="mx-auto h-4 w-5/6" />
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-10 w-40 rounded-md" />
        </div>
      </section>
    </div>
  );
}


function Home() {
  const [copied, setCopied] = useState(false);
  const { data, isLoading } = useSiteContent();
  const c = data ?? DEFAULT_CONTENT;

  const copyPix = async () => {
    await navigator.clipboard.writeText(c.gift.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      {/* HERO */}
      <header className="relative h-[100svh] w-full overflow-hidden">
        <img
          src={capa.url}
          alt="Brenda e Luiz"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 text-center text-white">
          <FadeIn delay={0.2} direction="up">
            <div className="text-[11px] uppercase tracking-[0.4em] text-white/80">Casamento de</div>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <h1 className="mt-3 font-serif text-5xl font-light tracking-tight sm:text-7xl">
              Brenda <span className="text-primary">&</span> Luiz
            </h1>
          </FadeIn>
          <FadeIn delay={0.6} direction="up">
            <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/90">
              <span>12 · 12 · 2026</span>
              <span className="h-px w-8 bg-white/60" />
              <span>Belém · PA</span>
            </div>
          </FadeIn>
        </div>
      </header>

      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          {/* CERIMÔNIA */}
          <Section id="cerimonia" eyebrow={c.ceremony.eyebrow} title={c.ceremony.title}>
            <FadeIn delay={0.1}>
              <div className="mx-auto mb-10 flex justify-center rounded-2xl border border-border/60 bg-card/70 px-6 py-7 backdrop-blur sm:w-fit">
                <Countdown />
              </div>
            </FadeIn>

            <StaggerContainer className="grid gap-5 sm:grid-cols-2" staggerDelay={0.12}>
              <StaggerItem>
                <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Data e hora</div>
                      <div className="mt-1.5 font-serif text-xl font-light leading-snug">{c.ceremony.dateLabel}</div>
                      <div className="mt-1 font-helvetica text-sm text-muted-foreground">{c.ceremony.timeLabel}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
                  <div className="relative flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Local</div>
                      <div className="mt-1.5 font-serif text-xl font-light leading-snug">{c.ceremony.venue}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{c.ceremony.address}</div>
                      <a
                        href={c.ceremony.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group/btn mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-medium tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground"
                      >
                        Ver no mapa
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </Section>

          {/* PROGRAMAÇÃO */}
          <Section id="programacao" eyebrow="O grande dia" title="Programação do dia">
            <StaggerContainer className="mx-auto max-w-2xl" staggerDelay={0.08}>
              <ol className="relative space-y-1 border-l border-border/60 pl-6">
                {c.ceremony.timeline.map((t, i) => (
                  <StaggerItem key={i}>
                    <li className="relative flex items-baseline justify-between gap-4 py-3">
                      <span className="absolute -left-[1.62rem] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-background" />
                      <span className="font-helvetica text-base tabular-nums text-primary">{t.time}</span>
                      <span className="flex-1 border-b border-dashed border-border/50" />
                      <span className="text-sm text-foreground/90">{t.label}</span>
                    </li>
                  </StaggerItem>
                ))}
              </ol>
            </StaggerContainer>
          </Section>

          {/* MANUAIS */}
          <Section id="manual" eyebrow={c.manuals.eyebrow} title={c.manuals.title}>
            <ManualAccordion manuals={c.manuals.list} />
          </Section>

          {/* PRÉ-WEDDING */}
          <Section id="prewedding" eyebrow={c.prewedding.eyebrow} title={c.prewedding.title}>
            <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-4" staggerDelay={0.08}>
              {c.prewedding.photos.map((url, i) => (
                <StaggerItem key={i}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-md">
                    <img src={url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/25" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Section>

          {/* PRESENTE / PIX */}
          <Section id="presente" eyebrow={c.gift.eyebrow} title={c.gift.title}>
            <FadeIn delay={0.1}>
              <div className="mx-auto max-w-2xl p-2 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">{c.gift.text}</p>
                <div className="mt-6">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{c.gift.pixLabel}</div>
                  <div className="mt-2 font-helvetica text-sm break-all">{c.gift.pixKey}</div>
                </div>
                <button
                  onClick={copyPix}
                  className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  {copied ? "Copiado ✓" : "Copiar chave Pix"}
                </button>
              </div>
            </FadeIn>
          </Section>
        </>
      )}

      <SiteFooter />
      <div id="top" className="absolute top-0" />

    </div>
  );
}
