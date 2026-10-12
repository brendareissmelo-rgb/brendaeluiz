import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, CalendarDays, MapPin, ArrowRight } from "lucide-react";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import datePhoto from "@/assets/ceremony-date.png.asset.json";
import venuePhoto from "@/assets/ceremony-venue.png.asset.json";
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

function Section({ id, eyebrow, title, children, delay = 0, titleClass = "font-sora font-bold" }: { id: string; eyebrow?: string; title: string; children: React.ReactNode; delay?: number; titleClass?: string }) {
  return (
    <section id={id} className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:py-20">
      <FadeIn delay={delay}>
        <div className="mb-10 text-center">
          {eyebrow && (
            <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
          )}
          <h2 className={titleClass + " text-3xl tracking-tight sm:text-4xl"}>{title}</h2>
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
    <StaggerContainer className="mx-auto max-w-3xl space-y-5" staggerDelay={0.08}>
      {manuals.map((m) => {
        const isOpen = open === m.id;
        return (
          <StaggerItem key={m.id}>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_16px_36px_-18px_rgba(0,0,0,0.35)]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="group relative block h-[190px] w-full text-left sm:h-[300px]"
              >
                {m.image && (
                  <img
                    src={m.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 via-40% to-transparent to-85%" />
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]" />
                <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-background/25 bg-foreground/35 text-white backdrop-blur-sm sm:right-6 sm:top-6 sm:h-9 sm:w-9">
                  <ChevronDown className={"h-4 w-4 transition-transform " + (isOpen ? "rotate-180" : "")} />
                </span>
                <span className="absolute inset-x-0 bottom-0 block p-4 sm:p-6">
                  <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:text-[11px] sm:tracking-[0.25em]">
                    Manual
                  </span>
                  <span className="mt-1 block font-sora text-base font-bold leading-snug text-white sm:mt-1.5 sm:text-xl">
                    {m.title}
                  </span>
                  {m.subtitle && (
                    <span className="mt-1 block font-helvetica text-xs text-white/80 sm:text-sm">
                      {m.subtitle}
                    </span>
                  )}
                </span>
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
            <div className="text-[11px] uppercase tracking-[0.4em] text-white/80">VOCÊ FOI CONVIDADO(A)<br />PARA O CASAMENTO DE</div>
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
                <div className="group relative h-[190px] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_16px_36px_-18px_rgba(0,0,0,0.35)] sm:h-[300px]">
                  <img
                    src={datePhoto.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 via-40% to-transparent to-85%" />
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]" />
                  <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-background/25 bg-foreground/35 text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:h-9 sm:w-9">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:text-[11px] sm:tracking-[0.25em]">
                      Data e hora
                    </div>
                    <div className="mt-1 font-sora text-base font-bold leading-snug text-white sm:mt-1.5 sm:text-xl">
                      {c.ceremony.dateLabel}
                    </div>
                    <div className="mt-1 font-helvetica text-xs text-white/80 sm:text-sm">
                      {c.ceremony.timeLabel}
                    </div>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="group relative h-[190px] overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_16px_36px_-18px_rgba(0,0,0,0.35)] sm:h-[300px]">
                  <img
                    src={venuePhoto.url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/55 via-40% to-transparent to-85%" />
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]" />
                  <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl border border-background/25 bg-foreground/35 text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:h-9 sm:w-9">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <a
                    href={c.ceremony.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-background/25 bg-foreground/35 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm transition hover:bg-background hover:text-foreground sm:right-6 sm:top-6 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs"
                  >
                    Ver no mapa
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </a>
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white sm:text-[11px] sm:tracking-[0.25em]">
                      Local
                    </div>
                    <div className="mt-1 font-sora text-base font-bold leading-snug text-white sm:mt-1.5 sm:text-xl">
                      {c.ceremony.venue}
                    </div>
                    <div className="mt-1 font-helvetica text-xs text-white/80 sm:text-sm">
                      {c.ceremony.address}
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
