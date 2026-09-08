import { useTranslations } from "next-intl";
import { ChevronLeft, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SplitBar } from "@/components/domain/split-bar";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/utils";

// Demo rate-card snapshot — real data comes from society_service_rates once
// the booking flow is wired up (ARCHITECTURE-V2 §4, CLAUDE.md rule #5).
const DEMO_RATE = { customer: 80000, worker: 68800, society: 8000, welfare: 2400, platform: 800 };

const DEMO_WORKERS = [
  { id: "ramesh", name: "रमेश कुमार", initial: "रा", rating: 4.8, distanceKm: 2.3, years: 15 },
  { id: "sunita", name: "सुनीता देवी", initial: "सु", rating: 4.6, distanceKm: 3.1, years: 8 },
];

export default function ServiceDetailPage() {
  const t = useTranslations("customer.serviceDetail");

  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 border-b border-sage-200 px-4 py-3">
        <Link href="/customer/home" aria-label={t("back")}>
          <ChevronLeft size={18} strokeWidth={2.4} />
        </Link>
        <span className="text-[15px] font-bold">पंखा मरम्मत</span>
      </div>

      <div className="px-4 pt-3">
        <p className="text-[13px] leading-relaxed text-ink-3">{t("durationNote")}</p>

        <div className="mt-4 overflow-hidden rounded-xs border border-ink">
          <div className="flex items-center justify-between bg-ink px-3 py-2 text-white">
            <span className="text-[12.5px] font-bold">
              {t("splitTitle", { amount: formatPaise(DEMO_RATE.customer) })}
            </span>
            <span className="text-[10px] font-semibold opacity-70">{t("rateCardBadge")}</span>
          </div>
          <div className="p-3">
            <SplitBar
              totalLabel={t("total")}
              totalPaise={DEMO_RATE.customer}
              note={t("splitNote", { amount: formatPaise(DEMO_RATE.society) })}
              segments={[
                { key: "worker", label: t("worker"), amountPaise: DEMO_RATE.worker, color: "#17624A" },
                { key: "society", label: t("society"), amountPaise: DEMO_RATE.society, color: "#3E7C9A" },
                { key: "welfare", label: t("welfare"), amountPaise: DEMO_RATE.welfare, color: "#C87F1B" },
                {
                  key: "platform",
                  label: t("platform"),
                  amountPaise: DEMO_RATE.platform,
                  color: "#A8ADA3",
                  muted: true,
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[13px] font-bold">{t("availableNow")}</div>
          <div className="space-y-2">
            {DEMO_WORKERS.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-card border border-sage-300 p-2.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill bg-sage-200 text-[15px] font-bold">
                  {w.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] leading-tight font-bold">{w.name}</div>
                  <div className="num flex items-center gap-1 text-[11.5px] text-ink-3">
                    <Star size={11} className="fill-ochre-500 text-ochre-500" /> {w.rating} · {w.distanceKm} km ·{" "}
                    {t("yearsExperience", { years: w.years })}
                  </div>
                </div>
                <SocietyStamp size="xs" lines={["✓", "SHIMLA", "SOCIETY"]} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 mx-auto max-w-md border-t border-sage-300 bg-white p-3">
        <Button className="w-full" size="lg">
          {t("chooseTime")}
        </Button>
      </div>
    </div>
  );
}
