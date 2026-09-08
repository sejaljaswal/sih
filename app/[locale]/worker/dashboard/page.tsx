import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { formatPaise } from "@/lib/utils";

const WORKER = { name: "रमेश कुमार", role: "बिजली मिस्त्री", memberNo: 1142 };
const TODAY = { earningPaise: 137600, jobsCompleted: 2, welfarePaise: 4800 };
const WEEK = { jobsReceived: 6, societyAverage: 8 };
const INSURANCE = { coveragePaise: 20000000, fundPaise: 146400 };

export default function WorkerDashboardPage() {
  const t = useTranslations("worker.dashboard");

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[19px] leading-tight font-bold">{WORKER.name}</div>
          <div className="text-[12.5px] text-ink-3">
            {WORKER.role} · {t("memberNo", { no: WORKER.memberNo })}
          </div>
        </div>
        <SocietyStamp size="xs" lines={["✓", "SHIMLA", "SOCIETY"]} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-card bg-green-600 p-4">
        <div>
          <div className="text-[17px] font-bold text-white">{t("readyTitle")}</div>
          <div className="mt-0.5 text-[12.5px] text-white/75">{t("readySubtitle")}</div>
        </div>
        <div className="flex h-8 w-14 items-center justify-end rounded-pill bg-white px-1">
          <div className="h-6 w-6 rounded-pill bg-green-600" />
        </div>
      </div>

      <div className="mt-4 rounded-xs border border-ink">
        <div className="bg-ink px-3 py-2 text-[12.5px] font-bold text-white">{t("todaysEarnings")}</div>
        <div className="p-3">
          <div className="num text-[38px] leading-none font-bold">
            {formatPaise(TODAY.earningPaise)}
          </div>
          <div className="mt-1 text-[12.5px] text-ink-3">
            {t("jobsCompleted", { count: TODAY.jobsCompleted })}
          </div>
          <div className="rule-total mt-3 flex items-center justify-between pt-2">
            <span className="text-[12.5px]">{t("welfareToday")}</span>
            <span className="num text-[14px] font-bold text-ochre-700">
              +{formatPaise(TODAY.welfarePaise)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-[13px] font-bold">{t("thisWeek")}</div>
        <div className="divide-y divide-sage-200 rounded-card border border-sage-300">
          <div className="flex items-center px-3 py-2.5">
            <div className="flex-1 text-[13px] font-semibold">{t("jobsReceived")}</div>
            <span className="num text-[15px] font-bold">{WEEK.jobsReceived}</span>
          </div>
          <div className="flex items-center px-3 py-2.5">
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{t("societyAverage")}</div>
              <div className="text-[11px] text-ink-3">{t("societyAverageNote")}</div>
            </div>
            <span className="num text-[15px] font-semibold text-ink-3">{WEEK.societyAverage}</span>
          </div>
          <div className="flex items-center bg-green-50 px-3 py-2.5">
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{t("yourTurnNext")}</div>
              <div className="text-[11px] text-ink-3">{t("yourTurnNextNote")}</div>
            </div>
            <ArrowUp size={17} strokeWidth={2.4} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-card border border-sage-300 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-ochre-100">
          <span className="text-[16px]">🛡️</span>
        </div>
        <div className="flex-1">
          <div className="text-[12.5px] font-bold">{t("insuranceActive")}</div>
          <div className="text-[11px] text-ink-3">
            {t("insuranceScheme", { amount: formatPaise(INSURANCE.coveragePaise) })}
          </div>
        </div>
        <span className="num text-[13px] font-bold">{formatPaise(INSURANCE.fundPaise)}</span>
      </div>
    </div>
  );
}
