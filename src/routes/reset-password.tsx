import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada");
      await supabase.auth.signOut();
      navigate({ to: "/login" });
    } catch (err: any) {
      toast.error(err.message ?? "Erro ao atualizar senha");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm border-border/60 bg-card p-6">
        <div className="mb-5">
          <h1 className="text-lg font-semibold tracking-tight">Nova senha</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {ready
              ? "Defina sua nova senha."
              : "Validando link de recuperação..."}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs">Nova senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-xs">Confirmar senha</Label>
            <Input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={!ready}
            />
          </div>
          <Button type="submit" disabled={busy || !ready} className="w-full">
            {busy ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
