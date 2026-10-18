import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, CreditCard, Gift, Pencil, PiggyBank, Plus, Search, Trash2, X } from "lucide-react";
import { AppShell, PageTitle, panelCard } from "@/components/AppShell";
import {
  useExpenses,
  useUpsertExpense,
  useDeleteExpense,
  computeAmounts,
  BRL,
  type Expense,
  type Owner,
} from "@/lib/expenses";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DonutRing, FIN_COLORS as C, Meter, OwnerTag, ownerOf, OWNER_STYLES } from "@/components/finance-ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/despesas")({
  component: () => (
    <AppShell>
      <ExpensesPage />
    </AppShell>
  ),
});

const STATUS_LABEL: Record<Expense["status"], string> = {
  paid: "Pago",
  pending: "A pagar",
  installment: "Parcelado",
};

/** Ordem dos grupos na lista: o que exige atenção primeiro. */
const GROUPS: Expense["status"][] = ["pending", "installment", "paid"];

const CATEGORIES = ["Buffet", "Local", "Decoração", "Vestido", "Traje", "Fotografia", "Vídeo", "Música", "Convites", "Lua de mel", "Cerimônia", "Outros"];

const fieldLabel = "text-[12.5px] font-semibold text-foreground/80";
const field = "h-12 rounded-2xl border-border/80 bg-[#f6f1ea] text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-primary/30";

type FormState = {
  id?: string;
  name: string;
  category: string;
  owner: Owner;
  total_amount: string;
  down_payment: string;
  reserved_brenda: string;
  reserved_luiz: string;
  status: Expense["status"];
  installments_total: string;
  installments_paid: string;
  due_date: string;
  paid_date: string;
  notes: string;
};

const empty: FormState = {
  name: "",
  category: "Outros",
  owner: "Ambos",
  total_amount: "",
  down_payment: "",
  reserved_brenda: "",
  reserved_luiz: "",
  status: "pending",
  installments_total: "1",
  installments_paid: "0",
  due_date: "",
  paid_date: "",
  notes: "",
};

/** Controle segmentado (pílulas lado a lado). */
function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="flex rounded-2xl bg-[#ece3d7] p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[13px] font-bold transition-all",
            value === o.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="text-[11px] font-semibold opacity-60">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

function ExpensesPage() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useExpenses();
  const upsert = useUpsertExpense();
  const remove = useDeleteExpense();

  const [filter, setFilter] = useState<"all" | Expense["status"]>("all");
  const [ownerFilter, setOwnerFilter] = useState<"all" | Owner>("all");
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items
        .filter((e) => (filter === "all" ? true : e.status === filter))
        .filter((e) => (ownerFilter === "all" ? true : ownerOf(e) === ownerFilter))
        .filter((e) =>
          q.trim() ? (e.name + " " + e.category).toLowerCase().includes(q.trim().toLowerCase()) : true
        ),
    [items, filter, ownerFilter, q]
  );

  const totals = useMemo(() => {
    let paid = 0, reserved = 0, remaining = 0, total = 0;
    for (const e of filtered) {
      const a = computeAmounts(e);
      paid += a.paid;
      reserved += a.reserved;
      remaining += a.remaining;
      total += a.total;
    }
    return { paid, reserved, remaining, total, pct: total > 0 ? Math.round(((paid + reserved) / total) * 100) : 0 };
  }, [filtered]);

  const openNew = () => {
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (e: Expense) => {
    setForm({
      id: e.id,
      name: e.name,
      category: e.category,
      owner: ownerOf(e),
      total_amount: String(e.total_amount),
      down_payment: e.down_payment ? String(e.down_payment) : "",
      reserved_brenda: e.reserved_brenda ? String(e.reserved_brenda) : "",
      reserved_luiz: e.reserved_luiz ? String(e.reserved_luiz) : "",
      status: e.status,
      installments_total: String(e.installments_total),
      installments_paid: String(e.installments_paid),
      due_date: e.due_date ?? "",
      paid_date: e.paid_date ?? "",
      notes: e.notes ?? "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!user) return;
    const amount = parseFloat(form.total_amount.replace(",", "."));
    if (!form.name.trim() || isNaN(amount) || amount < 0) {
      toast.error("Preencha nome e valor corretamente.");
      return;
    }
    const rawDown = parseFloat((form.down_payment || "0").replace(",", "."));
    const down = isNaN(rawDown) ? 0 : Math.min(Math.max(rawDown, 0), amount);
    const rawReservedB = parseFloat((form.reserved_brenda || "0").replace(",", "."));
    const reservedBrenda = isNaN(rawReservedB) ? 0 : Math.min(Math.max(rawReservedB, 0), amount);
    const rawReservedL = parseFloat((form.reserved_luiz || "0").replace(",", "."));
    const reservedLuiz = isNaN(rawReservedL) ? 0 : Math.min(Math.max(rawReservedL, 0), amount);
    const total = form.status === "installment" ? Math.max(1, parseInt(form.installments_total || "1")) : 1;
    const paidInst =
      form.status === "installment"
        ? Math.min(total, Math.max(0, parseInt(form.installments_paid || "0")))
        : form.status === "paid"
        ? 1
        : 0;

    try {
      await upsert.mutateAsync({
        id: form.id,
        user_id: user.id,
        name: form.name.trim(),
        category: form.category.trim() || "Outros",
        total_amount: amount,
        down_payment: form.status === "paid" ? 0 : down,
        reserved_brenda: form.status === "paid" ? 0 : reservedBrenda,
        reserved_luiz: form.status === "paid" ? 0 : reservedLuiz,
        status: form.status,
        installments_total: total,
        installments_paid: paidInst,
        due_date: form.due_date || null,
        paid_date:
          form.status === "paid"
            ? form.paid_date || new Date().toISOString().slice(0, 10)
            : form.paid_date || null,
        notes: form.notes.trim() || null,
        owner: form.owner,
      } as any);
      toast.success(form.id ? "Despesa atualizada" : "Despesa adicionada");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao salvar");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await remove.mutateAsync(deleteId);
      toast.success("Despesa removida");
    } catch (err: any) {
      toast.error(err.message ?? "Erro");
    } finally {
      setDeleteId(null);
    }
  };

  const counts = {
    all: items.length,
    paid: items.filter((e) => e.status === "paid").length,
    pending: items.filter((e) => e.status === "pending").length,
    installment: items.filter((e) => e.status === "installment").length,
  };
  const ownerCounts = {
    all: items.length,
    Luiz: items.filter((e) => ownerOf(e) === "Luiz").length,
    Brenda: items.filter((e) => ownerOf(e) === "Brenda").length,
    Ambos: items.filter((e) => ownerOf(e) === "Ambos").length,
    Presente: items.filter((e) => ownerOf(e) === "Presente").length,
  };

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-5 pb-16 sm:pb-0">
      <PageTitle
        title="Despesas"
        subtitle={`${items.length} itens · tudo sincroniza com o resumo`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Buscar"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-border/70",
                searchOpen ? "bg-foreground text-background" : "bg-card",
              )}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Button onClick={openNew} className="hidden h-11 rounded-full bg-foreground px-5 font-bold text-background hover:bg-foreground/90 sm:inline-flex">
              <Plus className="h-4 w-4" /> Nova despesa
            </Button>
          </div>
        }
      />

      {searchOpen && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou categoria" className={`${field} bg-card pl-11`} />
          {q && (
            <button onClick={() => setQ("")} aria-label="Limpar" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-muted p-1.5">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Filtros */}
      <Segmented
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "Todas", count: counts.all },
          { value: "pending", label: "A pagar", count: counts.pending },
          { value: "installment", label: "Parcel.", count: counts.installment },
          { value: "paid", label: "Pagas", count: counts.paid },
        ]}
      />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {(["all", "Brenda", "Luiz", "Ambos", "Presente"] as const).map((k) => {
          const style = k === "all" ? null : OWNER_STYLES[k];
          const active = ownerFilter === k;
          return (
            <button
              key={k}
              onClick={() => setOwnerFilter(k)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold ring-1 transition-colors",
                active ? "bg-foreground text-background ring-foreground" : "bg-card text-muted-foreground ring-border/70",
              )}
            >
              {style && <span className={`h-2 w-2 rounded-full ${style.dot}`} />}
              {k === "all" ? "Todos" : k}
              <span className="text-[11px] opacity-60">{ownerCounts[k]}</span>
            </button>
          );
        })}
      </div>

      {/* Resumo da seleção */}
      <div className={`${panelCard} flex items-center gap-4 p-4`}>
        <DonutRing
          size={56}
          thickness={7}
          segments={[
            { value: totals.paid, color: C.paid },
            { value: totals.reserved, color: C.reserved },
            { value: totals.remaining, color: C.remaining },
          ]}
        >
          <span className="text-[12px] font-extrabold tabular-nums">{totals.pct}%</span>
        </DonutRing>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-muted-foreground">Seleção · {filtered.length} itens</div>
          <div className="truncate text-[22px] font-extrabold leading-tight tabular-nums">{BRL(totals.total)}</div>
          <div className="mt-0.5 flex gap-3 text-[11.5px] font-semibold tabular-nums text-muted-foreground">
            <span className="text-warning">falta {BRL(totals.remaining)}</span>
          </div>
        </div>
      </div>

      {/* Lista agrupada */}
      {isLoading ? (
        <div className={`${panelCard} p-8 text-center text-[13px] text-muted-foreground`}>Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className={`${panelCard} p-10 text-center text-[13px] text-muted-foreground`}>Nenhuma despesa nesta seleção.</div>
      ) : (
        <div className="space-y-6">
          {GROUPS.map((g) => {
            const list = filtered.filter((e) => e.status === g);
            if (!list.length) return null;
            const sum = list.reduce((n, e) => n + computeAmounts(e).remaining, 0);
            return (
              <section key={g}>
                <div className="mb-2 flex items-baseline justify-between px-1">
                  <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-muted-foreground">
                    {STATUS_LABEL[g]} <span className="font-semibold opacity-60">· {list.length}</span>
                  </h2>
                  {g !== "paid" && <span className="text-[12.5px] font-bold tabular-nums text-warning">falta {BRL(sum)}</span>}
                </div>
                <ul className={`${panelCard} divide-y divide-border/60 overflow-hidden`}>
                  {list.map((e) => {
                    const a = computeAmounts(e);
                    const p = a.total > 0 ? Math.round(((a.paid + a.reserved) / a.total) * 100) : 0;
                    const owner = ownerOf(e);
                    const isGift = owner === "Presente";
                    const isOpen = expanded === e.id;
                    return (
                      <li key={e.id}>
                        <button
                          onClick={() => setExpanded(isOpen ? null : e.id)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/50"
                        >
                          {isGift ? (
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d9a54a]/15 text-[#9a6a2c]">
                              <Gift className="h-[18px] w-[18px]" />
                            </span>
                          ) : (
                            <DonutRing
                              size={44}
                              thickness={5}
                              segments={[
                                { value: a.paid, color: C.paid },
                                { value: a.reserved, color: C.reserved },
                                { value: a.remaining, color: "transparent" },
                              ]}
                            >
                              <span className="text-[10.5px] font-extrabold tabular-nums">{p}%</span>
                            </DonutRing>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[14.5px] font-bold leading-snug">{e.name}</div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${OWNER_STYLES[owner].dot}`} />
                              <span className="truncate">
                                {owner} · {e.category}
                                {e.status === "installment" && ` · ${e.installments_paid}/${e.installments_total}x`}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            {g === "paid" || isGift ? (
                              <div className="text-[14.5px] font-extrabold tabular-nums">{BRL(a.total)}</div>
                            ) : (
                              <>
                                <div className="text-[14.5px] font-extrabold tabular-nums text-warning">{BRL(a.remaining)}</div>
                                <div className="text-[11px] font-semibold tabular-nums text-muted-foreground">de {BRL(a.total)}</div>
                              </>
                            )}
                          </div>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                          <div className="bg-[#faf6f0] px-4 pb-4 pt-1">
                            {!isGift && (
                              <Meter
                                height={6}
                                segments={[
                                  { value: a.paid, color: C.paid },
                                  { value: a.reserved, color: C.reserved },
                                  { value: a.remaining, color: C.remaining },
                                ]}
                              />
                            )}
                            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12.5px]">
                              <div>
                                <dt className="text-muted-foreground">Pago</dt>
                                <dd className="font-bold tabular-nums text-success">{BRL(a.paid)}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Caixinha</dt>
                                <dd className="font-bold tabular-nums text-info">{BRL(a.reserved)}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">Restante</dt>
                                <dd className="font-bold tabular-nums text-warning">{BRL(a.remaining)}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground">{e.due_date && e.status !== "paid" ? "Vencimento" : "Responsável"}</dt>
                                <dd className="font-bold">
                                  {e.due_date && e.status !== "paid" ? (
                                    new Date(e.due_date).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                                  ) : (
                                    <OwnerTag owner={owner} />
                                  )}
                                </dd>
                              </div>
                            </dl>
                            {e.notes && <p className="mt-3 rounded-xl bg-card px-3 py-2 text-[12.5px] text-muted-foreground">{e.notes}</p>}
                            <div className="mt-4 flex gap-2">
                              <Button onClick={() => openEdit(e)} className="h-10 flex-1 rounded-full bg-foreground font-bold text-background hover:bg-foreground/90">
                                <Pencil className="h-3.5 w-3.5" /> Editar
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteId(e.id)}
                                className="h-10 rounded-full border-border bg-card px-4 font-bold text-destructive hover:bg-destructive/5 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Excluir
                              </Button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {/* Botão flutuante (mobile) */}
      <button
        onClick={openNew}
        aria-label="Nova despesa"
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+80px)] right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-foreground pl-4 pr-5 text-[14px] font-bold text-background shadow-[0_16px_30px_-10px_rgba(58,40,32,0.6)] transition active:scale-95 sm:hidden"
      >
        <Plus className="h-5 w-5" /> Nova
      </button>

      {/* Formulário (bottom sheet no mobile) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="font-ui max-h-[92svh] max-w-lg gap-0 overflow-y-auto rounded-[28px] border-0 bg-card p-0 max-sm:bottom-0 max-sm:top-auto max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none">
          <DialogHeader className="sticky top-0 z-10 border-b border-border/60 bg-card/95 px-5 pb-4 pt-5 text-left backdrop-blur">
            <DialogTitle className="text-[20px] font-extrabold">{form.id ? "Editar despesa" : "Nova despesa"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 px-5 py-5">
            <div className="space-y-1.5">
              <Label className={fieldLabel}>Nome</Label>
              <Input className={field} value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Ex.: Buffet, Vestido, Decoração…" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className={fieldLabel}>Valor total (R$)</Label>
                <Input className={field} inputMode="decimal" value={form.total_amount} onChange={(e) => set({ total_amount: e.target.value })} placeholder="0,00" />
              </div>
              <div className="space-y-1.5">
                <Label className={fieldLabel}>Categoria</Label>
                <Input className={field} list="cats" value={form.category} onChange={(e) => set({ category: e.target.value })} />
                <datalist id="cats">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabel}>Status</Label>
              <Segmented
                value={form.status}
                onChange={(v) => set({ status: v })}
                options={[
                  { value: "pending", label: "A pagar" },
                  { value: "installment", label: "Parcelado" },
                  { value: "paid", label: "Pago" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <Label className={fieldLabel}>Quem paga</Label>
              <div className="grid grid-cols-4 gap-2">
                {(["Ambos", "Brenda", "Luiz", "Presente"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set({ owner: o })}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 text-[12px] font-bold ring-1 transition-colors",
                      form.owner === o ? "bg-foreground text-background ring-foreground" : "bg-[#f6f1ea] text-muted-foreground ring-border/70",
                    )}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${OWNER_STYLES[o].dot}`} />
                    {o}
                  </button>
                ))}
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                {form.owner === "Ambos" ? "Dividido 50/50." : form.owner === "Presente" ? "Não sai do bolso — não entra no orçamento." : " "}
              </p>
            </div>

            {form.status !== "paid" && (
              <div className="space-y-4 rounded-3xl bg-[#faf6f0] p-4 ring-1 ring-border/60">
                <div className="text-[13px] font-extrabold">Pagamento</div>
                <div className="space-y-1.5">
                  <Label className={fieldLabel}>Entrada (R$) · opcional</Label>
                  <Input className={`${field} bg-card`} inputMode="decimal" value={form.down_payment} onChange={(e) => set({ down_payment: e.target.value })} placeholder="0,00" />
                  <p className="text-[11.5px] text-muted-foreground">
                    {form.status === "installment" ? "Descontada do total; o restante é dividido nas parcelas." : "Valor já adiantado dessa despesa."}
                  </p>
                </div>
                {form.status === "installment" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className={fieldLabel}>Parcelas</Label>
                        <Input className={`${field} bg-card`} type="number" min={1} value={form.installments_total} onChange={(e) => set({ installments_total: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className={fieldLabel}>Já pagas</Label>
                        <Input className={`${field} bg-card`} type="number" min={0} value={form.installments_paid} onChange={(e) => set({ installments_paid: e.target.value })} />
                      </div>
                    </div>
                    <InstallmentPreview
                      total={parseFloat(form.total_amount.replace(",", ".")) || 0}
                      down={parseFloat((form.down_payment || "0").replace(",", ".")) || 0}
                      parts={Math.max(1, parseInt(form.installments_total || "1"))}
                      paid={Math.max(0, parseInt(form.installments_paid || "0"))}
                    />
                  </>
                )}
                <div className="space-y-1.5">
                  <Label className={fieldLabel}>Vencimento</Label>
                  <Input className={`${field} bg-card`} type="date" value={form.due_date} onChange={(e) => set({ due_date: e.target.value })} />
                </div>
              </div>
            )}

            {form.status !== "paid" && (
              <div className="space-y-3 rounded-3xl bg-[#eef2f5] p-4 ring-1 ring-[#7d97ad]/25">
                <div className="flex items-center gap-2 text-[13px] font-extrabold">
                  <PiggyBank className="h-4 w-4 text-info" /> Caixinha · opcional
                </div>
                <p className="text-[11.5px] text-muted-foreground">
                  Dinheiro guardado por fora para essa despesa. Não é pagamento oficial, mas abate o valor a pagar.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Brenda (R$)</Label>
                    <Input className={`${field} bg-card`} inputMode="decimal" value={form.reserved_brenda} onChange={(e) => set({ reserved_brenda: e.target.value })} placeholder="0,00" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={fieldLabel}>Luiz (R$)</Label>
                    <Input className={`${field} bg-card`} inputMode="decimal" value={form.reserved_luiz} onChange={(e) => set({ reserved_luiz: e.target.value })} placeholder="0,00" />
                  </div>
                </div>
              </div>
            )}

            {form.status === "paid" && (
              <div className="space-y-1.5">
                <Label className={fieldLabel}>Data do pagamento</Label>
                <Input className={field} type="date" value={form.paid_date} onChange={(e) => set({ paid_date: e.target.value })} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className={fieldLabel}>Observações</Label>
              <Textarea className="rounded-2xl border-border/80 bg-[#f6f1ea] text-[15px] shadow-none" rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })} />
            </div>
          </div>

          <div className="sticky bottom-0 flex gap-2 border-t border-border/60 bg-card/95 px-5 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4 backdrop-blur">
            <Button variant="ghost" className="h-12 rounded-full px-5 font-bold" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button className="h-12 flex-1 rounded-full bg-foreground text-[15px] font-bold text-background hover:bg-foreground/90" onClick={save} disabled={upsert.isPending}>
              {upsert.isPending ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="font-ui rounded-[28px] border-0 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[19px] font-extrabold">Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13.5px]">Essa ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 rounded-full font-bold">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="h-11 rounded-full bg-destructive font-bold hover:bg-destructive/90" onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InstallmentPreview({ total, down, parts, paid }: { total: number; down: number; parts: number; paid: number }) {
  const cappedDown = Math.min(Math.max(down, 0), total);
  const base = Math.max(total - cappedDown, 0);
  const per = base / parts;
  const cappedPaid = Math.min(paid, parts);
  const paidInst = per * cappedPaid;
  const paidTotal = cappedDown + paidInst;
  const remainingAmount = Math.max(total - paidTotal, 0);
  const remainingParts = Math.max(parts - cappedPaid, 0);
  return (
    <div className="rounded-2xl bg-card p-3.5 ring-1 ring-border/60">
      <div className="mb-2.5 flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground">
        <CreditCard className="h-3.5 w-3.5" /> {parts}x de {BRL(per || 0)}
      </div>
      <Meter
        height={6}
        segments={[
          { value: paidTotal, color: C.paid },
          { value: remainingAmount, color: C.remaining },
        ]}
      />
      <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
        <div>
          <div className="text-muted-foreground">Já pago ({cappedPaid}x + entrada)</div>
          <div className="font-bold tabular-nums text-success">{BRL(paidTotal || 0)}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Restante ({remainingParts}x)</div>
          <div className="font-bold tabular-nums text-warning">{BRL(remainingAmount || 0)}</div>
        </div>
      </div>
    </div>
  );
}
