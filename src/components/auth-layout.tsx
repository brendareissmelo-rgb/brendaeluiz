import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import capa from "@/assets/capa-principal-2.jpg.asset.json";
import { Branch, Monogram } from "@/components/ornaments";

/** Moldura das telas de acesso (login e nova senha): foto em arco + cartão de convite. */
export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="paper relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pb-10 pt-[calc(env(safe-area-inset-top)+28px)]">
      <Branch className="absolute -left-10 top-10 h-44 w-44 -scale-x-100 rotate-[200deg] text-caramel/50" />
      <Branch className="absolute -right-10 bottom-10 h-44 w-44 text-caramel/40" />

      <div className="relative w-full max-w-sm">
        <div className="arch relative mx-auto h-[38svh] max-h-[340px] min-h-[220px] w-[78%] overflow-hidden border-[5px] border-card shadow-[0_24px_44px_-26px_rgba(58,40,32,0.65)]">
          <img src={capa.url} alt="Brenda e Luiz" className="h-full w-full object-cover object-[50%_35%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/40 to-transparent" />
        </div>

        <div className="card-invite relative -mt-10 rounded-[28px] px-6 pb-7 pt-12">
          <Monogram className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 bg-card text-[30px] shadow-[0_10px_24px_-12px_rgba(58,40,32,0.5)]" />
          <div className="text-center">
            <h1 className="font-display text-[26px] font-normal leading-tight">{title}</h1>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition hover:text-primary">
            ← Voltar ao convite
          </Link>
        </div>
      </div>
    </main>
  );
}

/** Classes compartilhadas dos campos das telas de acesso. */
export const authInput =
  "h-12 rounded-2xl border-border bg-background/70 px-4 text-[15px] shadow-none focus-visible:border-primary/50 focus-visible:ring-4 focus-visible:ring-primary/10";

export const authButton =
  "h-12 w-full rounded-full text-[14px] font-medium tracking-wide shadow-[0_12px_24px_-12px_var(--color-primary)]";
