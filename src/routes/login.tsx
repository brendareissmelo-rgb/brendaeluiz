import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/painel" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Enviamos um link de recuperação para o seu e-mail.");
        setForgot(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vinda!");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Erro");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm border-border/60 bg-card p-6">
        <div className="mb-5">
          <h1 className="text-lg font-semibold tracking-tight">Finanças do Casamento</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {forgot
              ? "Informe seu e-mail para receber o link de recuperação."
              : "Painel privado. Entre com seu e-mail e senha."}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          {!forgot && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          )}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Aguarde..." : forgot ? "Enviar link" : "Entrar"}
          </Button>
          <button
            type="button"
            onClick={() => setForgot((v) => !v)}
            className="block w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {forgot ? "Voltar ao login" : "Esqueci minha senha"}
          </button>
        </form>
      </Card>
    </main>
  );
}
