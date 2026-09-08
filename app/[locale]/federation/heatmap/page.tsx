import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/domain/coming-soon";

export default function FederationHeatmapPage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("heatmap")} />;
}
