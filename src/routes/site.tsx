import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronDown,
  Church,
  ExternalLink,
  Gift,
  Images,
  Armchair,
  BookOpen,
  PartyPopper,
  Plus,
  Shirt,
  Trash2,
} from "lucide-react";
import { AppShell, PageTitle, panelCard } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useSiteContent,
  useSaveSection,
  DEFAULT_CONTENT,
  type SiteContent,
  type Guest,
} from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/site")({
  component: () => (
    <AppShell>
      <SiteEditor />
    </AppShell>
  ),
});

type Key = keyof SiteContent;

const TABS: { key: Key; label: string; icon: React.ElementType; hint: string; anchor: string }[] = [
  { key: "ceremony", label: "Cerimônia", icon: Church, hint: "Data, igreja, mapa e programação do dia.", anchor: "/#roteiro" },
  { key: "reception", label: "Festa", icon: PartyPopper, hint: "Salão da recepção depois da cerimônia.", anchor: "/#roteiro" },
  { key: "manuals", label: "Manuais", icon: BookOpen, hint: "Convidado, família, padrinhos e madrinhas.", anchor: "/#manual" },
  { key: "gift", label: "Presente", icon: Gift, hint: "Texto e chave Pix.", anchor: "/#presente" },
  { key: "tables", label: "Mesas", icon: Armchair, hint: "Use parênteses para o parentesco — ex.: Maria (Mãe da Noiva).", anchor: "/mesa-dos-convidados" },
  { key: "dresscode", label: "Traje", icon: Shirt, hint: "Textos da página de dresscode.", anchor: "/dresscode" },
  { key: "prewedding", label: "Fotos", icon: Images, hint: "Fotos do pré-wedding exibidas na home.", anchor: "/#registros" },
];

const input = "h-12 rounded-2xl border-border/80 bg-[#f6f1ea] text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-primary/30";
const area = "rounded-2xl border-border/80 bg-[#f6f1ea] text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-primary/30";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}

function Card({ title, children, action }: { title?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className={`${panelCard} p-5`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-[15px] font-extrabold">{title}</h3>}
          {action}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function IconButton({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted",
      )}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-transparent text-[13.5px] font-bold text-muted-foreground transition hover:border-primary/50 hover:text-primary"
    >
      <Plus className="h-4 w-4" /> {children}
    </button>
  );
}

function StringList({
  values,
  onChange,
  placeholder,
  multiline,
  addLabel,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  multiline?: boolean;
  addLabel: string;
}) {
  const set = (i: number, v: string) => onChange(values.map((x, j) => (j === i ? v : x)));
  return (
    <div className="space-y-2">
      {values.map((v, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-3.5 w-5 shrink-0 text-center text-[12px] font-bold tabular-nums text-muted-foreground">{i + 1}</span>
          {multiline ? (
            <Textarea value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className={`${area} min-h-[84px]`} />
          ) : (
            <Input value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className={input} />
          )}
          <div className="mt-1">
            <IconButton danger label="Remover" onClick={() => onChange(values.filter((_, j) => j !== i))} />
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...values, ""])}>{addLabel}</AddButton>
    </div>
  );
}

function GuestRows({ guests, onChange }: { guests: Guest[]; onChange: (g: Guest[]) => void }) {
  const set = (i: number, patch: Partial<Guest>) => onChange(guests.map((g, j) => (j === i ? { ...g, ...patch } : g)));
  return (
    <div className="space-y-2">
      {guests.map((g, i) => (
        <div key={i} className="flex items-center gap-2">
          <button
            type="button"
            title={g.invited ? "Convite entregue — toque para desmarcar" : "Marcar convite como entregue"}
            aria-label={g.invited ? "Convite entregue" : "Convite não entregue"}
            onClick={() => set(i, { invited: !g.invited })}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              g.invited ? "border-success bg-success text-white" : "border-border text-transparent hover:border-success/60",
            )}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </button>
          <Input value={g.name} onChange={(e) => set(i, { name: e.target.value })} placeholder="Nome do convidado" className={input} />
          <IconButton danger label="Remover convidado" onClick={() => onChange(guests.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton onClick={() => onChange([...guests, { name: "", invited: false }])}>Adicionar convidado</AddButton>
    </div>
  );
}

function Collapsible({
  title,
  meta,
  children,
  onRemove,
  defaultOpen,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  onRemove?: () => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`${panelCard} overflow-hidden`}>
      <div className="flex items-center gap-2 pr-2">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-3 px-5 py-4 text-left" aria-expanded={open}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-extrabold">{title}</div>
            {meta && <div className="mt-0.5 text-[12px] text-muted-foreground">{meta}</div>}
          </div>
          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {onRemove && <IconButton danger label="Remover" onClick={onRemove} />}
      </div>
      {open && <div className="space-y-4 border-t border-border/60 px-5 pb-5 pt-4">{children}</div>}
    </div>
  );
}

function SiteEditor() {
  const { data, isLoading } = useSiteContent();
  const save = useSaveSection();
  const [tab, setTab] = useState<Key>("ceremony");
  const [draft, setDraft] = useState<SiteContent>(DEFAULT_CONTENT);

  // Ao recarregar do banco (ex.: depois de salvar uma aba), atualiza só as abas sem edição pendente.
  const lastData = useRef<SiteContent | null>(null);
  useEffect(() => {
    if (!data) return;
    const prev = lastData.current;
    lastData.current = data;
    setDraft((d) => {
      if (!prev) return data;
      const next = { ...d };
      for (const k of Object.keys(data) as Key[]) {
        if (JSON.stringify(d[k]) === JSON.stringify(prev[k])) (next as Record<Key, unknown>)[k] = data[k];
      }
      return next;
    });
  }, [data]);

  const dirty = useMemo(() => {
    if (!data) return {} as Record<Key, boolean>;
    return Object.fromEntries(
      (Object.keys(draft) as Key[]).map((k) => [k, JSON.stringify(draft[k]) !== JSON.stringify(data[k])]),
    ) as Record<Key, boolean>;
  }, [draft, data]);

  const update = <K extends Key>(key: K, value: SiteContent[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const doSave = () =>
    save.mutate(
      { key: tab, value: draft[tab] },
      {
        onSuccess: () => toast.success("Conteúdo atualizado no site"),
        onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erro ao salvar"),
      },
    );

  if (isLoading) {
    return <div className="py-20 text-center text-[13px] text-muted-foreground">Carregando conteúdo…</div>;
  }

  const current = TABS.find((t) => t.key === tab)!;
  const { ceremony, reception, manuals, gift, tables, dresscode, prewedding } = draft;

  return (
    <div className="space-y-5 pb-20">
      <PageTitle title="Conteúdo do site" subtitle="Edite o que os convidados veem. Cada aba é salva separadamente." />

      {/* Abas */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-bold ring-1 transition-colors",
                active ? "bg-foreground text-background ring-foreground" : "bg-card text-muted-foreground ring-border/70",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {dirty[t.key] && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-warning ring-2 ring-card" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-[13px] text-muted-foreground">{current.hint}</p>
        <a href={current.anchor} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 text-[12.5px] font-bold text-primary">
          Ver no site <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* CERIMÔNIA */}
      {tab === "ceremony" && (
        <>
          <Card title="Informações">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Data">
                <Input className={input} value={ceremony.dateLabel} onChange={(e) => update("ceremony", { ...ceremony, dateLabel: e.target.value })} />
              </Field>
              <Field label="Horário">
                <Input className={input} value={ceremony.timeLabel} onChange={(e) => update("ceremony", { ...ceremony, timeLabel: e.target.value })} />
              </Field>
              <Field label="Igreja">
                <Input className={input} value={ceremony.venue} onChange={(e) => update("ceremony", { ...ceremony, venue: e.target.value })} />
              </Field>
              <Field label="Endereço">
                <Input className={input} value={ceremony.address} onChange={(e) => update("ceremony", { ...ceremony, address: e.target.value })} />
              </Field>
              <Field label="Link do mapa" className="sm:col-span-2">
                <Input className={input} value={ceremony.mapsUrl} onChange={(e) => update("ceremony", { ...ceremony, mapsUrl: e.target.value })} />
              </Field>
            </div>
          </Card>
          <Card title="Programação do dia">
            <div className="space-y-3">
              {ceremony.timeline.map((t, i) => {
                const patchItem = (p: Partial<typeof t>) =>
                  update("ceremony", { ...ceremony, timeline: ceremony.timeline.map((x, j) => (j === i ? { ...x, ...p } : x)) });
                return (
                  <div key={i} className="flex gap-2 rounded-2xl bg-[#faf6f0] p-2 ring-1 ring-border/60">
                    <Input
                      className={`${input} w-20 shrink-0 bg-card px-2 text-center font-bold tabular-nums`}
                      value={t.time}
                      onChange={(e) => patchItem({ time: e.target.value })}
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Input className={`${input} bg-card`} value={t.label} placeholder="O que acontece" onChange={(e) => patchItem({ label: e.target.value })} />
                      <Input
                        className={`${input} h-10 bg-card text-[13.5px]`}
                        value={t.place ?? ""}
                        placeholder="Endereço (opcional)"
                        onChange={(e) => patchItem({ place: e.target.value || undefined })}
                      />
                    </div>
                    <IconButton danger label="Remover horário" onClick={() => update("ceremony", { ...ceremony, timeline: ceremony.timeline.filter((_, j) => j !== i) })} />
                  </div>
                );
              })}
              <AddButton onClick={() => update("ceremony", { ...ceremony, timeline: [...ceremony.timeline, { time: "00:00", label: "" }] })}>
                Adicionar horário
              </AddButton>
            </div>
          </Card>
          <Card title="Títulos da seção">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiqueta">
                <Input className={input} value={ceremony.eyebrow} onChange={(e) => update("ceremony", { ...ceremony, eyebrow: e.target.value })} />
              </Field>
              <Field label="Título do cartão">
                <Input className={input} value={ceremony.title} onChange={(e) => update("ceremony", { ...ceremony, title: e.target.value })} />
              </Field>
            </div>
          </Card>
        </>
      )}

      {/* FESTA */}
      {tab === "reception" && (
        <Card title="Recepção">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Local">
              <Input className={input} value={reception.venue} onChange={(e) => update("reception", { ...reception, venue: e.target.value })} />
            </Field>
            <Field label="Endereço">
              <Input className={input} value={reception.address} onChange={(e) => update("reception", { ...reception, address: e.target.value })} />
            </Field>
            <Field label="Horário de início">
              <Input className={input} value={reception.timeLabel} onChange={(e) => update("reception", { ...reception, timeLabel: e.target.value })} />
            </Field>
            <Field label="Encerramento">
              <Input className={input} value={reception.endLabel} onChange={(e) => update("reception", { ...reception, endLabel: e.target.value })} />
            </Field>
            <Field label="Descrição" className="sm:col-span-2">
              <Textarea className={`${area} min-h-[90px]`} value={reception.description} onChange={(e) => update("reception", { ...reception, description: e.target.value })} />
            </Field>
            <Field label="Link do mapa" className="sm:col-span-2">
              <Input className={input} value={reception.mapsUrl} onChange={(e) => update("reception", { ...reception, mapsUrl: e.target.value })} />
            </Field>
            <Field label="Etiqueta">
              <Input className={input} value={reception.eyebrow} onChange={(e) => update("reception", { ...reception, eyebrow: e.target.value })} />
            </Field>
            <Field label="Título do cartão">
              <Input className={input} value={reception.title} onChange={(e) => update("reception", { ...reception, title: e.target.value })} />
            </Field>
          </div>
        </Card>
      )}

      {/* MANUAIS */}
      {tab === "manuals" && (
        <div className="space-y-3">
          {manuals.list.map((m, i) => {
            const patch = (p: Partial<typeof m>) => update("manuals", { ...manuals, list: manuals.list.map((x, j) => (j === i ? { ...x, ...p } : x)) });
            return (
              <Collapsible
                key={m.id}
                title={m.title || "Sem título"}
                meta={`${m.items.length} tópicos`}
                onRemove={() => update("manuals", { ...manuals, list: manuals.list.filter((_, j) => j !== i) })}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Título">
                    <Input className={input} value={m.title} onChange={(e) => patch({ title: e.target.value })} />
                  </Field>
                  <Field label="Subtítulo">
                    <Input className={input} value={m.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
                  </Field>
                </div>
                <div>
                  <div className="mb-2 text-[12.5px] font-semibold text-foreground/80">Tópicos</div>
                  <StringList multiline values={m.items} onChange={(items) => patch({ items })} addLabel="Adicionar tópico" />
                </div>
              </Collapsible>
            );
          })}
          <AddButton
            onClick={() =>
              update("manuals", { ...manuals, list: [...manuals.list, { id: `manual-${Date.now()}`, title: "Novo manual", subtitle: "", items: [""] }] })
            }
          >
            Adicionar manual
          </AddButton>
          <Card title="Títulos da seção">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiqueta">
                <Input className={input} value={manuals.eyebrow} onChange={(e) => update("manuals", { ...manuals, eyebrow: e.target.value })} />
              </Field>
              <Field label="Título">
                <Input className={input} value={manuals.title} onChange={(e) => update("manuals", { ...manuals, title: e.target.value })} />
              </Field>
            </div>
          </Card>
        </div>
      )}

      {/* PRESENTE */}
      {tab === "gift" && (
        <Card title="Nosso Presente">
          <Field label="Texto">
            <Textarea className={`${area} min-h-[120px]`} value={gift.text} onChange={(e) => update("gift", { ...gift, text: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rótulo da chave">
              <Input className={input} value={gift.pixLabel} onChange={(e) => update("gift", { ...gift, pixLabel: e.target.value })} />
            </Field>
            <Field label="Chave Pix">
              <Input className={input} value={gift.pixKey} onChange={(e) => update("gift", { ...gift, pixKey: e.target.value })} />
            </Field>
            <Field label="Etiqueta">
              <Input className={input} value={gift.eyebrow} onChange={(e) => update("gift", { ...gift, eyebrow: e.target.value })} />
            </Field>
            <Field label="Título">
              <Input className={input} value={gift.title} onChange={(e) => update("gift", { ...gift, title: e.target.value })} />
            </Field>
          </div>
        </Card>
      )}

      {/* MESAS */}
      {tab === "tables" && (
        <div className="space-y-3">
          {(() => {
            const all = tables.list.flatMap((t) => t.guests);
            const inv = all.filter((g) => g.invited).length;
            return (
              <div className={`${panelCard} flex items-center gap-4 p-4`}>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-muted-foreground">Convites entregues</div>
                  <div className="text-[22px] font-extrabold tabular-nums">
                    {inv} <span className="text-[14px] font-bold text-muted-foreground">de {all.length}</span>
                  </div>
                </div>
                <div className="h-2.5 w-28 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-success" style={{ width: `${all.length ? (inv / all.length) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })()}
          {tables.list.map((t, i) => {
            const inv = t.guests.filter((g) => g.invited).length;
            return (
              <Collapsible
                key={t.id}
                title={`Mesa ${t.id}`}
                meta={`${t.guests.length} convidados · ${inv} convites entregues`}
                onRemove={() => update("tables", { ...tables, list: tables.list.filter((_, j) => j !== i) })}
              >
                <GuestRows
                  guests={t.guests}
                  onChange={(guests) => update("tables", { ...tables, list: tables.list.map((x, j) => (j === i ? { ...x, guests } : x)) })}
                />
              </Collapsible>
            );
          })}
          <AddButton
            onClick={() =>
              update("tables", {
                ...tables,
                list: [...tables.list, { id: Math.max(0, ...tables.list.map((t) => t.id)) + 1, guests: [{ name: "", invited: false }] }],
              })
            }
          >
            Adicionar mesa
          </AddButton>
          <Card title="Títulos da página">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiqueta">
                <Input className={input} value={tables.eyebrow} onChange={(e) => update("tables", { ...tables, eyebrow: e.target.value })} />
              </Field>
              <Field label="Título">
                <Input className={input} value={tables.title} onChange={(e) => update("tables", { ...tables, title: e.target.value })} />
              </Field>
            </div>
          </Card>
        </div>
      )}

      {/* TRAJE */}
      {tab === "dresscode" && (
        <>
          <Card title="Textos">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Etiqueta">
                <Input className={input} value={dresscode.eyebrow} onChange={(e) => update("dresscode", { ...dresscode, eyebrow: e.target.value })} />
              </Field>
              <Field label="Título">
                <Input className={input} value={dresscode.title} onChange={(e) => update("dresscode", { ...dresscode, title: e.target.value })} />
              </Field>
            </div>
            <Field label="Introdução">
              <Textarea className={`${area} min-h-[90px]`} value={dresscode.intro} onChange={(e) => update("dresscode", { ...dresscode, intro: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título do aviso">
                <Input className={input} value={dresscode.avoidTitle} onChange={(e) => update("dresscode", { ...dresscode, avoidTitle: e.target.value })} />
              </Field>
              <Field label="Texto do aviso">
                <Input className={input} value={dresscode.avoidNote} onChange={(e) => update("dresscode", { ...dresscode, avoidNote: e.target.value })} />
              </Field>
            </div>
          </Card>
          <Collapsible title="Imagens de referência" meta={`${dresscode.men.length + dresscode.women.length} imagens (avançado)`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título masculino">
                <Input className={input} value={dresscode.menTitle} onChange={(e) => update("dresscode", { ...dresscode, menTitle: e.target.value })} />
              </Field>
              <Field label="Título feminino">
                <Input className={input} value={dresscode.womenTitle} onChange={(e) => update("dresscode", { ...dresscode, womenTitle: e.target.value })} />
              </Field>
            </div>
            <div className="text-[12.5px] font-semibold text-foreground/80">{dresscode.menTitle}</div>
            <StringList values={dresscode.men} onChange={(men) => update("dresscode", { ...dresscode, men })} placeholder="URL da imagem" addLabel="Adicionar imagem" />
            <div className="text-[12.5px] font-semibold text-foreground/80">{dresscode.womenTitle}</div>
            <StringList values={dresscode.women} onChange={(women) => update("dresscode", { ...dresscode, women })} placeholder="URL da imagem" addLabel="Adicionar imagem" />
          </Collapsible>
        </>
      )}

      {/* FOTOS */}
      {tab === "prewedding" && (
        <Card title="Pré-Wedding">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {prewedding.photos.map((p, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                {p ? <img src={p} alt="" className="h-full w-full object-cover" /> : null}
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-2 text-[11px] font-bold text-white">{i + 1}</span>
              </div>
            ))}
          </div>
          <StringList values={prewedding.photos} onChange={(photos) => update("prewedding", { ...prewedding, photos })} placeholder="URL da imagem" addLabel="Adicionar foto" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Etiqueta">
              <Input className={input} value={prewedding.eyebrow} onChange={(e) => update("prewedding", { ...prewedding, eyebrow: e.target.value })} />
            </Field>
            <Field label="Título">
              <Input className={input} value={prewedding.title} onChange={(e) => update("prewedding", { ...prewedding, title: e.target.value })} />
            </Field>
          </div>
        </Card>
      )}

      {/* Barra de salvar */}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+64px)] z-30 px-4 lg:bottom-6 lg:left-64 lg:px-10">
        <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-full bg-foreground py-2 pl-5 pr-2 text-background shadow-[0_18px_40px_-14px_rgba(58,40,32,0.6)]">
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
            {dirty[tab] ? (
              <>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-warning" />
                Alterações em {current.label}
              </>
            ) : (
              <span className="text-background/70">Tudo salvo</span>
            )}
          </span>
          <button
            onClick={doSave}
            disabled={!dirty[tab] || save.isPending}
            className="h-10 shrink-0 rounded-full bg-background px-5 text-[13.5px] font-extrabold text-foreground transition disabled:opacity-40"
          >
            {save.isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
