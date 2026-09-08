import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations("common");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
      <h1 className="text-[19px] font-bold">{t("unauthorizedTitle")}</h1>
      <p className="text-[13px] text-ink-3">{t("unauthorizedBody")}</p>
    </main>
  );
}
