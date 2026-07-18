import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import foto17 from "@/assets/luiz-brenda-17.jpg.asset.json";
import foto18 from "@/assets/luiz-brenda-18.jpg.asset.json";
import foto20 from "@/assets/luiz-brenda-20.jpg.asset.json";
import foto11 from "@/assets/luiz-brenda-11.jpg.asset.json";

import h1 from "@/assets/dresscode-h-1.jpg.asset.json";
import h2 from "@/assets/dresscode-h-2.jpg.asset.json";
import h3 from "@/assets/dresscode-h-3.jpg.asset.json";
import h4 from "@/assets/dresscode-h-4.jpg.asset.json";
import h5 from "@/assets/dresscode-h-5.jpg.asset.json";
import h6 from "@/assets/dresscode-h-6.jpg.asset.json";
import h7 from "@/assets/dresscode-h-7.jpg.asset.json";
import h8 from "@/assets/dresscode-h-8.jpg.asset.json";
import h9 from "@/assets/dresscode-h-9.jpg.asset.json";
import h10 from "@/assets/dresscode-h-10.jpg.asset.json";

import m1 from "@/assets/dresscode-m-1.jpg.asset.json";
import m2 from "@/assets/dresscode-m-2.jpg.asset.json";
import m3 from "@/assets/dresscode-m-3.jpg.asset.json";
import m4 from "@/assets/dresscode-m-4.jpg.asset.json";
import m5 from "@/assets/dresscode-m-5.jpg.asset.json";
import m6 from "@/assets/dresscode-m-6.jpg.asset.json";
import m7 from "@/assets/dresscode-m-7.jpg.asset.json";
import m8 from "@/assets/dresscode-m-8.jpg.asset.json";
import m9 from "@/assets/dresscode-m-9.jpg.asset.json";
import m10 from "@/assets/dresscode-m-10.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brenda & Luiz — 12.12.2026" },
      { name: "description", content: "Nosso convite digital: cerimônia, dresscode, manual do convidado e mensagem dos noivos." },
      { property: "og:title", content: "Casamento de Brenda & Luiz" },
      { property: "og:description", content: "12 de dezembro de 2026 · Igreja Quadrangular Nova Vida · Belém" },
      { property: "og:image", content: capa.url },
    ],
  }),
  component: Home,
});

const PIX_KEY = "brendareissmelo@gmail.com";
const MAPS_URL = "https://maps.app.goo.gl/dnu4C5zDWqUHMkBi7";

const homens = [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10];
const mulheres = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10];

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

function DresscodeCarousel({ title, images, alt }: { title: string; images: { url: string }[]; alt: string }) {
  const [i, setI] = useState(0);
  const total = images.length;
  const prev = () => setI((c) => (c - 1 + total) % total);
  const next = () => setI((c) => (c + 1) % total);

  return (
    <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
      <div className="relative bg-[#f5efe4]">
        <img
          src={images[i].url}
          alt={`${alt} ${i + 1}`}
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
          {i + 1} / {total}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl">{title}</h3>
      </div>
    </div>
  );
}

function Home() {
  const [copied, setCopied] = useState(false);

  const timeline = [
    { time: "13:00", label: "Making Of" },
    { time: "15:00", label: "Chegada do Noivo" },
    { time: "16:40", label: "Chegada dos Convidados" },
    { time: "17:30", label: "Início da Cerimônia" },
    { time: "18:45", label: "Término da Cerimônia" },
    { time: "19:00", label: "Fotos com os Convidados" },
    { time: "19:45", label: "Encerramento" },
  ];

  const manual = [
    "Evite usar o celular durante a entrada do noivo, da noiva e dos familiares — este é o momento do fotógrafo. Você poderá fazer seus registros logo em seguida.",
    "Evite conversas paralelas durante a cerimônia. Cada palavra faz parte do nosso momento.",
    "Chegue com pelo menos 20 minutos de antecedência para acomodar todos com tranquilidade.",
    "Respeite o dresscode: sem tons de rosa e sem branco.",
    "Ao final da cerimônia, os convidados poderão enviar as fotos do casamento no nosso grupo do WhatsApp, que será criado para avisos prévios até o dia do casamento. Assim que a cerimônia terminar, o grupo será liberado para todos compartilharem os registros.",
  ];

  const copyPix = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
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
      <Section id="cerimonia" eyebrow="Save the date" title="A Cerimônia">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-card p-6">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Data e hora</div>
            <div className="mt-2 font-serif text-2xl">Sábado, 12 de dezembro de 2026</div>
            <div className="mt-1 text-sm text-muted-foreground">Cerimônia às 17h30</div>
            <div className="mt-6 text-[11px] uppercase tracking-widest text-muted-foreground">Local</div>
            <div className="mt-2 font-serif text-xl">Igreja Quadrangular Nova Vida</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Travessa Alferes Costa, 395 — Bairro Sacramenta
            </div>
            <a
              href={MAPS_URL}
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
              {timeline.map((t) => (
                <li key={t.label} className="flex items-center justify-between py-2.5">
                  <span className="font-serif text-sm text-muted-foreground tabular-nums">{t.time}</span>
                  <span className="text-sm">{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* GALERIA */}
      <section className="mx-auto max-w-5xl px-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[foto17, foto18, foto20, foto11].map((f, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden rounded-md">
              <img src={f.url} alt="" loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* DRESSCODE */}
      <Section id="dresscode" eyebrow="Traje" title="Dresscode">
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-muted-foreground">
          Queremos você confortável e elegante. Traje social, tons neutros e terrosos são bem-vindos.
          Navegue pelas sugestões com as setas.
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <DresscodeCarousel title="Homens" images={homens} alt="Sugestão de traje masculino" />
          <DresscodeCarousel title="Mulheres" images={mulheres} alt="Sugestão de traje feminino" />
        </div>

        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
          <div className="text-[11px] uppercase tracking-widest text-destructive">Por favor, evite</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-pink-400" /> Rosa
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs">
              <span className="h-3 w-3 rounded-full bg-white" /> Branco
            </span>
            <span className="text-xs text-muted-foreground">— para homens e mulheres.</span>
          </div>
        </div>
      </Section>

      {/* MANUAL DO CONVIDADO */}
      <Section id="manual" eyebrow="Combinados" title="Manual do Convidado">
        <ol className="mx-auto max-w-3xl space-y-4">
          {manual.map((item, i) => (
            <li key={i} className="flex gap-4 rounded-lg border border-border/60 bg-card p-5">
              <span className="font-serif text-2xl text-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* PRESENTE / PIX */}
      <Section id="presente" eyebrow="Com carinho" title="Nosso Presente">
        <div className="mx-auto max-w-2xl rounded-lg border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sua presença já é o maior presente — contribuir com o Pix{" "}
            <span className="font-medium text-foreground">não é obrigatório</span>. Se quiser fazer
            parte do início da nossa história, deixamos abaixo nossa chave. Qualquer valor será
            recebido com muito amor.
          </p>
          <div className="mt-6 rounded-md border border-border/60 bg-card p-4">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Chave Pix (e-mail)</div>
            <div className="mt-2 font-mono text-sm break-all">{PIX_KEY}</div>
          </div>
          <button
            onClick={copyPix}
            className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {copied ? "Copiado ✓" : "Copiar chave Pix"}
          </button>
        </div>
      </Section>

      {/* Footer nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2 text-[11px] uppercase tracking-widest">
          <a href="#top" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Início</a>
          <a href="#cerimonia" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Cerimônia</a>
          <a href="#dresscode" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Dresscode</a>
          <a href="#manual" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Manual</a>
          <a href="#presente" className="rounded px-2 py-1.5 text-muted-foreground hover:text-primary">Presente</a>
          <Link to="/login" className="rounded px-2 py-1.5 text-primary hover:text-primary/80">Login</Link>
        </div>
      </nav>
      <div id="top" className="absolute top-0" />
    </div>
  );
}
