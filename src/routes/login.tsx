import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout, authButton, authInput } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <AuthLayout
      title={forgot ? "Recuperar senha" : "Área dos noivos"}
      subtitle={
        forgot
          ? "Informe seu e-mail para receber o link de recuperação."
          : "Painel privado das finanças do casamento. Entre com seu e-mail e senha."
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="eyebrow !text-[10px] text-muted-foreground">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={authInput}
          />
        </div>
        {!forgot && (
          <div className="space-y-1.5">
            <Label htmlFor="password" className="eyebrow !text-[10px] text-muted-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={authInput}
            />
          </div>
        )}
        <Button type="submit" disabled={busy} className={authButton}>
          {busy ? "Aguarde..." : forgot ? "Enviar link" : "Entrar"}
        </Button>
        <button
          type="button"
          onClick={() => setForgot((v) => !v)}
          className="block w-full text-center text-[13px] text-muted-foreground transition-colors hover:text-primary"
        >
          {forgot ? "Voltar ao login" : "Esqueci minha senha"}
        </button>
      </form>
    </AuthLayout>
  );
}
