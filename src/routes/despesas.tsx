import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  useExpenses,
  useUpsertExpense,
  useDeleteExpense,
  computeAmounts,
  BRL,
  type Expense,
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

type FormState = {
  id?: string;
  name: string;
  category: string;
  total_amount: string;
  down_payment: string;
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
  total_amount: "",
  down_payment: "",
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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((e) => e.status === filter)),
    [items, filter]
  );

  const openNew = () => {
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (e: Expense) => {
    setForm({
      id: e.id,
      name: e.name,
      category: e.category,
      total_amount: String(e.total_amount),
      down_payment: e.down_payment ? String(e.down_payment) : "",
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
    const total = form.status === "installment" ? Math.max(1, parseInt(form.installments_total || "1")) : 1;
    const paidInst = form.status === "installment" ? Math.min(total, Math.max(0, parseInt(form.installments_paid || "0"))) : form.status === "paid" ? 1 : 0;

    try {
      await upsert.mutateAsync({
        id: form.id,
        user_id: user.id,
        name: form.name.trim(),
        category: form.category.trim() || "Outros",
        total_amount: amount,
        down_payment: form.status === "paid" ? 0 : down,
        status: form.status,
        installments_total: total,
        installments_paid: paidInst,
        due_date: form.due_date || null,
        paid_date: form.status === "paid" ? (form.paid_date || new Date().toISOString().slice(0, 10)) : (form.paid_date || null),
        notes: form.notes.trim() || null,
      });
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

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Despesas</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Adicione, edite ou remova. Tudo sincroniza com o dashboard.
          </p>
        </div>
        <Button size="sm" onClick={openNew}>+ Nova despesa</Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "paid", "installment", "pending"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={
              "rounded-md border px-2.5 py-1 text-xs transition-colors " +
              (filter === k
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground")
            }
          >
            {k === "all" ? "Todas" : STATUS_LABEL[k]}{" "}
            <span className="ml-1 tabular-nums opacity-70">{counts[k]}</span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="h-9 text-[11px] uppercase tracking-wide">Nome</TableHead>
              <TableHead className="h-9 text-[11px] uppercase tracking-wide">Categoria</TableHead>
              <TableHead className="h-9 text-[11px] uppercase tracking-wide">Status</TableHead>
              <TableHead className="h-9 text-[11px] uppercase tracking-wide text-right">Pago</TableHead>
              <TableHead className="h-9 text-[11px] uppercase tracking-wide text-right">Restante</TableHead>
              <TableHead className="h-9 text-[11px] uppercase tracking-wide text-right">Total</TableHead>
              <TableHead className="h-9 w-px"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-xs text-muted-foreground">Nenhuma despesa.</TableCell></TableRow>
            ) : filtered.map((e) => {
              const a = computeAmounts(e);
              return (
                <TableRow key={e.id} className="border-border/60">
                  <TableCell className="py-2.5">
                    <div className="text-sm font-medium">{e.name}</div>
                    {e.status === "installment" && (
                      <div className="text-[11px] text-muted-foreground">
                        {e.installments_paid}/{e.installments_total} parcelas
                      </div>
                    )}
                    {e.due_date && e.status !== "paid" && (
                      <div className="text-[11px] text-muted-foreground">
                        vence {new Date(e.due_date).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 text-xs text-muted-foreground">{e.category}</TableCell>
                  <TableCell className="py-2.5">
                    <StatusBadge status={e.status} />
                  </TableCell>
                  <TableCell className="py-2.5 text-right text-sm tabular-nums text-success">{BRL(a.paid)}</TableCell>
                  <TableCell className="py-2.5 text-right text-sm tabular-nums text-warning">{BRL(a.remaining)}</TableCell>
                  <TableCell className="py-2.5 text-right text-sm tabular-nums">{BRL(a.total)}</TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(e)}>Editar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setDeleteId(e.id)}>Excluir</Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-border/60 bg-card">
          <DialogHeader>
            <DialogTitle className="text-base">{form.id ? "Editar despesa" : "Nova despesa"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Buffet, Vestido, Decoração..." />
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
              <Input inputMode="decimal" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} placeholder="0,00" />
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
            {form.status === "installment" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs">Parcelas totais</Label>
                  <Input type="number" min={1} value={form.installments_total} onChange={(e) => setForm({ ...form, installments_total: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Parcelas pagas</Label>
                  <Input type="number" min={0} value={form.installments_paid} onChange={(e) => setForm({ ...form, installments_paid: e.target.value })} />
                </div>
                <InstallmentPreview
                  total={parseFloat(form.total_amount.replace(",", ".")) || 0}
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
            <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatusBadge({ status }: { status: Expense["status"] }) {
  if (status === "paid") return <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">Pago</Badge>;
  if (status === "installment") return <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/15">Parcelado</Badge>;
  return <Badge className="bg-warning/15 text-warning border-warning/30 hover:bg-warning/15">A pagar</Badge>;
}

function InstallmentPreview({ total, parts, paid }: { total: number; parts: number; paid: number }) {
  const per = total / parts;
  const cappedPaid = Math.min(paid, parts);
  const paidAmount = per * cappedPaid;
  const remainingAmount = Math.max(total - paidAmount, 0);
  const remainingParts = Math.max(parts - cappedPaid, 0);
  return (
    <div className="sm:col-span-2 rounded-md border border-border/60 bg-muted/30 p-3 text-xs">
      <div className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Resumo do parcelamento</div>
      <div className="grid grid-cols-3 gap-2 tabular-nums">
        <div><div className="text-muted-foreground text-[11px]">Valor da parcela</div><div className="font-medium">{BRL(per || 0)}</div></div>
        <div><div className="text-muted-foreground text-[11px]">Já pago ({cappedPaid}x)</div><div className="font-medium text-success">{BRL(paidAmount || 0)}</div></div>
        <div><div className="text-muted-foreground text-[11px]">Restante ({remainingParts}x)</div><div className="font-medium text-warning">{BRL(remainingAmount || 0)}</div></div>
      </div>
    </div>
  );
}
