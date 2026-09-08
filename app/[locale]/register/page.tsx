import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RegisterForm } from "@/components/domain/register-form";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <SocietyStamp
        size="sm"
        lines={[t("landing.stampLine1"), t("landing.stampLine2"), t("landing.stampLine3")]}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-[19px]">{t("auth.register")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RegisterForm />
          <p className="text-center text-[13px] text-ink-3">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="font-semibold text-green-600 underline underline-offset-4">
              {t("auth.loginLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
