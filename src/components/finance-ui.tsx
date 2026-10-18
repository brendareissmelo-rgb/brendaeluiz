import type { ReactNode } from "react";
import { Gift, User, Users } from "lucide-react";
import type { Expense, Owner } from "@/lib/expenses";

export const ownerOf = (e: Expense): Owner =>
  (((e as any).owner as Owner) ?? "Ambos");

/** Cores dos gráficos: pago (sálvia), caixinha (azul acinzentado), a pagar (caramelo). */
export const FIN_COLORS = {
  paid: "#6f8a5c",
  reserved: "#7d97ad",
  remaining: "#c8894a",
} as const;

export const OWNER_STYLES: Record<Owner, { text: string; bg: string; border: string; dot: string; stroke: string }> = {
  Luiz: { text: "text-[#4f6f8a]", bg: "bg-[#7d97ad]/12", border: "border-[#7d97ad]/35", dot: "bg-[#5d7d98]", stroke: "#5d7d98" },
  Brenda: { text: "text-[#a2556a]", bg: "bg-[#d48a9c]/14", border: "border-[#d48a9c]/40", dot: "bg-[#c06b82]", stroke: "#c06b82" },
  Ambos: { text: "text-muted-foreground", bg: "bg-muted/70", border: "border-border", dot: "bg-muted-foreground", stroke: "#9a8778" },
  Presente: { text: "text-[#9a6a2c]", bg: "bg-[#d9a54a]/14", border: "border-[#d9a54a]/40", dot: "bg-[#c99236]", stroke: "#c99236" },
};

export function OwnerTag({ owner, className = "" }: { owner: Owner; className?: string }) {
  const s = OWNER_STYLES[owner];
  const Icon = owner === "Presente" ? Gift : owner === "Ambos" ? Users : User;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {owner}
    </span>
  );
}

export function StatusBadge({ status }: { status: Expense["status"] }) {
  const map = {
    paid: { label: "Pago", cls: "bg-success/12 text-success border-success/25" },
    installment: { label: "Parcelado", cls: "bg-primary/10 text-primary border-primary/25" },
    pending: { label: "A pagar", cls: "bg-warning/12 text-warning border-warning/25" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] ${s.cls}`}>
      {s.label}
    </span>
  );
}

type Segment = { value: number; color: string };

export function DonutRing({
  segments,
  size = 132,
  thickness = 11,
  track = "var(--color-muted)",
  children,
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  /** Cor do anel de fundo. */
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + Math.max(x.value, 0), 0);
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={thickness} />
        {total > 0 &&
          segments.map((s, i) => {
            const frac = Math.max(s.value, 0) / total;
            const len = frac * c;
            const el = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
                strokeDashoffset={-offset}
                style={{ transition: "stroke-dasharray .6s ease, stroke-dashoffset .6s ease" }}
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
      )}
    </div>
  );
}

export function Meter({
  segments,
  height = 8,
  track = "var(--color-muted)",
}: {
  segments: Segment[];
  height?: number;
  track?: string;
}) {
  const total = segments.reduce((s, x) => s + Math.max(x.value, 0), 0) || 1;
  return (
    <div className="flex w-full gap-[2px] overflow-hidden rounded-full" style={{ height, background: track }}>
      {segments.map((s, i) =>
        s.value > 0 ? (
          <div
            key={i}
            className="first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(Math.max(s.value, 0) / total) * 100}%`, background: s.color, transition: "width .5s ease" }}
          />
        ) : null,
      )}
    </div>
  );
}

/** Legenda com bolinha colorida. */
export function LegendDot({ color, label, value, light }: { color: string; label: string; value: string; light?: boolean }) {
  return (
    <div className="min-w-0">
      <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] ${light ? "text-cream/70" : "text-muted-foreground"}`}>
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
        {label}
      </div>
      <div className={`mt-1 truncate text-[13px] font-semibold tabular-nums sm:text-[15px] ${light ? "text-cream" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
