import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-16">
      <div className="flex w-full max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <SocietyStamp
          size="lg"
          lines={[t("stampLine1"), t("stampLine2"), t("stampLine3")]}
          className="shrink-0"
        />
        <div>
          <h1 className="text-[34px] leading-[1.05] font-bold tracking-[-0.03em] sm:text-[42px]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-ink-3">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="mt-10 flex w-full max-w-3xl flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="flex-1">
          <Link href="/register">{t("cta")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/register">{t("ctaWorker")}</Link>
        </Button>
      </div>

      <div className="mt-12 grid w-full max-w-3xl gap-4 text-left text-[13px] leading-relaxed sm:grid-cols-3">
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="mb-1.5 font-bold">{t("moneyHeroTitle")}</div>
          <p className="text-ink-3">{t("moneyHeroBody")}</p>
        </div>
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="mb-1.5 font-bold">{t("trustStampTitle")}</div>
          <p className="text-ink-3">{t("trustStampBody")}</p>
        </div>
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="mb-1.5 font-bold">{t("ledgerTitle")}</div>
          <p className="text-ink-3">{t("ledgerBody")}</p>
        </div>
      </div>
    </main>
  );
}
