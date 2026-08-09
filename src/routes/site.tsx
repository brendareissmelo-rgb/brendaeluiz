import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useSiteContent,
  useSaveSection,
  DEFAULT_CONTENT,
  type SiteContent,
  type Ceremony,
  type Dresscode,
  type GiftSection,
  type Manuals,
  type PreWedding,
} from "@/lib/site-content";

export const Route = createFileRoute("/site")({
  component: () => (
    <AppShell>
      <SiteEditor />
    </AppShell>
  ),
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Panel({
  title,
  description,
  onSave,
  saving,
  children,
}: {
  title: string;
  description: string;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 bg-card p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button size="sm" onClick={onSave} disabled={saving} className="h-8 gap-1.5 px-3 text-xs">
          <Save className="h-3.5 w-3.5" /> Salvar
        </Button>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
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
          <span className="mt-2.5 text-[11px] tabular-nums text-muted-foreground">{i + 1}</span>
          {multiline ? (
            <Textarea value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className="min-h-[70px] text-sm" />
          ) : (
            <Input value={v} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} className="h-9 text-sm" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs" onClick={() => onChange([...values, ""])}>
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </Button>
    </div>
  );
}

function SiteEditor() {
  const { data, isLoading } = useSiteContent();
  const save = useSaveSection();

  const [ceremony, setCeremony] = useState<Ceremony>(DEFAULT_CONTENT.ceremony);
  const [dresscode, setDresscode] = useState<Dresscode>(DEFAULT_CONTENT.dresscode);
  const [manuals, setManuals] = useState<Manuals>(DEFAULT_CONTENT.manuals);
  const [gift, setGift] = useState<GiftSection>(DEFAULT_CONTENT.gift);
  const [prewedding, setPrewedding] = useState<PreWedding>(DEFAULT_CONTENT.prewedding);

  useEffect(() => {
    if (!data) return;
    setCeremony(data.ceremony);
    setDresscode(data.dresscode);
    setManuals(data.manuals);
    setGift(data.gift);
    setPrewedding(data.prewedding);
  }, [data]);

  const doSave = (key: keyof SiteContent, value: unknown) =>
    save.mutate(
      { key, value },
      {
        onSuccess: () => toast.success("Conteúdo atualizado"),
        onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Erro ao salvar"),
      },
    );

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-muted-foreground">Carregando conteúdo...</div>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Conteúdo do site</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Edite os textos e imagens que aparecem no convite digital. Cada bloco é salvo separadamente.
        </p>
      </div>

      {/* CERIMÔNIA */}
      <Panel
        title="A Cerimônia"
        description="Data, local, mapa e programação do dia."
        saving={save.isPending}
        onSave={() => doSave("ceremony", ceremony)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta">
            <Input className="h-9 text-sm" value={ceremony.eyebrow} onChange={(e) => setCeremony({ ...ceremony, eyebrow: e.target.value })} />
          </Field>
          <Field label="Título">
            <Input className="h-9 text-sm" value={ceremony.title} onChange={(e) => setCeremony({ ...ceremony, title: e.target.value })} />
          </Field>
          <Field label="Data">
            <Input className="h-9 text-sm" value={ceremony.dateLabel} onChange={(e) => setCeremony({ ...ceremony, dateLabel: e.target.value })} />
          </Field>
          <Field label="Horário">
            <Input className="h-9 text-sm" value={ceremony.timeLabel} onChange={(e) => setCeremony({ ...ceremony, timeLabel: e.target.value })} />
          </Field>
          <Field label="Local">
            <Input className="h-9 text-sm" value={ceremony.venue} onChange={(e) => setCeremony({ ...ceremony, venue: e.target.value })} />
          </Field>
          <Field label="Endereço">
            <Input className="h-9 text-sm" value={ceremony.address} onChange={(e) => setCeremony({ ...ceremony, address: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Link do mapa">
              <Input className="h-9 text-sm" value={ceremony.mapsUrl} onChange={(e) => setCeremony({ ...ceremony, mapsUrl: e.target.value })} />
            </Field>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Programação</div>
          <div className="space-y-2">
            {ceremony.timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Input
                  className="h-9 w-24 text-sm tabular-nums"
                  value={t.time}
                  onChange={(e) =>
                    setCeremony({ ...ceremony, timeline: ceremony.timeline.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)) })
                  }
                />
                <Input
                  className="h-9 flex-1 text-sm"
                  value={t.label}
                  onChange={(e) =>
                    setCeremony({ ...ceremony, timeline: ceremony.timeline.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setCeremony({ ...ceremony, timeline: ceremony.timeline.filter((_, j) => j !== i) })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-3 text-xs"
              onClick={() => setCeremony({ ...ceremony, timeline: [...ceremony.timeline, { time: "00:00", label: "" }] })}
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar horário
            </Button>
          </div>
        </div>
      </Panel>

      {/* DRESSCODE */}
      <Panel
        title="Dresscode"
        description="Textos e imagens das sugestões de traje (uma URL de imagem por item)."
        saving={save.isPending}
        onSave={() => doSave("dresscode", dresscode)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta">
            <Input className="h-9 text-sm" value={dresscode.eyebrow} onChange={(e) => setDresscode({ ...dresscode, eyebrow: e.target.value })} />
          </Field>
          <Field label="Título">
            <Input className="h-9 text-sm" value={dresscode.title} onChange={(e) => setDresscode({ ...dresscode, title: e.target.value })} />
          </Field>
        </div>
        <Field label="Texto de introdução">
          <Textarea className="min-h-[80px] text-sm" value={dresscode.intro} onChange={(e) => setDresscode({ ...dresscode, intro: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título masculino">
            <Input className="h-9 text-sm" value={dresscode.menTitle} onChange={(e) => setDresscode({ ...dresscode, menTitle: e.target.value })} />
          </Field>
          <Field label="Título feminino">
            <Input className="h-9 text-sm" value={dresscode.womenTitle} onChange={(e) => setDresscode({ ...dresscode, womenTitle: e.target.value })} />
          </Field>
        </div>
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Imagens — {dresscode.menTitle}</div>
          <StringList values={dresscode.men} onChange={(men) => setDresscode({ ...dresscode, men })} placeholder="URL da imagem" addLabel="Adicionar imagem" />
        </div>
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Imagens — {dresscode.womenTitle}</div>
          <StringList values={dresscode.women} onChange={(women) => setDresscode({ ...dresscode, women })} placeholder="URL da imagem" addLabel="Adicionar imagem" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título do aviso">
            <Input className="h-9 text-sm" value={dresscode.avoidTitle} onChange={(e) => setDresscode({ ...dresscode, avoidTitle: e.target.value })} />
          </Field>
          <Field label="Texto do aviso">
            <Input className="h-9 text-sm" value={dresscode.avoidNote} onChange={(e) => setDresscode({ ...dresscode, avoidNote: e.target.value })} />
          </Field>
        </div>
      </Panel>

      {/* MANUAIS */}
      <Panel
        title="Manuais"
        description="Convidado, Família, Padrinhos e Madrinhas — cada manual vira um item clicável na home."
        saving={save.isPending}
        onSave={() => doSave("manuals", manuals)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta">
            <Input className="h-9 text-sm" value={manuals.eyebrow} onChange={(e) => setManuals({ ...manuals, eyebrow: e.target.value })} />
          </Field>
          <Field label="Título da seção">
            <Input className="h-9 text-sm" value={manuals.title} onChange={(e) => setManuals({ ...manuals, title: e.target.value })} />
          </Field>
        </div>

        {manuals.list.map((m, i) => (
          <div key={m.id} className="rounded-lg border border-border/60 bg-background/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[11px] uppercase tracking-widest text-primary">Manual {i + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setManuals({ ...manuals, list: manuals.list.filter((_, j) => j !== i) })}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Título">
                <Input
                  className="h-9 text-sm"
                  value={m.title}
                  onChange={(e) => setManuals({ ...manuals, list: manuals.list.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                />
              </Field>
              <Field label="Subtítulo">
                <Input
                  className="h-9 text-sm"
                  value={m.subtitle}
                  onChange={(e) => setManuals({ ...manuals, list: manuals.list.map((x, j) => (j === i ? { ...x, subtitle: e.target.value } : x)) })}
                />
              </Field>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">Tópicos</div>
              <StringList
                multiline
                values={m.items}
                onChange={(items) => setManuals({ ...manuals, list: manuals.list.map((x, j) => (j === i ? { ...x, items } : x)) })}
                addLabel="Adicionar tópico"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs"
          onClick={() =>
            setManuals({
              ...manuals,
              list: [...manuals.list, { id: `manual-${Date.now()}`, title: "Novo manual", subtitle: "", items: [""] }],
            })
          }
        >
          <Plus className="h-3.5 w-3.5" /> Adicionar manual
        </Button>
      </Panel>

      {/* PRESENTE */}
      <Panel
        title="Nosso Presente"
        description="Texto e chave Pix exibidos na home."
        saving={save.isPending}
        onSave={() => doSave("gift", gift)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta">
            <Input className="h-9 text-sm" value={gift.eyebrow} onChange={(e) => setGift({ ...gift, eyebrow: e.target.value })} />
          </Field>
          <Field label="Título">
            <Input className="h-9 text-sm" value={gift.title} onChange={(e) => setGift({ ...gift, title: e.target.value })} />
          </Field>
        </div>
        <Field label="Texto">
          <Textarea className="min-h-[100px] text-sm" value={gift.text} onChange={(e) => setGift({ ...gift, text: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Rótulo da chave">
            <Input className="h-9 text-sm" value={gift.pixLabel} onChange={(e) => setGift({ ...gift, pixLabel: e.target.value })} />
          </Field>
          <Field label="Chave Pix">
            <Input className="h-9 text-sm" value={gift.pixKey} onChange={(e) => setGift({ ...gift, pixKey: e.target.value })} />
          </Field>
        </div>
      </Panel>

      {/* PRÉ-WEDDING */}
      <Panel
        title="Pré-Wedding"
        description="Fotos exibidas abaixo da seção Nosso Presente."
        saving={save.isPending}
        onSave={() => doSave("prewedding", prewedding)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etiqueta">
            <Input className="h-9 text-sm" value={prewedding.eyebrow} onChange={(e) => setPrewedding({ ...prewedding, eyebrow: e.target.value })} />
          </Field>
          <Field label="Título">
            <Input className="h-9 text-sm" value={prewedding.title} onChange={(e) => setPrewedding({ ...prewedding, title: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {prewedding.photos.map((p, i) => (
            <div key={i} className="aspect-[3/4] overflow-hidden rounded-md border border-border/60">
              {p ? <img src={p} alt="" className="h-full w-full object-cover" /> : null}
            </div>
          ))}
        </div>
        <StringList
          values={prewedding.photos}
          onChange={(photos) => setPrewedding({ ...prewedding, photos })}
          placeholder="URL da imagem"
          addLabel="Adicionar foto"
        />
      </Panel>
    </div>
  );
}
