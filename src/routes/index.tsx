import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import capa from "@/assets/capa-principal.jpg.asset.json";
import foto17 from "@/assets/luiz-brenda-17.jpg.asset.json";
import foto18 from "@/assets/luiz-brenda-18.jpg.asset.json";
import foto20 from "@/assets/luiz-brenda-20.jpg.asset.json";
import foto11 from "@/assets/luiz-brenda-11.jpg.asset.json";
import dressHomens from "@/assets/dresscode-homens.jpg.asset.json";
import dressMulheres from "@/assets/dresscode-mulheres.jpg.asset.json";

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

function Home() {
  const [copied, setCopied] = useState(false);

  const timeline = [
    { time: "13:00", label: "Making Of" },
    { time: "17:00", label: "Chegada do Noivo" },
    { time: "17:10", label: "Chegada dos Convidados" },
    { time: "17:30", label: "Início da Cerimônia" },
    { time: "18:30", label: "Término da Cerimônia" },
    { time: "18:45", label: "Fotos com os Convidados" },
    { time: "20:00", label: "Encerramento" },
  ];

  const manual = [
    "Evite usar o celular durante a entrada do noivo, da noiva e dos familiares — este é o momento do fotógrafo. Você poderá fazer seus registros logo em seguida.",
    "Evite conversas paralelas durante a cerimônia. Cada palavra faz parte do nosso momento.",
    "Chegue com pelo menos 20 minutos de antecedência para acomodar todos com tranquilidade.",
    "Respeite o dresscode: sem tons de rosa e sem branco.",
    "Deixe as crianças acompanhadas por um responsável durante toda a cerimônia.",
    "Ao final, ajude-nos a registrar tudo compartilhando suas fotos com a hashtag #BrendaELuiz2026.",
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
              href="https://www.google.com/maps/search/?api=1&query=Igreja+Quadrangular+Nova+Vida+Trav+Alferes+Costa+395+Sacramenta"
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
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <img src={dressHomens.url} alt="Sugestão de traje masculino" loading="lazy" className="h-80 w-full object-contain bg-[#f5efe4]" />
            <div className="p-5">
              <h3 className="font-serif text-xl">Homens</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Terno em tons neutros (bege, caqui, azul-marinho, cinza) com camisa social. Sapato social ou mocassim. Gravata é opcional.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
            <img src={dressMulheres.url} alt="Sugestão de traje feminino" loading="lazy" className="h-80 w-full object-contain bg-[#f5efe4]" />
            <div className="p-5">
              <h3 className="font-serif text-xl">Mulheres</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Vestidos midi ou longos em tons terrosos, verdes, azuis, dourados ou pastéis suaves. Salto confortável ou sapato baixo.
              </p>
            </div>
          </div>
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
            Sua presença já é o maior presente. Mas, se quiser contribuir com o início da nossa história,
            deixamos abaixo nossa chave Pix. Qualquer valor será recebido com muito amor.
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
