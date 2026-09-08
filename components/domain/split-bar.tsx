import { cn } from "@/lib/utils";
import { formatPaise } from "@/lib/utils";

export type SplitSegment = {
  key: string;
  label: string;
  subLabel?: string;
  amountPaise: number;
  color: string;
  /** Muted legend row (DESIGN.md: platform fee is "deliberately drab"). */
  muted?: boolean;
};

/**
 * DESIGN.md: "The product's signature. A horizontal stacked bar, never a pie
 * or donut." Segment widths are proportional with a floor so small slices
 * never vanish; amounts print inside a segment only above 8% width,
 * otherwise they live in the legend only.
 */
export function SplitBar({
  segments,
  totalPaise,
  totalLabel,
  note,
  locale,
  className,
}: {
  segments: SplitSegment[];
  totalPaise: number;
  totalLabel: string;
  note?: string;
  locale?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="split">
        {segments.map((s) => {
          const pct = totalPaise > 0 ? (s.amountPaise / totalPaise) * 100 : 0;
          return (
            <div
              key={s.key}
              style={{ width: `${pct}%`, minWidth: pct > 0 ? "2px" : 0, background: s.color }}
            >
              {pct >= 8 ? formatPaise(s.amountPaise, locale) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-3 space-y-1.5">
        {segments.map((s) => (
          <div key={s.key} className={cn("flex items-start gap-2", s.muted && "text-ink-3")}>
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: s.color }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">{s.label}</div>
              {s.subLabel && <div className="text-[11px] text-ink-3">{s.subLabel}</div>}
            </div>
            <span className="num text-[13px] font-bold">{formatPaise(s.amountPaise, locale)}</span>
          </div>
        ))}
      </div>

      <div className="rule-total mt-3 flex items-center justify-between pt-1.5">
        <span className="text-[13px] font-bold">{totalLabel}</span>
        <span className="num text-[17px] font-bold">{formatPaise(totalPaise, locale)}</span>
      </div>

      {note && <p className="mt-2.5 text-[11.5px] leading-snug text-ink-3">{note}</p>}
    </div>
  );
}
