import { useTranslations } from "next-intl";
import { Zap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/utils";

const OFFER = { earningPaise: 68800, distanceKm: 2.3, durationMin: 45, address: "संजौली, सेक्टर 4" };

export default function WorkerOfferPage() {
  const t = useTranslations("worker.offer");

  return (
    <div className="min-h-full bg-ink pb-20 text-white">
      <div className="px-5 pt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-xs bg-ochre-500 px-2.5 py-1">
          <Zap size={12} strokeWidth={2.8} className="fill-white text-white" />
          <span className="text-[12px] font-bold text-white">{t("emergencyBadge")}</span>
        </span>
        <div className="mt-4 text-[26px] leading-tight font-bold">{t("serviceLabel")}</div>
      </div>

      <div className="mx-5 mt-5 rounded-card bg-white p-5 text-ink">
        <div className="border-b border-sage-200 pb-4 text-center">
          <div className="text-[13px] text-ink-3">{t("youEarn")}</div>
          <div className="num mt-1 text-[46px] leading-none font-bold">
            {formatPaise(OFFER.earningPaise)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-sage-200 py-4 text-center">
          <div>
            <div className="num text-[24px] font-bold">{OFFER.distanceKm}</div>
            <div className="text-[13px] text-ink-3">{t("distanceAway")}</div>
          </div>
          <div>
            <div className="num text-[24px] font-bold">{OFFER.durationMin}</div>
            <div className="text-[13px] text-ink-3">{t("jobDuration")}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-4">
          <MapPin size={18} strokeWidth={2.2} className="shrink-0 text-ink-3" />
          <span className="text-[15px]">{OFFER.address}</span>
        </div>
      </div>

      <div className="mx-5 mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[13px] text-white/70">{t("timeLeft")}</span>
          <span className="num text-[15px] font-bold text-ochre-300">0:22</span>
        </div>
        <div className="h-2 overflow-hidden rounded-pill bg-white/15">
          <div className="h-full rounded-pill bg-ochre-500" style={{ width: "73%" }} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 mx-auto max-w-md space-y-3 p-5">
        <Button size="lg" className="w-full bg-green-500 text-[20px] hover:bg-green-500/90">
          {t("accept")}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full border-2 border-white/25 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
        >
          {t("decline")}
        </Button>
      </div>
    </div>
  );
}
