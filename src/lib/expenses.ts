import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Expense = Tables<"expenses">;
export type ExpenseInsert = TablesInsert<"expenses">;
export type ExpenseUpdate = TablesUpdate<"expenses">;

export const EXPENSES_KEY = ["expenses"] as const;

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: async (): Promise<Expense[]> => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpsertExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExpenseInsert & { id?: string }) => {
      if (input.id) {
        const { id, ...rest } = input;
        const { error } = await supabase.from("expenses").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("expenses").insert(input);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function computeAmounts(e: Expense) {
  const total = Number(e.total_amount);
  const down = Math.min(Number(e.down_payment ?? 0), total);
  if (e.status === "paid") return { paid: total, remaining: 0, total, down };
  if (e.status === "pending") return { paid: down, remaining: Math.max(total - down, 0), total, down };
  // installment
  const base = Math.max(total - down, 0);
  const per = e.installments_total > 0 ? base / e.installments_total : base;
  const paidInst = per * Math.min(e.installments_paid, e.installments_total);
  const paid = down + paidInst;
  return { paid, remaining: Math.max(total - paid, 0), total, down };
}

export function summarize(items: Expense[]) {
  let paid = 0, remaining = 0, total = 0, inProgress = 0, gifts = 0, giftsCount = 0, count = 0;
  for (const e of items) {
    const a = computeAmounts(e);
    const owner = (((e as any).owner as Owner) ?? "Ambos");
    if (owner === "Presente") {
      gifts += a.total;
      giftsCount += 1;
      continue;
    }
    paid += a.paid;
    remaining += a.remaining;
    total += a.total;
    if (e.status === "installment" && a.remaining > 0) inProgress += a.remaining;
    count += 1;
  }
  return { paid, remaining, total, inProgress, count, gifts, giftsCount };
}

export type Owner = "Luiz" | "Brenda" | "Ambos" | "Presente";
export const OWNERS: Owner[] = ["Luiz", "Brenda", "Ambos", "Presente"];

export function summarizeByOwner(items: Expense[]) {
  const result: Record<"Luiz" | "Brenda", { paid: number; remaining: number; total: number; inProgress: number; count: number }> = {
    Luiz: { paid: 0, remaining: 0, total: 0, inProgress: 0, count: 0 },
    Brenda: { paid: 0, remaining: 0, total: 0, inProgress: 0, count: 0 },
  };
  for (const e of items) {
    const a = computeAmounts(e);
    const owner = (((e as any).owner as Owner) ?? "Ambos");
    if (owner === "Presente") continue;
    const targets: Array<{ key: "Luiz" | "Brenda"; share: number }> =
      owner === "Ambos"
        ? [{ key: "Luiz", share: 0.5 }, { key: "Brenda", share: 0.5 }]
        : [{ key: owner as "Luiz" | "Brenda", share: 1 }];
    for (const t of targets) {
      result[t.key].paid += a.paid * t.share;
      result[t.key].remaining += a.remaining * t.share;
      result[t.key].total += a.total * t.share;
      if (e.status === "installment" && a.remaining > 0) {
        result[t.key].inProgress += a.remaining * t.share;
      }
      result[t.key].count += 1;
    }
  }
  return result;
}

export const BRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
