"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn, formatPaise } from "@/lib/utils";

const JOBS = [
  {
    id: "1",
    name: "पंखा मरम्मत",
    amountPaise: 68800,
    date: "2 सित · 11:07",
    split: { worker: 86, society: 10, welfare: 3, platform: 1 },
    breakdown: { society: 8000, welfare: 2400, platform: 800 },
  },
  { id: "2", name: "स्विच बदलना", amountPaise: 68800, date: "2 सित · 15:20" },
  { id: "3", name: "वायरिंग जाँच", amountPaise: 51600, date: "4 सित · 10:15" },
];

const RANGES = ["week", "month", "all"] as const;

export default function WorkerEarningsPage() {
  const t = useTranslations("worker.earnings");
  const [range, setRange] = useState<(typeof RANGES)[number]>("week");

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="text-[19px] font-bold">{t("heading")}</div>

      <div className="mt-3 flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "flex-1 rounded-pill py-1.5 text-[12.5px]",
              range === r ? "bg-ink font-bold text-white" : "border border-sage-300 text-ink-3",
            )}
          >
            {t(r === "week" ? "thisWeek" : r === "month" ? "thisMonth" : "all")}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xs border border-ink p-3">
        <div className="num text-[40px] leading-none font-bold">{formatPaise(189200)}</div>
        <div className="mt-1 text-[12.5px] text-ink-3">{t("jobsInRange", { count: 3, range: "2–8 सितंबर" })}</div>
      </div>

      <div className="mt-4 mb-2 text-[13px] font-bold">{t("jobBreakdownHeading")}</div>
      <div className="overflow-hidden rounded-card border border-sage-300">
        {JOBS.map((job, i) => (
          <div key={job.id} className={cn("px-3 py-2.5", i < JOBS.length - 1 && "border-b border-sage-200")}>
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-semibold">{job.name}</span>
              <span className="num text-[15px] font-bold">{formatPaise(job.amountPaise)}</span>
            </div>
            <div className="mt-0.5 flex items-baseline justify-between">
              <span className="num text-[11px] text-ink-3">{job.date}</span>
              {job.breakdown && (
                <span className="num text-[11px] text-ink-3">
                  {t("customerPaid", { amount: formatPaise(80000) })}
                </span>
              )}
            </div>
            {job.split && (
              <>
                <div className="split mt-2" style={{ height: 8, borderWidth: 0 }}>
                  <div style={{ width: `${job.split.worker}%`, background: "#17624A" }} />
                  <div style={{ width: `${job.split.society}%`, background: "#3E7C9A" }} />
                  <div style={{ width: `${job.split.welfare}%`, background: "#C87F1B" }} />
                  <div style={{ width: `${job.split.platform}%`, background: "#A8ADA3" }} />
                </div>
                <div className="num mt-1.5 flex gap-3 text-[10.5px] text-ink-3">
                  <span>{t("societyShort", { amount: formatPaise(job.breakdown.society) })}</span>
                  <span>{t("welfareShort", { amount: formatPaise(job.breakdown.welfare) })}</span>
                  <span>{t("platformShort", { amount: formatPaise(job.breakdown.platform) })}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-card border border-ochre-300 bg-ochre-50 p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-bold">{t("welfareFundHeading")}</span>
          <span className="num text-[19px] font-bold text-ochre-700">{formatPaise(146400)}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-pill border border-ochre-300 bg-white">
          <div className="h-full bg-ochre-500" style={{ width: "73%" }} />
        </div>
        <p className="mt-2 text-[11.5px] leading-snug text-ink-3">{t("welfareFundNote")}</p>
      </div>
    </div>
  );
}
