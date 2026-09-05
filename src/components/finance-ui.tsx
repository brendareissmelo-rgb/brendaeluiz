import type { ReactNode } from "react";
import { Gift, User, Users } from "lucide-react";
import type { Expense, Owner } from "@/lib/expenses";

export const ownerOf = (e: Expense): Owner =>
  (((e as any).owner as Owner) ?? "Ambos");

export const OWNER_STYLES: Record<Owner, { text: string; bg: string; border: string; dot: string; stroke: string }> = {
  Luiz: { text: "text-sky-700", bg: "bg-sky-500/10", border: "border-sky-500/30", dot: "bg-sky-600", stroke: "#0284c7" },
  Brenda: { text: "text-pink-700", bg: "bg-pink-500/10", border: "border-pink-500/30", dot: "bg-pink-600", stroke: "#db2777" },
  Ambos: { text: "text-muted-foreground", bg: "bg-muted/40", border: "border-border", dot: "bg-muted-foreground", stroke: "#8b8b9a" },
  Presente: { text: "text-amber-700", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-600", stroke: "#d97706" },
};

export function OwnerTag({ owner, className = "" }: { owner: Owner; className?: string }) {
  const s = OWNER_STYLES[owner];
  const Icon = owner === "Presente" ? Gift : owner === "Ambos" ? Users : User;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${s.bg} ${s.text} ${s.border} ${className}`}
    >
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {owner}
    </span>
  );
}

export function StatusBadge({ status }: { status: Expense["status"] }) {
  const map = {
    paid: { label: "Pago", cls: "bg-success/12 text-success border-success/25" },
    installment: { label: "Parcelado", cls: "bg-primary/12 text-primary border-primary/25" },
    pending: { label: "A pagar", cls: "bg-warning/12 text-warning border-warning/25" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  );
}

type Segment = { value: number; color: string };

export function DonutRing({
  segments,
  size = 132,
  thickness = 11,
  children,
}: {
  segments: Segment[];
  size?: number;
  thickness?: number;
  children?: ReactNode;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + Math.max(x.value, 0), 0);
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-muted/60"
          strokeWidth={thickness}
        />
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
}: {
  segments: Segment[];
  height?: number;
}) {
  const total = segments.reduce((s, x) => s + Math.max(x.value, 0), 0) || 1;
  return (
    <div className="flex w-full overflow-hidden rounded-full bg-muted/60" style={{ height }}>
      {segments.map((s, i) => (
        <div
          key={i}
          style={{ width: `${(Math.max(s.value, 0) / total) * 100}%`, background: s.color, transition: "width .5s ease" }}
        />
      ))}
    </div>
  );
}
