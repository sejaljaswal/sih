import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/domain/login-form";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <SocietyStamp
        size="sm"
        lines={[t("landing.stampLine1"), t("landing.stampLine2"), t("landing.stampLine3")]}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-[19px]">{t("auth.login")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          <p className="text-center text-[13px] text-ink-3">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="font-semibold text-green-600 underline underline-offset-4">
              {t("auth.registerLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
