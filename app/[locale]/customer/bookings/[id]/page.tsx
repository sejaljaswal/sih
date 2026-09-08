import { useTranslations } from "next-intl";
import { Check, Phone, MessageSquare } from "lucide-react";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { SplitBar } from "@/components/domain/split-bar";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/utils";

const WORKER = { name: "रमेश कुमार", role: "बिजली मिस्त्री", years: 15, rating: 4.8, jobsCompleted: 214 };
const AMOUNTS = { total: 80000, worker: 68800, society: 8000, welfare: 2400, platform: 800 };

function AssignedView() {
  const t = useTranslations("customer.assigned");
  const steps = [
    { key: "accepted", label: t("statusAccepted"), time: "9:43 AM", done: true },
    { key: "onTheWay", label: t("statusOnTheWay"), time: t("now"), done: false, active: true },
    { key: "started", label: t("statusStarted"), done: false },
    { key: "completed", label: t("statusCompleted"), done: false },
  ];

  return (
    <div className="pb-6">
      <div className="bg-green-600 px-4 pt-4 pb-5 text-white">
        <div className="text-[13px] opacity-85">{t("acceptedIn", { seconds: 22 })}</div>
        <div className="mt-1 text-[21px] leading-tight font-bold">
          {t("onTheWay", { name: WORKER.name })}
        </div>
      </div>

      <div className="-mt-3 px-4">
        <div className="rounded-card border border-sage-300 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card bg-sage-200 text-[22px] font-bold">
              रा
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="text-[17px] leading-tight font-bold">{WORKER.name}</div>
              <div className="mt-0.5 text-[12.5px] text-ink-3">
                {t("experience", { role: WORKER.role, years: WORKER.years })}
              </div>
              <div className="num mt-1.5 text-[12.5px]">
                ★ {WORKER.rating} <span className="text-ink-3">· {t("jobsCompleted", { count: WORKER.jobsCompleted })}</span>
              </div>
            </div>
            <SocietyStamp
              size="sm"
              className="-mt-1 shrink-0"
              lines={["✓ सत्यापित", "SHIMLA LABOUR", "COOP SOCIETY", "REG 1987"]}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-sage-200 pt-3 text-center">
            <div>
              <div className="num text-[15px] font-bold">2.3</div>
              <div className="text-[10.5px] text-ink-3">{t("distanceAway")}</div>
            </div>
            <div>
              <div className="num text-[15px] font-bold">9 मिनट</div>
              <div className="text-[10.5px] text-ink-3">{t("arrivingIn")}</div>
            </div>
            <div>
              <div className="num text-[15px] font-bold">{formatPaise(AMOUNTS.total)}</div>
              <div className="text-[10.5px] text-ink-3">{t("estimated")}</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-green-600 text-green-600">
              <Phone size={14} /> {t("call")}
            </Button>
            <Button variant="outline">
              <MessageSquare size={14} /> {t("message")}
            </Button>
          </div>
        </div>

        <div className="mt-3 rounded-card border border-ochre-300 bg-ochre-50 p-3">
          <div className="text-[12px] font-semibold text-ochre-700">{t("startCodeLabel")}</div>
          <div className="mt-2 flex gap-2">
            {["4", "1", "7", "2"].map((d, i) => (
              <div
                key={i}
                className="num flex h-11 flex-1 items-center justify-center rounded-xs border-2 border-ochre-500 text-[22px] font-bold"
              >
                {d}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] leading-snug text-ink-3">
            {t("startCodeNote", { name: WORKER.name })}
          </p>
        </div>

        <div className="mt-3">
          <div className="mb-2 text-[12.5px] font-bold">{t("statusHeading")}</div>
          {steps.map((s, i) => (
            <div key={s.key} className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    s.done ? "bg-green-600" : s.active ? "border-2 border-green-600 bg-white" : "border-2 border-sage-300 bg-white"
                  }`}
                >
                  {s.done && <Check size={9} strokeWidth={4} className="text-white" />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 flex-1 ${s.done ? "bg-green-600" : "bg-sage-300"}`} />
                )}
              </div>
              <div className="pb-3">
                <div className={`text-[12.5px] ${s.done || s.active ? "font-semibold" : "text-ink-4"}`}>
                  {s.label}
                </div>
                {s.time && <div className="num text-[11px] text-ink-3">{s.time}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaidView() {
  const t = useTranslations("customer.paid");
  const tCommon = useTranslations("customer.serviceDetail");

  return (
    <div className="pb-6">
      <div className="px-4 pt-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-green-600">
          <Check size={24} strokeWidth={3} className="text-white" />
        </div>
        <div className="mt-3 text-[19px] font-bold">{t("paidHeading")}</div>
        <div className="mt-0.5 text-[13px] text-ink-3">{t("paidVia", { name: WORKER.name })}</div>
      </div>

      <div className="mx-4 mt-5 overflow-hidden rounded-xs border border-ink">
        <div className="flex items-center justify-between bg-ink px-3 py-2 text-white">
          <span className="num text-[11px] font-bold">SHY/2026-27/000418</span>
          <span className="num text-[11px] opacity-70">2 सित 2026</span>
        </div>
        <div className="p-3">
          <div className="ledger">
            <div className="flex items-center" style={{ height: 28 }}>
              <span className="flex-1 text-[12.5px]">पंखा मरम्मत</span>
              <span className="num text-[12.5px]">{formatPaise(60000)}</span>
            </div>
            <div className="flex items-center" style={{ height: 28 }}>
              <span className="flex-1 text-[12.5px]">{t("materials", { item: "कैपेसिटर" })}</span>
              <span className="num text-[12.5px]">{formatPaise(20000)}</span>
            </div>
          </div>
          <div className="rule-total mt-1 flex items-center justify-between pt-1.5">
            <span className="text-[13px] font-bold">{t("totalPaid")}</span>
            <span className="num text-[18px] font-bold">{formatPaise(AMOUNTS.total)}</span>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-[12px] font-bold">{t("moneyWentHeading")}</div>
            <SplitBar
              totalLabel={t("totalPaid")}
              totalPaise={AMOUNTS.total}
              segments={[
                { key: "worker", label: WORKER.name, subLabel: t("wageLabel"), amountPaise: AMOUNTS.worker, color: "#17624A" },
                {
                  key: "society",
                  label: "शिमला श्रमिक सहकारी समिति",
                  subLabel: t("commissionLabel", { pct: "10%" }),
                  amountPaise: AMOUNTS.society,
                  color: "#3E7C9A",
                },
                {
                  key: "welfare",
                  label: tCommon("welfare"),
                  subLabel: t("welfareLabel", { pct: "3%" }),
                  amountPaise: AMOUNTS.welfare,
                  color: "#C87F1B",
                },
                { key: "platform", label: tCommon("platform"), amountPaise: AMOUNTS.platform, color: "#A8ADA3", muted: true },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mx-4 mt-3 rounded-card border border-green-200 bg-green-50 px-3 py-2.5">
        <p className="text-[12px] leading-snug">
          {t("summaryNote", {
            societyAmount: formatPaise(AMOUNTS.society),
            welfareAmount: formatPaise(AMOUNTS.welfare),
            name: WORKER.name,
            welfareTotal: formatPaise(146400),
          })}
        </p>
      </div>

      <div className="mx-4 mt-4 flex gap-2">
        <Button variant="outline" className="flex-1">
          {t("receipt")}
        </Button>
        <Button className="flex-1">{t("rate")}</Button>
      </div>
    </div>
  );
}

export default async function BookingDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string }>;
}) {
  const { paid } = await searchParams;
  return paid ? <PaidView /> : <AssignedView />;
}
