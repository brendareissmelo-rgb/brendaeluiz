import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Gift,
  Pencil,
  Plus,
  Receipt,
  PiggyBank,
  Search,
  Timer,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DonutRing, Meter, OwnerTag, StatusBadge, ownerOf, OWNER_STYLES } from "@/components/finance-ui";

export const Route = createFileRoute("/despesas")({
  component: () => (
    <AppShell>
      <ExpensesPage />
    </AppShell>
  ),
});

const C = { paid: "#3fcfa0", reserved: "#3b82f6", remaining: "#e0a33c" };

const STATUS_LABEL: Record<Expense["status"], string> = {
  paid: "Pago",
  pending: "A pagar",
  installment: "Parcelado",
};

const STATUS_ICON: Record<Expense["status"], React.ElementType> = {
  paid: CheckCircle2,
  pending: Timer,
  installment: CreditCard,
};

type FormState = {
  id?: string;
  name: string;
  category: string;
  owner: Owner;
  total_amount: string;
  down_payment: string;
  reserved: string;
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
  reserved: "",
  status: "pending",
  installments_total: "1",
  installments_paid: "0",
  due_date: "",
  paid_date: "",
  notes: "",
};

function ExpensesPage() {
  const { user } = useAuth();
  const { data: items = [], isLoading } = useExpenses();
  const upsert = useUpsertExpense();
  const remove = useDeleteExpense();

  const [filter, setFilter] = useState<"all" | Expense["status"]>("all");
  const [ownerFilter, setOwnerFilter] = useState<"all" | Owner>("all");
  const [q, setQ] = useState("");
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
      reserved: (e as any).reserved ? String((e as any).reserved) : "",
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
    const rawReserved = parseFloat((form.reserved || "0").replace(",", "."));
    const reserved = isNaN(rawReserved) ? 0 : Math.min(Math.max(rawReserved, 0), amount);
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
        reserved: form.status === "paid" ? 0 : reserved,
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Despesas</h1>
          </div>
          <p className="mt-1 text-xs font-normal text-muted-foreground">
            Adicione, edite ou remova. Tudo sincroniza com o dashboard.
          </p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Nova despesa
        </Button>
      </div>

      {/* RESUMO DO FILTRO */}
      <Card className="border-border/50 bg-card p-5">
        <div className="flex flex-wrap items-center gap-6">
          <DonutRing
            size={92}
            thickness={9}
            segments={[
              { value: totals.paid, color: C.paid },
              { value: totals.reserved, color: C.reserved },
              { value: totals.remaining, color: C.remaining },
            ]}
          >
            <span className="text-base font-bold tabular-nums">{totals.pct}%</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">coberto</span>
          </DonutRing>
          <div className="min-w-[180px] flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Seleção atual · {filtered.length} item(ns)
            </div>
            <div className="mt-1 text-3xl font-bold leading-none tabular-nums">{BRL(totals.total)}</div>
            <div className="mt-4">
              <Meter
                height={8}
                segments={[
                  { value: totals.paid, color: C.paid },
                  { value: totals.reserved, color: C.reserved },
                  { value: totals.remaining, color: C.remaining },
                ]}
              />
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="h-3 w-3 text-success" /> Pago
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-success">{BRL(totals.paid)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <PiggyBank className="h-3 w-3 text-sky-400" /> Na caixinha
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-sky-400">{BRL(totals.reserved)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Timer className="h-3 w-3 text-warning" /> A pagar
              </div>
              <div className="mt-1 text-lg font-bold tabular-nums text-warning">{BRL(totals.remaining)}</div>
            </div>
          </div>

        </div>
      </Card>

      {/* FILTROS */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "paid", "installment", "pending"] as const).map((k) => {
            const Icon = k === "all" ? Wallet : STATUS_ICON[k];
            return (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors " +
                  (filter === k
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-muted-foreground hover:text-foreground")
                }
              >
                <Icon className="h-3 w-3" />
                {k === "all" ? "Todas" : STATUS_LABEL[k]}
                <span className="tabular-nums opacity-60">{counts[k]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "Luiz", "Brenda", "Ambos", "Presente"] as const).map((k) => {
            const style = k === "all" ? null : OWNER_STYLES[k];
            const Icon = k === "all" ? Users : k === "Presente" ? Gift : Users;
            const active = ownerFilter === k;
            return (
              <button
                key={k}
                onClick={() => setOwnerFilter(k)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors " +
                  (active
                    ? style
                      ? `${style.bg} ${style.text} ${style.border}`
                      : "border-primary/50 bg-primary/10 text-primary"
                    : "border-border/60 bg-card text-muted-foreground hover:text-foreground")
                }
              >
                {k === "all" ? <Icon className="h-3 w-3" /> : <span className={`h-2 w-2 rounded-full ${style!.dot}`} />}
                {k === "all" ? "Todos" : k}
                <span className="tabular-nums opacity-60">{ownerCounts[k]}</span>
              </button>
            );
          })}

          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="h-8 w-44 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* LISTA */}
      {isLoading ? (
        <Card className="border-border/50 bg-card p-8 text-center text-xs text-muted-foreground">Carregando...</Card>
      ) : filtered.length === 0 ? (
        <Card className="border-border/50 bg-card p-10 text-center">
          <Receipt className="mx-auto h-6 w-6 text-muted-foreground/60" />
          <p className="mt-2 text-xs text-muted-foreground">Nenhuma despesa nesta seleção.</p>
        </Card>
      ) : (
        <div className="grid gap-2.5">
          {filtered.map((e) => {
            const a = computeAmounts(e);
            const p = a.total > 0 ? Math.round(((a.paid + a.reserved) / a.total) * 100) : 0;
            const owner = ownerOf(e);
            const Icon = STATUS_ICON[e.status];
            const isGift = owner === "Presente";
            return (
              <Card
                key={e.id}
                className={`group border-border/50 bg-card p-4 transition-colors hover:border-border ${
                  isGift ? "border-amber-500/25" : ""
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isGift
                        ? "bg-amber-500/10 text-amber-400"
                        : e.status === "paid"
                        ? "bg-success/10 text-success"
                        : e.status === "installment"
                        ? "bg-primary/10 text-primary"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {isGift ? <Gift className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>

                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold tracking-tight">{e.name}</h3>
                      <OwnerTag owner={owner} />
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-normal text-muted-foreground">
                      <span>{e.category}</span>
                      {e.status === "installment" && (
                        <span className="tabular-nums">
                          {e.installments_paid}/{e.installments_total} parcelas
                        </span>
                      )}
                      {e.due_date && e.status !== "paid" && (
                        <span className="tabular-nums">vence {new Date(e.due_date).toLocaleDateString("pt-BR")}</span>
                      )}
                    </div>
                    {!isGift && (
                      <div className="mt-2.5 max-w-sm">
                        <Meter
                          height={5}
                          segments={[
                            { value: a.paid, color: C.paid },
                            { value: a.reserved, color: C.reserved },
                            { value: a.remaining, color: C.remaining },
                          ]}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-5 text-right tabular-nums sm:grid-cols-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pago</div>
                      <div className="text-sm font-semibold text-success">{BRL(a.paid)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Na caixinha</div>
                      <div className="text-sm font-semibold text-sky-400">{BRL(a.reserved)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Restante</div>
                      <div className="text-sm font-semibold text-warning">{BRL(a.remaining)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
                      <div className="text-base font-bold">{BRL(a.total)}</div>
                      {!isGift && <div className="text-[10px] font-normal text-muted-foreground">{p}% coberto</div>}
                    </div>
                  </div>


                  <div className="flex gap-1 self-center">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(e)} aria-label="Editar">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(e.id)}
                      aria-label="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {form.id ? <Pencil className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
              {form.id ? "Editar despesa" : "Nova despesa"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex.: Buffet, Vestido, Decoração..."
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Input list="cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <datalist id="cats">
                {["Buffet", "Local", "Decoração", "Vestido", "Traje", "Fotografia", "Vídeo", "Música", "Convites", "Lua de mel", "Cerimônia", "Outros"].map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Valor total (R$)</Label>
              <Input
                inputMode="decimal"
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Expense["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">A pagar</SelectItem>
                  <SelectItem value="installment">Parcelado</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Responsável</Label>
              <Select value={form.owner} onValueChange={(v) => setForm({ ...form, owner: v as Owner })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambos">Ambos (dividido 50/50)</SelectItem>
                  <SelectItem value="Luiz">Luiz</SelectItem>
                  <SelectItem value="Brenda">Brenda</SelectItem>
                  <SelectItem value="Presente">Presente (não sai do bolso)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.status !== "paid" && (
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">
                  Valor de entrada (R$) <span className="font-normal text-muted-foreground">— opcional</span>
                </Label>
                <Input
                  inputMode="decimal"
                  value={form.down_payment}
                  onChange={(e) => setForm({ ...form, down_payment: e.target.value })}
                  placeholder="0,00"
                />
                <p className="text-[11px] text-muted-foreground">
                  {form.status === "installment"
                    ? "Será descontado do total e o restante dividido nas parcelas."
                    : "Valor já adiantado dessa despesa."}
                </p>
              </div>
            )}
            {form.status === "installment" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Parcelas totais</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.installments_total}
                    onChange={(e) => setForm({ ...form, installments_total: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Parcelas pagas</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.installments_paid}
                    onChange={(e) => setForm({ ...form, installments_paid: e.target.value })}
                  />
                </div>
                <InstallmentPreview
                  total={parseFloat(form.total_amount.replace(",", ".")) || 0}
                  down={parseFloat((form.down_payment || "0").replace(",", ".")) || 0}
                  parts={Math.max(1, parseInt(form.installments_total || "1"))}
                  paid={Math.max(0, parseInt(form.installments_paid || "0"))}
                />
              </>
            )}
            {form.status !== "paid" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Vencimento</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
            )}
            {form.status === "paid" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Data do pagamento</Label>
                <Input type="date" value={form.paid_date} onChange={(e) => setForm({ ...form, paid_date: e.target.value })} />
              </div>
            )}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Observações</Label>
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={save} disabled={upsert.isPending}>
              {upsert.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="border-border/60 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="h-8 text-xs" onClick={confirmDelete}>Excluir</AlertDialogAction>
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
    <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-xs sm:col-span-2">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <CreditCard className="h-3 w-3" /> Resumo do parcelamento
      </div>
      <Meter
        height={6}
        segments={[
          { value: paidTotal, color: C.paid },
          { value: remainingAmount, color: C.remaining },
        ]}
      />
      <div className="mt-3 grid grid-cols-2 gap-2 tabular-nums sm:grid-cols-4">
        <div>
          <div className="text-[10px] text-muted-foreground">Entrada</div>
          <div className="font-semibold text-success">{BRL(cappedDown || 0)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Parcela ({parts}x)</div>
          <div className="font-semibold">{BRL(per || 0)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Já pago ({cappedPaid}x + entrada)</div>
          <div className="font-semibold text-success">{BRL(paidTotal || 0)}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground">Restante ({remainingParts}x)</div>
          <div className="font-semibold text-warning">{BRL(remainingAmount || 0)}</div>
        </div>
      </div>
    </div>
  );
}
