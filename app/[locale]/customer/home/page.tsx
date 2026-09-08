import { useTranslations } from "next-intl";
import { ChevronDown, MapPin, Mic, Search, Zap, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatPaise } from "@/lib/utils";

const CATEGORIES = [
  { key: "electrical", icon: "⚡", fromPaise: 30000 },
  { key: "plumbing", icon: "🔧", fromPaise: 25000 },
  { key: "cleaning", icon: "🧹", fromPaise: 40000 },
  { key: "carpentry", icon: "🪚", fromPaise: 35000 },
  { key: "care", icon: "🫂", fromPaise: 50000 },
  { key: "painting", icon: "🎨", fromPaise: 60000 },
] as const;

export default function CustomerHomePage() {
  const t = useTranslations("customer.home");

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} strokeWidth={2.2} className="text-green-600" />
          <span className="text-[13px] font-semibold">{t("location")}</span>
          <ChevronDown size={11} strokeWidth={3} className="text-ink-3" />
        </div>
      </div>

      <h1 className="text-[22px] leading-tight font-bold">{t("greeting")}</h1>
      <p className="mt-0.5 text-[14px] text-ink-3">{t("subtitle")}</p>

      <Link
        href="/customer/services/search"
        className="mt-3 block rounded-card border-2 border-green-600 bg-green-50 px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <Search size={16} strokeWidth={2.2} className="text-green-600" />
          <span className="text-[14px] text-ink-3">{t("searchPlaceholder")}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-green-100 pt-2">
          <Mic size={13} strokeWidth={2.2} className="text-ochre-700" />
          <span className="text-[12px] font-semibold text-ochre-700">{t("voiceInput")}</span>
        </div>
      </Link>

      <div className="mt-4 flex items-baseline justify-between">
        <h2 className="text-[14px] font-bold">{t("servicesHeading")}</h2>
        <span className="text-[12px] font-semibold text-green-600">{t("viewAll")}</span>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.key}
            href={`/customer/services/${c.key}`}
            className="rounded-card border border-sage-300 p-2.5 text-center"
          >
            <div className="text-[22px] leading-none">{c.icon}</div>
            <div className="mt-1.5 text-[11.5px] leading-tight font-semibold">
              {t(`categories.${c.key}`)}
            </div>
            <div className="num mt-0.5 text-[10px] text-ink-3">
              {t("fromPrice", { price: formatPaise(c.fromPaise) })}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/customer/book/emergency"
        className="mt-4 flex items-center gap-3 rounded-card border border-ochre-300 bg-ochre-50 px-3 py-2.5"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-ochre-500">
          <Zap size={18} strokeWidth={2.4} className="fill-white text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] leading-tight font-bold">{t("sosTitle")}</div>
          <div className="mt-0.5 text-[11.5px] leading-tight text-ink-3">{t("sosSubtitle")}</div>
        </div>
        <ArrowRight size={16} strokeWidth={3} className="text-ochre-700" />
      </Link>
    </div>
  );
}
