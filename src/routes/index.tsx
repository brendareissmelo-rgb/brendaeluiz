import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ArrowUpRight,
  Car,
  Check,
  Church,
  Copy,
  Gift,
  MapPin,
  PartyPopper,
  Shirt,
  Armchair,
  Clock,
  Users,
  HeartHandshake,
  Sparkles,
  BookOpen,
} from "lucide-react";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import { Countdown } from "@/components/countdown";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/fade-in";
import { Branch, OakLeaf } from "@/components/ornaments";
import { SectionHeading, SiteFooter, SiteNav } from "@/components/site-chrome";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useSiteContent, DEFAULT_CONTENT, type Manual, type SiteContent, type TimelineItem } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brenda & Luiz — 12.12.2026" },
      { name: "description", content: "Nosso convite digital: cerimônia, festa, manual do convidado e mensagem dos noivos." },
      { property: "og:title", content: "Casamento de Brenda & Luiz" },
      { property: "og:description", content: "12 de dezembro de 2026 · Igreja Quadrangular Nova Vida · Belém" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: capa.url },
    ],
  }),
  component: Home,
});

/** Extrai "17h", "19h30"… de um texto como "Cerimônia às 17h". */
const hourOf = (s: string) => s.match(/\d{1,2}\s?h(?:\s?\d{2})?|\d{1,2}:\d{2}/i)?.[0]?.replace(/\s/g, "") ?? "";

function Section({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={"relative scroll-mt-16 px-5 py-20 sm:py-28 " + className}>
      <div className="relative mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

/* ───────────────── Hero ───────────────── */

/** Selo giratório com a data em volta. */
function DateSeal({ className = "" }: { className?: string }) {
  return (
    <div className={"flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_-12px_var(--color-primary)] " + className}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite]" aria-hidden="true">
        <defs>
          <path id="seal-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fill="currentColor" fontSize="8.4" letterSpacing="2.6" fontFamily="Jost, sans-serif" fontWeight={500}>
          <textPath href="#seal-circle">SÁBADO · DEZEMBRO · 2026 · BELÉM ·</textPath>
        </text>
      </svg>
      <span className="font-display text-[26px] font-normal leading-none">12</span>
    </div>
  );
}

function Hero() {
  return (
    <>
      {/* Foto do casal em tela cheia, por baixo do menu */}
      <header className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-cocoa">
        <motion.img
          src={capa.url}
          alt="Brenda e Luiz"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cocoa/45 via-transparent via-30% to-cocoa/90" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-cocoa/85 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-[calc(env(safe-area-inset-bottom)+64px)] text-center text-white sm:pb-24">
          <FadeIn delay={0.3}>
            <div className="eyebrow leading-[2] text-white/85">
              Você foi convidado(a)
              <br />
              para o casamento de
            </div>
          </FadeIn>
          <FadeIn delay={0.5}>
            <h1 className="mt-3 font-script text-[84px] leading-[0.86] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-[124px]">
              Brenda
              <span className="my-1 block font-display text-[32px] font-light italic leading-none text-blush sm:mx-5 sm:inline sm:text-6xl">
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
            href="#contagem"
            aria-label="Rolar para baixo"
            className="animate-cue mt-8 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 text-white/90 backdrop-blur-sm"
          >
            <ChevronDown className="h-4 w-4" />
          </a>
        </div>

      </header>

      <section id="contagem" className="relative flow-root px-5 pb-14">
        {/* Selo por cima da divisa entre a foto e a contagem */}
        <DateSeal className="absolute -top-[52px] right-5 z-20 h-[104px] w-[104px] sm:right-10" />
      {/* Contagem */}
      <FadeIn delay={0.5} className="relative mx-auto mt-16 max-w-md">
        <div className="mb-4 flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
          <span className="h-px w-8 bg-border" /> Faltam <span className="h-px w-8 bg-border" />
        </div>
        <Countdown />
      </FadeIn>
      </section>
    </>
  );
}

/* ───────────────── Roteiro: igreja → festa ───────────────── */

function MapButton({ href, light }: { href: string; light?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        "inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium tracking-wide transition active:scale-[0.98] " +
        (light
          ? "bg-cream text-cocoa"
          : "bg-primary text-primary-foreground shadow-[0_12px_24px_-12px_var(--color-primary)]")
      }
    >
      <MapPin className="h-4 w-4" /> Como chegar
    </a>
  );
}

function StopNumber({ n, dark }: { n: number; dark?: boolean }) {
  return (
    <span
      className={
        "flex h-9 w-9 items-center justify-center rounded-full font-display text-[16px] " +
        (dark ? "bg-cream text-cocoa" : "bg-cocoa text-cream")
      }
    >
      {n}
    </span>
  );
}

/** Cartão de parada do roteiro: mesmo desenho em versão escura (festa) e clara (igreja). */
function StopCard({
  n,
  tone,
  step,
  icon: Icon,
  eyebrow,
  title,
  hour,
  watermark,
  description,
  venue,
  address,
  chip,
  mapsUrl,
}: {
  n: number;
  tone: "light" | "dark";
  step: string;
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  hour: string;
  watermark: string;
  description?: string;
  venue: string;
  address: string;
  chip?: string;
  mapsUrl: string;
}) {
  const dark = tone === "dark";
  return (
    <article
      className={
        "relative h-full overflow-hidden rounded-[30px] px-6 pb-7 pt-6 " +
        (dark ? "panel-dark" : "bg-gradient-to-br from-[#fbf3e8] via-sand to-[#e6cfb2] text-cocoa ring-1 ring-[#e2cdb1] shadow-[0_24px_48px_-28px_rgba(58,40,32,0.45)]")
      }
    >
      <div
        className={
          "pointer-events-none absolute -right-6 -top-4 font-script text-[130px] leading-none " +
          (dark ? "text-cream/[0.07]" : "text-primary/[0.09]")
        }
      >
        {watermark}
      </div>
      <Branch className={"absolute -bottom-10 -right-10 h-44 w-44 " + (dark ? "text-cream/10" : "text-primary/15")} />

      <div
        className={
          "relative flex w-fit items-center gap-2 rounded-full py-1 pl-1 pr-3 ring-1 " +
          (dark ? "bg-cream/10 ring-cream/15" : "bg-white/55 ring-cocoa/10")
        }
      >
        <StopNumber n={n} dark={dark} />
        <span className={"text-[11px] font-medium uppercase tracking-[0.18em] " + (dark ? "text-cream/80" : "text-cocoa/75")}>{step}</span>
      </div>

      <div className="relative mt-8 flex items-end justify-between gap-4">
        <div>
          <div className={"eyebrow !text-[9.5px] " + (dark ? "text-blush" : "text-primary")}>
            <Icon className="mr-1 inline h-3.5 w-3.5 -translate-y-px" /> {eyebrow}
          </div>
          <h3 className="mt-2 font-display text-[30px] font-normal leading-none">{title}</h3>
        </div>
        <div className={"font-display text-[40px] font-light leading-none " + (dark ? "text-blush" : "text-primary")}>{hour}</div>
      </div>

      {description && <p className={"relative mt-5 text-[14.5px] leading-relaxed " + (dark ? "text-cream/80" : "text-cocoa/75")}>{description}</p>}

      <div className="relative mt-5 space-y-1">
        <div className="text-[16px] font-medium">{venue}</div>
        <div className={"text-[14px] leading-snug " + (dark ? "text-cream/65" : "text-cocoa/60")}>{address}</div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        <MapButton href={mapsUrl} light={dark} />
        {chip && (
          <span
            className={
              "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] ring-1 " +
              (dark ? "bg-cream/10 text-cream/85 ring-cream/15" : "bg-white/55 text-cocoa/80 ring-cocoa/10")
            }
          >
            <Clock className="h-3.5 w-3.5" /> {chip}
          </span>
        )}
      </div>
    </article>
  );
}

function Roteiro({ c, r }: { c: SiteContent["ceremony"]; r: SiteContent["reception"] }) {
  return (
    <Section id="roteiro">
      <SectionHeading eyebrow={c.eyebrow} title="O grande dia" />
      <FadeIn className="-mt-4 mb-12 text-center text-[15px] text-muted-foreground">{c.dateLabel}</FadeIn>

      <div className="relative mx-auto max-w-md md:max-w-4xl">
        <div className="grid gap-5 md:grid-cols-2 md:gap-8">
          <FadeIn>
            <StopCard
              n={1}
              tone="light"
              step="Primeiro"
              icon={Church}
              eyebrow="Cerimônia"
              title={c.title}
              hour={hourOf(c.timeLabel) || "17h"}
              watermark="Sim"
              description="O momento do nosso sim, diante de Deus, da família e dos amigos."
              venue={c.venue}
              address={c.address}
              chip="Chegue 20 min antes"
              mapsUrl={c.mapsUrl}
            />
          </FadeIn>

          {/* Ligação entre as paradas (mobile) */}
          <div className="flex items-center justify-center gap-3 py-1 md:hidden" aria-hidden="true">
            <span className="h-px w-8 border-t border-dashed border-primary/50" />
            <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[12px] text-muted-foreground">
              <Car className="h-4 w-4 text-primary" /> depois, seguimos para a festa
            </span>
            <span className="h-px w-8 border-t border-dashed border-primary/50" />
          </div>

          <FadeIn delay={0.1}>
            <StopCard
              n={2}
              tone="dark"
              step="Em seguida"
              icon={PartyPopper}
              eyebrow={r.eyebrow}
              title={r.title}
              hour={hourOf(r.timeLabel) || "19h"}
              watermark="Festa"
              description={r.description}
              venue={r.venue}
              address={r.address}
              chip={r.endLabel}
              mapsUrl={r.mapsUrl}
            />
          </FadeIn>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────── Programação ───────────────── */

/** Separa "Salão (Realiza Festas) Tv. Timbó, 2634" em título + endereço quando não há `place`. */
function splitPlace(t: TimelineItem) {
  if (t.place) return { title: t.label, place: t.place };
  const m = t.label.match(/^(.*?)[\s,–—-]+((?:Tv\.|Trav\.|Travessa|Rua|R\.|Av\.|Avenida|Alameda|Rod\.|Rodovia|Estrada)\s.*)$/i);
  return m ? { title: m[1].trim(), place: m[2].trim() } : { title: t.label, place: "" };
}

function Programacao({ items }: { items: TimelineItem[] }) {
  if (!items.length) return null;
  return (
    <Section id="programacao" className="pt-4">
      <SectionHeading eyebrow="Hora a hora" title="Programação" />
      <FadeIn className="mx-auto max-w-md">
        <div className="card-invite relative rounded-[30px] px-6 py-2">
          {/* recortes de "ingresso" */}
          <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background shadow-[inset_-1px_0_0_var(--color-border)]" />
          <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background shadow-[inset_1px_0_0_var(--color-border)]" />
          <ol className="divide-y divide-dashed divide-border">
            {items.map((t, i) => {
              const { title, place } = splitPlace(t);
              return (
                <li key={i} className="flex items-start gap-5 py-5">
                  <span className="w-[78px] shrink-0 font-display text-[30px] font-light leading-none tabular-nums text-primary">
                    {t.time}
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-[15.5px] font-medium leading-snug text-foreground">{title}</span>
                    {place && (
                      <span className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caramel" />
                        {place}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ───────────────── Manuais ───────────────── */

/** Cores dos cartões de manual (fundo, destaque, marca d'água). */
const MANUAL_TONES = [
  { bg: "bg-gradient-to-br from-[#b0623f] via-primary to-[#7a3e28]", accent: "text-blush", icon: Users },
  { bg: "bg-gradient-to-br from-[#7a8a5e] via-[#5f6f47] to-[#414d30]", accent: "text-[#e3e8c8]", icon: HeartHandshake },
  { bg: "bg-gradient-to-br from-[#c9955f] via-[#a87443] to-[#7a5130]", accent: "text-[#fbe7cc]", icon: Sparkles },
  { bg: "bg-gradient-to-br from-[#6f879b] via-[#56697a] to-[#3b4a57]", accent: "text-[#dbe6ef]", icon: BookOpen },
];

function Manuais({ eyebrow, title, list }: { eyebrow: string; title: string; list: Manual[] }) {
  const [open, setOpen] = useState<Manual | null>(null);
  return (
    <section id="manual" className="relative scroll-mt-16 overflow-hidden bg-sand/45 py-20 sm:py-28">
      <div className="px-5">
        <SectionHeading eyebrow={eyebrow} title={title} />
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[9vw] pb-2 md:justify-center md:px-5">
        {list.map((m, i) => {
          const tone = MANUAL_TONES[i % MANUAL_TONES.length];
          const Icon = tone.icon;
          const short = m.title.replace(/^Manual d[oa]s?\s+/i, "");
          return (
            <FadeIn key={m.id} delay={i * 0.06} className="w-[74vw] max-w-[300px] shrink-0 snap-center md:w-72">
              <button
                type="button"
                onClick={() => setOpen(m)}
                className={`group relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-[28px] p-5 text-left text-cream shadow-[0_24px_44px_-26px_rgba(58,40,32,0.7)] ${tone.bg}`}
              >
                <div className="pointer-events-none absolute -right-4 top-10 font-script text-[110px] leading-none text-white/[0.08]">
                  {short.split(" ")[0]}
                </div>
                <Branch className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 text-white/10" />

                <div className="relative flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="font-display text-[15px] italic text-white/70">{String(i + 1).padStart(2, "0")}</span>
                </div>

                <div className="relative mt-auto">
                  <span className={`eyebrow block !text-[9.5px] ${tone.accent}`}>Manual</span>
                  <span className="mt-2 block font-display text-[30px] font-normal leading-[1.02]">{short}</span>
                  {m.subtitle && <span className="mt-2 block text-[13.5px] leading-snug text-white/75">{m.subtitle}</span>}
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-[12.5px] font-medium text-cocoa transition group-active:scale-95">
                    Ler orientações <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-3 block text-[11.5px] text-white/60">{m.items.length} combinados</span>
                </div>
              </button>
            </FadeIn>
          );
        })}
      </div>
      {list.length > 1 && (
        <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:hidden">
          Deslize para ver todos
        </p>
      )}

      <Drawer open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DrawerContent className="max-h-[88svh] border-border bg-card">
          {open && (
            <div className="overflow-y-auto">
              <DrawerHeader className="px-6 pb-2 pt-4 text-left">
                <div className="eyebrow !text-[9.5px] text-primary">Manual</div>
                <DrawerTitle className="font-display text-[28px] font-normal leading-tight">{open.title}</DrawerTitle>
                {open.subtitle && <DrawerDescription className="text-[14px]">{open.subtitle}</DrawerDescription>}
              </DrawerHeader>
              <ol className="mx-auto max-w-xl space-y-4 px-6 pb-[calc(env(safe-area-inset-bottom)+32px)] pt-3">
                {open.items.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand font-display text-[14px] text-primary">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[15px] leading-relaxed text-foreground/85">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </section>
  );
}

/* ───────────────── Antes de ir: atalhos ───────────────── */

const ATALHOS = [
  {
    to: "/mesa-dos-convidados" as const,
    icon: Armchair,
    eyebrow: "Recepção",
    title: "Encontre sua mesa",
    text: "Busque pelo seu nome e veja onde vai sentar.",
  },
  {
    to: "/dresscode" as const,
    icon: Shirt,
    eyebrow: "Dresscode",
    title: "O que vestir",
    text: "Tons sugeridos e as cores que pedimos para evitar.",
  },
];

function Atalhos() {
  return (
    <Section id="antes-de-ir">
      <SectionHeading eyebrow="Antes de ir" title="Para você se preparar" />
      <div className="mx-auto grid max-w-md gap-4 md:max-w-3xl md:grid-cols-2">
        {ATALHOS.map((it, i) => (
          <FadeIn key={it.to} delay={i * 0.08}>
            <Link to={it.to} className="card-invite group flex items-center gap-4 rounded-[26px] p-5 transition active:scale-[0.99]">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sand text-primary">
                <it.icon className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="eyebrow block !text-[9.5px] text-muted-foreground">{it.eyebrow}</span>
                <span className="mt-1 block font-display text-[21px] leading-tight">{it.title}</span>
                <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{it.text}</span>
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────── Presente ───────────────── */

function Presente({ g }: { g: SiteContent["gift"] }) {
  const [copied, setCopied] = useState(false);
  const copyPix = async () => {
    await navigator.clipboard.writeText(g.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="presente" className="pt-4">
      <FadeIn className="mx-auto max-w-md md:max-w-2xl">
        <div className="relative overflow-hidden rounded-[32px] bg-primary px-6 pb-7 pt-9 text-primary-foreground shadow-[0_30px_60px_-30px_var(--color-primary)] sm:px-10">
          <div className="pointer-events-none absolute -right-4 -top-6 font-script text-[130px] leading-none text-white/[0.08]">
            Pix
          </div>
          <OakLeaf className="absolute -bottom-3 -right-2 h-24 w-16 rotate-[28deg] text-white/15" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <Gift className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div className="eyebrow relative mt-5 text-white/70">{g.eyebrow}</div>
          <h2 className="relative mt-2 font-display text-[34px] font-normal leading-none">{g.title}</h2>
          <p className="relative mt-4 text-[14.5px] leading-relaxed text-white/85">{g.text}</p>

          <div className="relative mt-7 rounded-[22px] bg-cream p-2 pl-5 text-cocoa">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1 py-1">
                <div className="text-[9.5px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{g.pixLabel}</div>
                <div className="mt-0.5 break-all text-[14px] font-medium leading-snug">{g.pixKey}</div>
              </div>
              <button
                onClick={copyPix}
                aria-label="Copiar chave Pix"
                className="flex h-12 shrink-0 items-center gap-2 rounded-[16px] bg-cocoa px-4 text-[13px] font-medium text-cream transition active:scale-95"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ───────────────── Pré-wedding ───────────────── */

function Galeria({ eyebrow, title, photos }: { eyebrow: string; title: string; photos: string[] }) {
  if (!photos.length) return null;
  return (
    <Section id="registros" className="pt-4">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <StaggerContainer className="grid grid-cols-2 gap-3 md:grid-cols-4" staggerDelay={0.08}>
        {photos.map((p, i) => (
          <StaggerItem
            key={i}
            className={
              "overflow-hidden rounded-[22px] bg-sand " +
              (i === 0 || (i === photos.length - 1 && photos.length % 2 === 0)
                ? "col-span-2 aspect-[16/10]"
                : "aspect-[4/5]")
            }
          >
            <img src={p} alt="" loading="lazy" className="h-full w-full object-cover object-[50%_75%]" />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}

/* ───────────────── Página ───────────────── */

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-5 px-5 py-20">
      <Skeleton className="mx-auto h-3 w-24" />
      <Skeleton className="mx-auto h-10 w-56" />
      <Skeleton className="h-[440px] w-full rounded-[30px]" />
      <Skeleton className="h-[380px] w-full rounded-[30px]" />
    </div>
  );
}

function Home() {
  const { data, isLoading } = useSiteContent();
  const c = data ?? DEFAULT_CONTENT;

  // Ao chegar de outra página com #presente (ou outra âncora), rola até a seção quando ela existir.
  useEffect(() => {
    if (isLoading) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
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
          <Roteiro c={c.ceremony} r={c.reception} />
          <Programacao items={c.ceremony.timeline} />
          <Manuais eyebrow={c.manuals.eyebrow} title={c.manuals.title} list={c.manuals.list} />
          <Atalhos />
          <Presente g={c.gift} />
          <Galeria eyebrow={c.prewedding.eyebrow} title={c.prewedding.title} photos={c.prewedding.photos} />
        </>
      )}

      <SiteFooter />
    </div>
  );
}
