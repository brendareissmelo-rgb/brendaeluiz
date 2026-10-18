import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TARGET = new Date("2026-12-12T17:30:00-03:00").getTime();

function calc() {
  const diff = Math.max(0, TARGET - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/** Contagem regressiva em linha: números serifados finos separados por filetes. */
export function Countdown({ className }: { className?: string }) {
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null);

  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = [
    { v: t?.days, l: "dias" },
    { v: t?.hours, l: "horas" },
    { v: t?.minutes, l: "min" },
    { v: t?.seconds, l: "seg" },
  ];

  return (
    <div
      className={cn("grid grid-cols-4 divide-x divide-border", className)}
      role="timer"
      aria-label="Contagem regressiva para o casamento"
    >
      {parts.map((p) => (
        <div key={p.l} className="flex flex-col items-center px-2">
          <span className="font-display text-[34px] font-light leading-none tabular-nums text-foreground sm:text-[42px]">
            {p.v === undefined || p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{p.l}</span>
        </div>
      ))}
    </div>
  );
}
