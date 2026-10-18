import { cn } from "@/lib/utils";

/** Folha estilizada em traço fino. Desenhada a partir da base (0,0) apontando para a direita. */
const LEAF = "M0 0 C 9 -9, 25 -11, 38 0 C 25 11, 9 9, 0 0 Z";
const RIB = "M2 0 L 33 0";

/** Pontos ao longo do galho: [x, y, ângulo da folha, escala]. */
const BRANCH_LEAVES: Array<[number, number, number, number]> = [
  [44, 170, -18, 0.95],
  [52, 160, -112, 0.9],
  [72, 136, -28, 1],
  [82, 122, -122, 0.95],
  [97, 98, -38, 0.9],
  [104, 84, -132, 0.85],
  [118, 60, -46, 0.8],
  [128, 46, -138, 0.75],
  [146, 30, -58, 0.62],
  [160, 20, -150, 0.55],
];

/** Galho com folhas em line-art — usado nos cantos das seções. */
export function Branch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
    >
      <path d="M18 196 C 50 168, 80 132, 100 92 S 150 22, 188 8" />
      {BRANCH_LEAVES.map(([x, y, a, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
          <path d={LEAF} />
          <path d={RIB} strokeWidth={0.8} />
        </g>
      ))}
      <circle cx={178} cy={13} r={2.2} />
      <circle cx={186} cy={19} r={1.6} />
      <circle cx={171} cy={6} r={1.4} />
    </svg>
  );
}

/** Folha de carvalho preenchida, inspirada nos convites de outono. */
export function OakLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 90" aria-hidden="true" className={cn("pointer-events-none", className)}>
      <path
        fill="currentColor"
        d="M30 4c4 6 2 10 7 12 5 2 8-3 11 1 3 4-3 8 0 12 3 4 9 1 10 6 1 5-6 6-6 11s7 6 4 11c-3 5-9 0-12 4-3 4 1 9-4 11-4 2-6-3-10-2v16h-2V70c-4-1-6 4-10 2-5-2-1-7-4-11-3-4-9 1-12-4-3-5 4-6 4-11S4 40 5 35c1-5 7-2 10-6 3-4-3-8 0-12 3-4 6 1 11-1 5-2 3-6 4-12z"
        opacity={0.9}
      />
      <path
        d="M30 12v62M30 30l-9-7M30 30l9-7M30 44l-12-8M30 44l12-8M30 58l-10-7M30 58l10-7"
        stroke="var(--cream)"
        strokeWidth={1}
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
    </svg>
  );
}

/** Divisor delicado: linha — folha — linha. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-primary/70", className)} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-current" />
      <svg viewBox="0 0 40 16" className="h-3.5 w-9" fill="none" stroke="currentColor" strokeWidth={1.1}>
        <path d="M20 8 C 14 2, 6 2, 1 8 C 6 14, 14 14, 20 8 Z" />
        <path d="M20 8 C 26 2, 34 2, 39 8 C 34 14, 26 14, 20 8 Z" />
        <circle cx={20} cy={8} r={1.6} fill="currentColor" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

/** Monograma B & L em caligrafia. */
export function Monogram({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-script leading-none",
        tone === "dark" ? "border-primary/35 text-primary" : "border-white/40 text-white",
        className,
      )}
      aria-label="Brenda e Luiz"
    >
      <span className="translate-y-[6%]">B</span>
      <span className="mx-[0.06em] font-display text-[0.42em] italic">&amp;</span>
      <span className="translate-y-[6%]">L</span>
    </span>
  );
}
