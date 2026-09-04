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
    <div className="flex items-center gap-3 sm:gap-5">
      {parts.map((p) => (
        <div key={p.l} className="flex min-w-14 flex-col items-center">
          <span className="font-helvetica text-3xl font-bold tabular-nums sm:text-4xl">
            {p.v === undefined || p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-[0.25em] opacity-70">{p.l}</span>
        </div>
      ))}
    </div>
  );
}
