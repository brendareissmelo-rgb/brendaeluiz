import { useEffect, useState } from "react";

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

/** Contagem regressiva em blocos caramelo, como nos convites impressos. */
export function Countdown() {
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
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4" role="timer" aria-label="Contagem regressiva para o casamento">
      {parts.map((p) => (
        <div
          key={p.l}
          className="flex aspect-[4/5] min-w-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-caramel to-gold-600 text-cream shadow-[0_14px_26px_-16px_var(--color-gold-700)] ring-1 ring-white/25 ring-inset sm:aspect-square"
        >
          <span className="font-display text-[30px] font-normal leading-none tabular-nums sm:text-4xl">
            {p.v === undefined || p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/85">{p.l}</span>
        </div>
      ))}
    </div>
  );
}
