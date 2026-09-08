import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/domain/coming-soon";

export default function FederationOverviewPage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("overview")} />;
}
