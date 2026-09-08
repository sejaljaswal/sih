import { useTranslations } from "next-intl";
import { SplitBar } from "@/components/domain/split-bar";
import { Button } from "@/components/ui/button";
import { cn, formatPaise } from "@/lib/utils";

const RATE_ROWS = [
  { service: "Fan repair", customerPrice: 80000, floorWage: 68800, commissionPct: 10, welfarePct: 3, highlighted: true },
  { service: "Wiring inspection", customerPrice: 60000, floorWage: 51600, commissionPct: 10, welfarePct: 3 },
  { service: "Tap / leak repair", customerPrice: 45000, floorWage: 38700, commissionPct: 10, welfarePct: 3 },
  { service: "Elder care visit", customerPrice: 50000, floorWage: 44000, commissionPct: 8, welfarePct: 4 },
  { service: "Deep cleaning", customerPrice: 120000, floorWage: 103200, commissionPct: 10, welfarePct: 3 },
];

const PREVIEW = { total: 80000, worker: 68800, society: 8000, welfare: 2400, platform: 800 };

export default function SocietyRatesPage() {
  const t = useTranslations("society.rates");

  return (
    <div className="p-6">
      <div className="mb-1 flex items-baseline justify-between">
        <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading", { society: "Shimla" })}</h1>
        <span className="text-[12px] text-ink-3">{t("floorWageRule")}</span>
      </div>
      <p className="mb-5 text-[13px] text-ink-3">{t("helperNote")}</p>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div className="overflow-hidden rounded-xs border border-sage-300">
          <table className="w-full text-[13px]">
            <thead className="bg-sage-100 text-[12px] text-ink-3">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">{t("service")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("customerPays")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("floorWage")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("commission")}</th>
                <th className="px-3 py-2 text-right font-semibold">{t("welfare")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200">
              {RATE_ROWS.map((row) => (
                <tr key={row.service} className={cn(row.highlighted && "bg-green-50")}>
                  <td className="px-3 py-2.5 font-semibold">{row.service}</td>
                  <td className="px-3 py-2.5 text-right">
                    {row.highlighted ? (
                      <span className="num inline-block rounded-xs border-2 border-green-600 px-2 py-0.5 font-bold">
                        {formatPaise(row.customerPrice)}
                      </span>
                    ) : (
                      <span className="num">{formatPaise(row.customerPrice)}</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {row.highlighted ? (
                      <span className="num inline-block rounded-xs border-2 border-green-600 px-2 py-0.5 font-bold">
                        {formatPaise(row.floorWage)}
                      </span>
                    ) : (
                      <span className="num">{formatPaise(row.floorWage)}</span>
                    )}
                  </td>
                  <td className="num px-3 py-2.5 text-right">{row.commissionPct}%</td>
                  <td className="num px-3 py-2.5 text-right">{row.welfarePct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="overflow-hidden rounded-xs border border-ink">
            <div className="bg-ink px-3 py-2 text-[12px] font-bold text-white">{t("previewHeading")}</div>
            <div className="p-3">
              <SplitBar
                totalLabel={t("customerPays")}
                totalPaise={PREVIEW.total}
                segments={[
                  { key: "worker", label: t("worker"), amountPaise: PREVIEW.worker, color: "#17624A" },
                  { key: "society", label: t("society"), amountPaise: PREVIEW.society, color: "#3E7C9A" },
                  { key: "welfare", label: t("welfareFund"), amountPaise: PREVIEW.welfare, color: "#C87F1B" },
                  { key: "platform", label: t("platform"), amountPaise: PREVIEW.platform, color: "#A8ADA3", muted: true },
                ]}
              />
            </div>
          </div>

          <div className="mt-3 rounded-xs border border-green-200 bg-green-50 p-3 text-[12.5px] leading-relaxed">
            {t("workerKeepsNote", { pct: "86%" })}
          </div>

          <Button className="mt-3 w-full">{t("save")}</Button>
        </div>
      </div>
    </div>
  );
}
