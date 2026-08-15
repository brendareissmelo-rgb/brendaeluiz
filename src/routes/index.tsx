import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import { Countdown } from "@/components/countdown";
import { SiteFooter, SiteNav } from "@/components/site-chrome";
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

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <div className="mb-10 text-center">
        {eyebrow && (
          <div className="mb-2 text-[11px] uppercase tracking-[0.25em] text-primary">{eyebrow}</div>
        )}
        <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">{title}</h2>
        <div className="mx-auto mt-4 h-px w-12 bg-primary/50" />
      </div>
      {children}
    </section>
  );
}

function DresscodeCarousel({ title, images, alt }: { title: string; images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const total = images.length;
  if (total === 0) return null;
  const idx = i % total;
  const prev = () => setI((c) => (c - 1 + total) % total);
  const next = () => setI((c) => (c + 1) % total);

  return (
    <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
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
        <h3 className="font-serif text-xl">{title}</h3>
      </div>
    </div>
  );
}

function ManualAccordion({ manuals }: { manuals: Manual[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {manuals.map((m) => {
        const isOpen = open === m.id;
        return (
          <div key={m.id} className="overflow-hidden rounded-lg border border-border/60 bg-card">
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
        );
      })}
    </div>
  );
}

function Home() {
  const [copied, setCopied] = useState(false);
  const { data } = useSiteContent();
  const c = data ?? DEFAULT_CONTENT;

  const copyPix = async () => {
    await navigator.clipboard.writeText(c.gift.pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* HERO */}
      <header className="relative h-[100svh] w-full overflow-hidden">
        <img
          src={capa.url}
          alt="Brenda e Luiz"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 text-center text-white">
          <div className="text-[11px] uppercase tracking-[0.4em] text-white/80">Casamento de</div>
          <h1 className="mt-3 font-serif text-5xl font-light tracking-tight sm:text-7xl">
            Brenda <span className="text-primary">&</span> Luiz
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/90">
            <span>12 · 12 · 2026</span>
            <span className="h-px w-8 bg-white/60" />
            <span>Belém · PA</span>
          </div>
        </div>
      </header>

      {/* CERIMÔNIA */}
      <Section id="cerimonia" eyebrow={c.ceremony.eyebrow} title={c.ceremony.title}>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Data e hora</div>
            <div className="mt-2 font-serif text-2xl">{c.ceremony.dateLabel}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.ceremony.timeLabel}</div>
            <div className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground">Local</div>
            <div className="mt-2 font-serif text-xl">{c.ceremony.venue}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.ceremony.address}</div>
            <a
              href={c.ceremony.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20"
            >
              Ver no mapa →
            </a>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Programação do dia</div>
            <ul className="mt-4 divide-y divide-border/60">
              {c.ceremony.timeline.map((t, i) => (
                <li key={i} className="flex items-center justify-between py-2.5">
                  <span className="font-serif text-sm text-muted-foreground tabular-nums">{t.time}</span>
                  <span className="text-sm">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* DRESSCODE */}
      <Section id="dresscode" eyebrow={c.dresscode.eyebrow} title={c.dresscode.title}>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          {c.dresscode.intro}
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <DresscodeCarousel title={c.dresscode.menTitle} images={c.dresscode.men} alt="Sugestão de traje masculino" />
          <DresscodeCarousel title={c.dresscode.womenTitle} images={c.dresscode.women} alt="Sugestão de traje feminino" />
        </div>

        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <div className="text-[11px] uppercase tracking-widest text-destructive">{c.dresscode.avoidTitle}</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-pink-400" /> Rosa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-white" /> Branco
            </span>
            <span className="text-xs text-muted-foreground">— {c.dresscode.avoidNote}</span>
          </div>
        </div>
      </Section>

      {/* MANUAIS */}
      <Section id="manual" eyebrow={c.manuals.eyebrow} title={c.manuals.title}>
        <ManualAccordion manuals={c.manuals.list} />
      </Section>

      {/* PRESENTE / PIX */}
      <Section id="presente" eyebrow={c.gift.eyebrow} title={c.gift.title}>
        <div className="mx-auto max-w-2xl rounded-lg border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">{c.gift.text}</p>
          <div className="mt-6 rounded-md border border-border/60 bg-card p-4">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{c.gift.pixLabel}</div>
            <div className="mt-2 font-mono text-sm break-all">{c.gift.pixKey}</div>
          </div>
          <button
            onClick={copyPix}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {copied ? "Copiado ✓" : "Copiar chave Pix"}
          </button>
        </div>
      </Section>

      {/* PRÉ-WEDDING */}
      <Section id="prewedding" eyebrow={c.prewedding.eyebrow} title={c.prewedding.title}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {c.prewedding.photos.map((url, i) => (
            <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-md">
              <img src={url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/25" />
            </div>
          ))}
        </div>
      </Section>

      {/* Footer nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2 text-[11px] uppercase tracking-widest">
          <a href="#top" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Início</a>
          <a href="#cerimonia" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Cerimônia</a>
          <a href="#dresscode" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Dresscode</a>
          <a href="#manual" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Manuais</a>
          <a href="#presente" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Presente</a>
          <Link to="/login" className="rounded px-2 py-1.5 text-primary hover:text-primary/80">Login</Link>
        </div>
      </nav>
      <div id="top" className="absolute top-0" />
    </div>
  );
}
