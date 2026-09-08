import { cn } from "@/lib/utils";

export type ScoreBreakdownRow = {
  workerId: string;
  name: string;
  badge?: string;
  proximity: number;
  skill: number;
  fairness: number;
  quality: number;
  reliability: number;
  score: number;
  accepted?: boolean;
};

/**
 * The audit table behind every match (ARCHITECTURE-V2 §4's score_breakdown
 * JSONB, rendered). Weights sit in the column headers, the fairness column
 * is emphasised, and the accepted row is tinted. CLAUDE.md rule #9: a match
 * we cannot explain is worthless — this is that explanation.
 */
export function ScoreBreakdown({
  rows,
  weights,
  labels,
  className,
}: {
  rows: ScoreBreakdownRow[];
  weights: { proximity: number; skill: number; fairness: number; quality: number; reliability: number };
  labels: {
    member: string;
    proximity: string;
    skill: string;
    fairness: string;
    quality: string;
    reliability: string;
    score: string;
  };
  className?: string;
}) {
  const pct = (n: number) => `×${n.toFixed(2)}`;

  return (
    <div className={cn("overflow-hidden rounded-xs border border-sage-300", className)}>
      <table className="w-full text-[13px]">
        <thead className="bg-sage-100 text-left text-[12px] text-ink-3">
          <tr>
            <th className="px-3 py-2 font-semibold">{labels.member}</th>
            <th className="px-3 py-2 text-right font-semibold">
              {labels.proximity}
              <br />
              <span className="num font-normal">{pct(weights.proximity)}</span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">
              {labels.skill}
              <br />
              <span className="num font-normal">{pct(weights.skill)}</span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">
              {labels.fairness}
              <br />
              <span className="num font-normal">{pct(weights.fairness)}</span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">
              {labels.quality}
              <br />
              <span className="num font-normal">{pct(weights.quality)}</span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">
              {labels.reliability}
              <br />
              <span className="num font-normal">{pct(weights.reliability)}</span>
            </th>
            <th className="px-3 py-2 text-right font-semibold">{labels.score}</th>
          </tr>
        </thead>
        <tbody className="num divide-y divide-sage-200">
          {rows.map((row) => (
            <tr key={row.workerId} className={cn(row.accepted && "bg-green-50", !row.accepted && row.badge && "text-ink-3")}>
              <td className="px-3 py-2.5 font-semibold text-ink">
                {row.name}
                {row.badge && (
                  <span
                    className={cn(
                      "ml-2 text-[11px] font-bold",
                      row.accepted ? "text-green-600" : "text-ink-3 font-normal",
                    )}
                  >
                    {row.badge}
                  </span>
                )}
              </td>
              <td className="px-3 py-2.5 text-right">{row.proximity.toFixed(3)}</td>
              <td className="px-3 py-2.5 text-right">{row.skill.toFixed(3)}</td>
              <td className="px-3 py-2.5 text-right font-bold text-ochre-700">
                {row.fairness.toFixed(3)}
              </td>
              <td className="px-3 py-2.5 text-right">{row.quality.toFixed(3)}</td>
              <td className="px-3 py-2.5 text-right">{row.reliability.toFixed(3)}</td>
              <td className="px-3 py-2.5 text-right font-bold text-ink">{row.score.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
