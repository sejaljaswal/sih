import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const RADAR_WORKERS = [
  { initial: "रा", left: "24%", top: "30%", status: "sent" as const, name: "रमेश कुमार", distanceKm: 2.3 },
  { initial: "सु", left: "70%", top: "24%", status: "sent" as const, name: "सुनीता देवी", distanceKm: 3.1 },
  { initial: "मो", left: "78%", top: "64%", status: "queued" as const, name: "मोहन लाल", distanceKm: 6.8 },
  { initial: "क", left: "17%", top: "70%", status: "queued" as const, name: null, distanceKm: null },
  { initial: "दी", left: "47%", top: "80%", status: "queued" as const, name: null, distanceKm: null },
];

export default function MatchingPage() {
  const t = useTranslations("customer.matching");

  return (
    <div className="px-4 pt-4 pb-20">
      <div className="flex items-center gap-2 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-xs bg-ochre-500 px-2 py-1">
          <Zap size={11} strokeWidth={2.8} className="fill-white text-white" />
          <span className="text-[11px] font-bold text-white">{t("emergencyBadge")}</span>
        </span>
        <span className="text-[12px] text-ink-3">{t("serviceLabel")}</span>
      </div>

      <div className="relative mx-auto h-[260px] overflow-hidden rounded-card border border-sage-300 bg-sage-50">
        <div
          className="absolute inset-0 opacity-[.35]"
          style={{
            backgroundImage:
              "linear-gradient(#C3CABB 1px,transparent 1px),linear-gradient(90deg,#C3CABB 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="pulse-ring absolute -inset-24 rounded-full border-2 border-green-300" />
          <div
            className="pulse-ring absolute -inset-24 rounded-full border-2 border-green-300"
            style={{ animationDelay: "1.2s" }}
          />
          <div className="relative h-4 w-4 rounded-full bg-green-600 ring-4 ring-white" />
        </div>
        {RADAR_WORKERS.map((w, i) => (
          <div key={i} className="absolute" style={{ left: w.left, top: w.top }}>
            <div className="flex h-7 w-7 items-center justify-center rounded-pill border-2 border-green-600 bg-white text-[10px] font-bold">
              {w.initial}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 text-center">
        <div className="text-[18px] font-bold">{t("foundWorkers", { count: 5 })}</div>
        <div className="mt-1 text-[13px] text-ink-3">{t("withinRadius")}</div>
        <div className="num mt-4 text-[40px] leading-none font-bold text-ochre-500">0:22</div>
        <div className="mt-1 text-[12px] text-ink-3">{t("waiting")}</div>
      </div>

      <div className="ledger mt-5 overflow-hidden rounded-card border border-sage-300">
        {RADAR_WORKERS.filter((w) => w.name).map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5" style={{ height: 28 }}>
            <span
              className={`h-1.5 w-1.5 rounded-full ${w.status === "sent" ? "bg-green-600" : "bg-sage-300"}`}
            />
            <span className={`flex-1 text-[11.5px] ${w.status === "queued" ? "text-ink-3" : ""}`}>
              {w.name} · {w.distanceKm} km
            </span>
            <span className={`text-[11px] ${w.status === "sent" ? "text-ink-3" : "text-ink-4"}`}>
              {w.status === "sent" ? t("sent") : t("queued")}
            </span>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-16 mx-auto max-w-md p-3">
        <Button variant="outline" className="w-full">
          {t("cancel")}
        </Button>
      </div>
    </div>
  );
}
