import { useTranslations } from "next-intl";
import { ComingSoon } from "@/components/domain/coming-soon";

export default function SocietyWorkersPage() {
  const t = useTranslations("nav");
  return <ComingSoon title={t("workers")} />;
}
