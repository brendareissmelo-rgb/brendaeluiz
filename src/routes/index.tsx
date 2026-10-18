import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CalendarDays, Clock, MapPin, Navigation, Copy, Check, Gift, Heart } from "lucide-react";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import venuePhoto from "@/assets/ceremony-venue.png.asset.json";
import { Countdown } from "@/components/countdown";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { Branch, Monogram, OakLeaf, Ornament } from "@/components/ornaments";
import { SectionHeading, SiteFooter, SiteNav } from "@/components/site-chrome";
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

function Section({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={"relative scroll-mt-6 px-5 py-20 sm:scroll-mt-24 sm:py-28 " + className}>
      <div className="relative mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

/* ───────────────── Hero ───────────────── */

function Hero() {
  return (
    <header className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-cocoa">
      <motion.img
        src={capa.url}
        alt="Brenda e Luiz"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cocoa/45 via-transparent via-35% to-cocoa/95" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-cocoa/80 to-transparent" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+18px)] sm:hidden">
        <Monogram tone="light" className="h-11 w-11 text-[22px]" />
        <span className="eyebrow text-white/80">12 · 12 · 26</span>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-[calc(env(safe-area-inset-bottom)+124px)] text-center text-white sm:pb-24">
        <FadeIn delay={0.3}>
          <div className="eyebrow leading-[2] text-white/80">
            Você foi convidado(a)
            <br />
            para o casamento de
          </div>
        </FadeIn>
        <FadeIn delay={0.5}>
          <h1 className="mt-3 font-script text-[78px] leading-[0.9] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-[120px]">
            Brenda
            <span className="mx-2 block font-display text-[34px] sm:mx-5 font-light italic text-blush sm:inline sm:text-6xl">
              &amp;
            </span>
            Luiz
          </h1>
        </FadeIn>
        <FadeIn delay={0.7}>
          <div className="mt-6 flex items-center gap-4 font-display text-[15px] font-light tracking-[0.18em] text-white/90">
            <span>12 · 12 · 2026</span>
            <span className="h-4 w-px bg-white/50" />
            <span>Belém · PA</span>
          </div>
        </FadeIn>
        <a
          href="#convite"
          aria-label="Rolar para o convite"
          className="animate-cue mt-8 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/90 backdrop-blur-sm"
        >
          <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

/* ───────────────── Introdução + contagem ───────────────── */

function Intro({ photos }: { photos: string[] }) {
  const [a, b] = [photos[0], photos[1] ?? photos[0]];
  return (
    <Section id="convite" className="overflow-hidden pt-16">
      <div className="watercolor absolute -left-40 -top-24 h-80 w-80" />
      <Branch className="absolute -left-14 -top-6 h-44 w-44 text-caramel/55" />
      <Branch className="absolute -right-12 bottom-6 h-40 w-40 rotate-180 text-caramel/45" />

      <div className="relative mx-auto max-w-md text-center">
        {a && (
          <FadeIn className="mb-8 flex justify-center">
            <div className="flex items-center">
              <img
                src={a}
                alt=""
                className="h-28 w-28 rounded-full border-4 border-card object-cover object-[50%_88%] shadow-[0_14px_30px_-14px_rgba(58,40,32,0.5)]"
              />
              <img
                src={b}
                alt=""
                className="-ml-5 h-28 w-28 rounded-full border-4 border-card object-cover object-[50%_88%] shadow-[0_14px_30px_-14px_rgba(58,40,32,0.5)]"
              />
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-3 text-blush">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <h2 className="font-script text-[52px] leading-none text-primary sm:text-6xl">Vamos nos casar!</h2>
            <Heart className="h-3.5 w-3.5 fill-current" />
          </div>
          <p className="mt-4 font-display text-xl font-light italic leading-snug text-foreground/80">
            E queremos você ao nosso lado
            <br />
            nesse dia tão sonhado.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-10">
          <div className="eyebrow mb-4 text-muted-foreground">Faltam</div>
          <Countdown />
        </FadeIn>
      </div>
    </Section>
  );
}

/* ───────────────── Cerimônia ───────────────── */

function Ceremony({ c }: { c: typeof DEFAULT_CONTENT.ceremony }) {
  return (
    <Section id="cerimonia" className="bg-gradient-to-b from-transparent via-sand/35 to-transparent">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} />
      <FadeIn className="mx-auto max-w-md">
        <article className="card-invite relative overflow-hidden rounded-[28px] p-3 pb-6">
          <div className="arch relative h-[300px] overflow-hidden sm:h-[340px]">
            <img src={venuePhoto.url} alt={c.venue} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-cocoa/40 to-transparent" />
          </div>

          {/* selo da data */}
          <div className="relative -mt-12 flex justify-center">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-primary/20 bg-card text-center shadow-[0_14px_30px_-14px_rgba(58,40,32,0.5)]">
              <span className="eyebrow !text-[9px] !tracking-[0.28em] text-muted-foreground">Sáb</span>
              <span className="font-display text-[34px] font-normal leading-none text-primary">12</span>
              <span className="eyebrow !text-[9px] !tracking-[0.28em] text-muted-foreground">Dez 2026</span>
            </div>
          </div>

          <div className="mt-4 divide-y divide-dashed divide-border px-3">
            <InfoRow icon={CalendarDays} label="Data" title={c.dateLabel} />
            <InfoRow icon={Clock} label="Horário" title={c.timeLabel} />
            <InfoRow icon={MapPin} label="Local" title={c.venue} sub={c.address} />
          </div>

          <div className="mt-6 px-3">
            <a
              href={c.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium tracking-wide text-primary-foreground shadow-[0_12px_24px_-12px_var(--color-primary)] transition active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" /> Como chegar
            </a>
          </div>
        </article>
      </FadeIn>
    </Section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  title,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3.5 py-3.5">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand/70 text-primary">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
      </span>
      <div className="min-w-0">
        <div className="eyebrow !text-[9.5px] text-muted-foreground">{label}</div>
        <div className="mt-1 font-display text-[17px] leading-snug text-foreground">{title}</div>
        {sub && <div className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

/* ───────────────── Programação ───────────────── */

function Timeline({ items }: { items: { time: string; label: string }[] }) {
  return (
    <Section id="programacao">
      <SectionHeading eyebrow="O grande dia" title="Programação" script />
      <StaggerContainer className="relative mx-auto max-w-md" staggerDelay={0.08}>
        <span className="absolute bottom-6 left-[76px] top-6 w-px bg-gradient-to-b from-transparent via-primary/35 to-transparent" />
        <ol className="space-y-2">
          {items.map((t, i) => (
            <StaggerItem key={i}>
              <li className="relative grid grid-cols-[64px_24px_1fr] items-center gap-0 py-2.5">
                <span className="text-right font-display text-[22px] font-light tabular-nums text-primary">{t.time}</span>
                <span className="relative flex justify-center">
                  <span className="h-3 w-3 rounded-full border-2 border-primary bg-background" />
                </span>
                <span className="rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-[15px] leading-snug text-foreground shadow-[0_10px_22px_-18px_rgba(58,40,32,0.55)]">
                  {t.label}
                </span>
              </li>
            </StaggerItem>
          ))}
        </ol>
      </StaggerContainer>
    </Section>
  );
}

/* ───────────────── Manuais ───────────────── */

function ManualAccordion({ manuals }: { manuals: Manual[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <StaggerContainer className="mx-auto max-w-md space-y-4 sm:max-w-3xl" staggerDelay={0.08}>
      {manuals.map((m, idx) => {
        const isOpen = open === m.id;
        return (
          <StaggerItem key={m.id}>
            <div className="card-invite overflow-hidden rounded-[26px]">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
                className="group relative block h-[210px] w-full text-left sm:h-[280px]"
              >
                {m.image && (
                  <img
                    src={m.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-cocoa/45 via-45% to-transparent" />
                <span className="absolute left-5 top-5 font-display text-sm italic text-white/85">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  className={
                    "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition-colors " +
                    (isOpen ? "bg-cream text-primary" : "bg-white/10 text-white")
                  }
                >
                  <ChevronDown className={"h-4 w-4 transition-transform duration-300 " + (isOpen ? "rotate-180" : "")} />
                </span>
                <span className="absolute inset-x-0 bottom-0 block p-5">
                  <span className="eyebrow block !text-[9.5px] text-white/75">Manual</span>
                  <span className="mt-1 block font-display text-[24px] font-normal leading-tight text-white">
                    {m.title.replace(/^Manual d[oa]s?\s+/i, "")}
                  </span>
                  {m.subtitle && <span className="mt-1 block text-[13px] text-white/80">{m.subtitle}</span>}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ol className="space-y-4 px-5 py-6">
                      {m.items.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand/70 font-display text-[13px] tabular-nums text-primary">
                            {i + 1}
                          </span>
                          <p className="pt-0.5 text-[14.5px] leading-relaxed text-foreground/85">{item}</p>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

/* ───────────────── Pré-wedding ───────────────── */

function Gallery({ eyebrow, title, photos }: { eyebrow: string; title: string; photos: string[] }) {
  if (!photos.length) return null;
  return (
    <section id="registros" className="relative overflow-hidden py-20 sm:py-28">
      <div className="px-5">
        <SectionHeading eyebrow={eyebrow} title={title} script />
      </div>
      <FadeIn>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[12vw] pb-4 sm:justify-center sm:px-5">
          {photos.map((p, i) => (
            <figure
              key={i}
              className={
                "arch relative w-[68vw] max-w-[280px] shrink-0 snap-center overflow-hidden border-4 border-card shadow-[0_22px_40px_-24px_rgba(58,40,32,0.6)] sm:w-60 " +
                (i % 2 ? "sm:translate-y-8" : "")
              }
            >
              <img src={p} alt="" loading="lazy" className="aspect-[3/4.4] h-full w-full object-cover" />
            </figure>
          ))}
        </div>
      </FadeIn>
      <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-muted-foreground uppercase sm:hidden">
        Deslize para o lado
      </p>
    </section>
  );
}

/* ───────────────── Presente ───────────────── */

function GiftSection({ g }: { g: typeof DEFAULT_CONTENT.gift }) {
  const [copied, setCopied] = useState(false);
  const copyPix = async () => {
    await navigator.clipboard.writeText(g.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="presente">
      <FadeIn className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-b from-sand/80 to-sand/40 px-6 pb-8 pt-10 text-center ring-1 ring-border">
          <OakLeaf className="absolute -right-3 -top-2 h-24 w-16 rotate-[25deg] text-caramel/70" />
          <OakLeaf className="absolute -bottom-4 -left-2 h-20 w-14 -rotate-[30deg] text-gold-300" />

          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-card text-primary shadow-[0_10px_22px_-12px_rgba(58,40,32,0.5)]">
            <Gift className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <div className="eyebrow mt-5 text-primary">{g.eyebrow}</div>
          <h2 className="mt-2 font-display text-[32px] font-normal leading-tight">{g.title}</h2>
          <Ornament className="mt-3" />
          <p className="mt-5 text-[14.5px] leading-relaxed text-foreground/75">{g.text}</p>

          <div className="mt-7 rounded-2xl border border-dashed border-primary/35 bg-card/80 px-4 py-4">
            <div className="eyebrow !text-[9.5px] text-muted-foreground">{g.pixLabel}</div>
            <div className="mt-1.5 break-all font-display text-[17px] text-foreground">{g.pixKey}</div>
          </div>

          <button
            onClick={copyPix}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium tracking-wide text-primary-foreground shadow-[0_12px_24px_-12px_var(--color-primary)] transition active:scale-[0.98]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Chave copiada!" : "Copiar chave Pix"}
          </button>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ───────────────── Esqueleto ───────────────── */

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-16 px-5 py-20">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="-ml-5 h-28 w-28 rounded-full" />
        </div>
        <Skeleton className="mx-auto h-12 w-64" />
        <div className="grid grid-cols-4 gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="mx-auto h-3 w-24" />
        <Skeleton className="mx-auto h-9 w-48" />
        <Skeleton className="h-[520px] w-full rounded-[28px]" />
      </div>
    </div>
  );
}

/* ───────────────── Página ───────────────── */

function Home() {
  const { data, isLoading } = useSiteContent();
  const c = data ?? DEFAULT_CONTENT;

  // Ao chegar de outra página com #presente (ou outra âncora), rola até a seção quando ela existir.
  useEffect(() => {
    if (isLoading) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <div className="paper min-h-screen">
      <SiteNav />
      <Hero />

      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <Intro photos={c.prewedding.photos} />
          <Ceremony c={c.ceremony} />
          <Timeline items={c.ceremony.timeline} />
          <Section id="manual" className="bg-gradient-to-b from-transparent via-sand/35 to-transparent">
            <SectionHeading eyebrow={c.manuals.eyebrow} title={c.manuals.title} />
            <ManualAccordion manuals={c.manuals.list} />
          </Section>
          <GiftSection g={c.gift} />
          <Gallery eyebrow={c.prewedding.eyebrow} title={c.prewedding.title} photos={c.prewedding.photos} />
        </>
      )}

      <SiteFooter />
    </div>
  );
}
