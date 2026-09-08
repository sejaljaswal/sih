import { useTranslations } from "next-intl";
import { ScoreBreakdown } from "@/components/domain/score-breakdown";
import { formatPaise } from "@/lib/utils";

const STAFFING_GAP = [
  { service: "Plumbing", forecast: 42, needed: 7, available: 4, gap: -3 },
  { service: "Elder care", forecast: 18, needed: 4, available: 1, gap: -3 },
  { service: "Deep cleaning", forecast: 26, needed: 5, available: 5, gap: 0 },
  { service: "Electrical", forecast: 31, needed: 5, available: 9, gap: 4 },
];

const TRAIN_NEXT = [
  { skill: "Elder care", where: "Shimla, Solan", pct: 100, note: "Highest unmet demand and the highest value per job. 17 requests went unfilled last month." },
  { skill: "Plumbing", where: "Shimla", pct: 74, note: "Steady shortfall through the monsoon months." },
  { skill: "Inverter installation", where: "Federation-wide", pct: 52, note: "An upskill for the 9 surplus electricians rather than new recruitment." },
];

const SCORE_ROWS = [
  { workerId: "ramesh", name: "Ramesh Kumar", badge: "accepted", proximity: 0.847, skill: 0.86, fairness: 0.75, quality: 0.96, reliability: 0.94, score: 0.867, accepted: true },
  { workerId: "sunita", name: "Sunita Devi", proximity: 0.793, skill: 0.72, fairness: 0.25, quality: 0.92, reliability: 0.98, score: 0.763 },
  { workerId: "deepak", name: "Deepak Thakur", proximity: 0.64, skill: 0.94, fairness: 0.125, quality: 0.98, reliability: 0.9, score: 0.679 },
  { workerId: "kailash", name: "Kailash Negi", badge: "new member", proximity: 0.512, skill: 0.6, fairness: 1.0, quality: 0.7, reliability: 1.0, score: 0.637 },
];

export default function FederationInsightsPage() {
  const t = useTranslations("federation.insights");
  const tScore = useTranslations("federation.scoreBreakdown");

  return (
    <div className="p-6">
      <div className="flex items-baseline justify-between border-b border-sage-200 pb-4">
        <div>
          <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">
            {t("subtitle", { federation: "Himachal Pradesh Labour Cooperative Federation", count: 25 })}
          </p>
        </div>
        <div className="num text-[12px] text-ink-3">
          {t("modelInfo", { version: "hw-v3", date: "2 Sep", mape: "11.4%" })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[1fr_340px] gap-6">
        <div>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-[14px] font-bold">{t("forecastHeading")}</h2>
            <div className="flex items-center gap-3 text-[11.5px] text-ink-3">
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 bg-ink" />
                {t("legendActual")}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-0.5 w-3 bg-green-600" />
                {t("legendForecast")}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 bg-green-100" />
                {t("legendRange")}
              </span>
            </div>
          </div>

          <svg viewBox="0 0 640 220" className="w-full" style={{ height: 220 }}>
            <defs>
              <pattern id="grid" width="64" height="44" patternUnits="userSpaceOnUse">
                <path d="M64 0 L0 0 0 44" fill="none" stroke="#DADFD4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="34" y="6" width="596" height="176" fill="url(#grid)" />
            <line x1="34" y1="182" x2="630" y2="182" stroke="#14211B" strokeWidth="1.5" />
            <line x1="34" y1="6" x2="34" y2="182" stroke="#14211B" strokeWidth="1.5" />
            <text x="28" y="186" textAnchor="end" fontSize="10" fill="#5E6B62">0</text>
            <text x="28" y="142" textAnchor="end" fontSize="10" fill="#5E6B62">15</text>
            <text x="28" y="98" textAnchor="end" fontSize="10" fill="#5E6B62">30</text>
            <text x="28" y="54" textAnchor="end" fontSize="10" fill="#5E6B62">45</text>
            <text x="28" y="14" textAnchor="end" fontSize="10" fill="#5E6B62">60</text>
            <path
              d="M354 118 L400 96 L446 88 L492 74 L538 52 L584 66 L630 84 L630 128 L584 108 L538 96 L492 116 L446 128 L400 134 L354 146 Z"
              fill="#D6E7DE"
            />
            <polyline
              points="34,150 80,138 126,144 172,120 218,108 264,126 310,132 354,132"
              fill="none"
              stroke="#14211B"
              strokeWidth="2"
            />
            <polyline
              points="354,132 400,115 446,108 492,95 538,74 584,87 630,106"
              fill="none"
              stroke="#17624A"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            <line x1="354" y1="6" x2="354" y2="182" stroke="#C87F1B" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="358" y="18" fontSize="10" fontWeight="700" fill="#965C10">{t("today")}</text>
            <circle cx="538" cy="74" r="4" fill="#17624A" />
            <text x="538" y="62" textAnchor="middle" fontSize="11" fontWeight="700" fill="#17624A">54</text>
            <text x="34" y="200" fontSize="10" fill="#5E6B62" textAnchor="middle">Aug 27</text>
            <text x="172" y="200" fontSize="10" fill="#5E6B62" textAnchor="middle">Aug 30</text>
            <text x="310" y="200" fontSize="10" fill="#5E6B62" textAnchor="middle">Sep 2</text>
            <text x="446" y="200" fontSize="10" fill="#5E6B62" textAnchor="middle">Sep 5</text>
            <text x="584" y="200" fontSize="10" fill="#5E6B62" textAnchor="middle">Sep 8</text>
          </svg>

          <h2 className="mt-6 mb-2 text-[14px] font-bold">
            {t("staffingGapHeading", { society: "Shimla" })}
          </h2>
          <div className="overflow-hidden rounded-xs border border-sage-300">
            <table className="w-full text-[13px]">
              <thead className="bg-sage-100 text-left text-[12px] text-ink-3">
                <tr>
                  <th className="px-3 py-2 font-semibold">{t("service")}</th>
                  <th className="px-3 py-2 text-right font-semibold">{t("forecastJobs")}</th>
                  <th className="px-3 py-2 text-right font-semibold">{t("workersNeeded")}</th>
                  <th className="px-3 py-2 text-right font-semibold">{t("available")}</th>
                  <th className="px-3 py-2 text-right font-semibold">{t("gap")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-200">
                {STAFFING_GAP.map((row) => (
                  <tr key={row.service} className={row.gap < 0 ? "bg-brick-100/45" : undefined}>
                    <td className="px-3 py-2.5 font-semibold">{row.service}</td>
                    <td className="num px-3 py-2.5 text-right">{row.forecast}</td>
                    <td className="num px-3 py-2.5 text-right">{row.needed}</td>
                    <td className="num px-3 py-2.5 text-right">{row.available}</td>
                    <td
                      className={`num px-3 py-2.5 text-right font-bold ${
                        row.gap < 0 ? "text-brick-700" : row.gap > 0 ? "text-green-600" : "text-ink-3"
                      }`}
                    >
                      {row.gap > 0 ? `+${row.gap}` : row.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-xs border border-ink">
            <div className="bg-ink px-3 py-2 text-[12px] font-bold text-white">{t("trainNextHeading")}</div>
            <div className="space-y-3 p-3">
              {TRAIN_NEXT.map((item) => (
                <div key={item.skill}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13.5px] font-bold">{item.skill}</span>
                    <span className="num text-[12px] text-ink-3">{item.where}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-sage-200">
                    <div className="h-full bg-ochre-500" style={{ width: `${item.pct}%` }} />
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-snug text-ink-3">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 divide-y divide-sage-200 rounded-xs border border-sage-300">
            <div className="flex items-baseline justify-between px-3 py-2.5">
              <span className="text-[12.5px]">{t("welfarePool")}</span>
              <span className="num text-[15px] font-bold">{formatPaise(24188000)}</span>
            </div>
            <div className="flex items-baseline justify-between px-3 py-2.5">
              <span className="text-[12.5px]">{t("activeCoverage")}</span>
              <span className="num text-[15px] font-bold">94%</span>
            </div>
            <div className="flex items-baseline justify-between px-3 py-2.5">
              <span className="text-[12.5px]">{t("medianJobs")}</span>
              <span className="num text-[15px] font-bold">7.4</span>
            </div>
            <div className="flex items-baseline justify-between px-3 py-2.5">
              <span className="text-[12.5px]">{t("jobDistribution")}</span>
              <span className="num text-[15px] font-bold text-green-600">0.24</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-ink-4">{t("giniNote")}</p>
        </div>
      </div>

      <div className="mt-12 border-t border-sage-200 pt-8">
        <div className="mb-1 flex items-baseline justify-between">
          <h2 className="text-[19px] font-bold tracking-[-0.01em]">
            {tScore("heading", { code: "SHY-2026-000418" })}
          </h2>
          <span className="num text-[12px] text-ink-3">
            {tScore("meta", { dispatched: "09:43:02", accepted: "09:43:24" })}
          </span>
        </div>
        <p className="mb-5 max-w-[70ch] text-[13px] text-ink-3">
          {tScore("intro", { name: "Ramesh" })}
        </p>

        <div className="grid grid-cols-[1fr_300px] gap-6">
          <ScoreBreakdown
            rows={SCORE_ROWS.map((r) => ({
              ...r,
              badge: r.badge === "accepted" ? tScore("accepted") : r.badge === "new member" ? tScore("newMember") : undefined,
            }))}
            weights={{ proximity: 0.6, skill: 0.1, fairness: 0.1, quality: 0.1, reliability: 0.1 }}
            labels={{
              member: tScore("member"),
              proximity: tScore("proximity"),
              skill: tScore("skill"),
              fairness: tScore("fairness"),
              quality: tScore("quality"),
              reliability: tScore("reliability"),
              score: tScore("score"),
            }}
          />

          <div>
            <div className="rounded-xs border border-ochre-300 bg-ochre-50 p-4">
              <div className="mb-2 text-[13px] font-bold">{tScore("readColumnHeading")}</div>
              <p className="text-[12.5px] leading-relaxed text-ink-2">{tScore("readColumnBody1")}</p>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">{tScore("readColumnBody2")}</p>
            </div>
            <div className="mt-4 rounded-xs border border-sage-300 p-4">
              <div className="mb-1.5 text-[13px] font-bold">{tScore("weightingHeading")}</div>
              <p className="text-[12.5px] leading-relaxed text-ink-3">{tScore("weightingBody")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
