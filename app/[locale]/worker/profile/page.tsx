import { useTranslations } from "next-intl";
import { Check, AlertCircle } from "lucide-react";
import { SocietyStamp } from "@/components/domain/society-stamp";
import { Button } from "@/components/ui/button";

export default function WorkerProfilePage() {
  const t = useTranslations("worker.verificationPending");

  const docs = [
    { key: "idProof", label: t("idProof"), status: "submitted" as const },
    { key: "membershipProof", label: t("membershipProof"), status: "submitted" as const },
    { key: "itiCertificate", label: t("itiCertificate"), status: "blurred" as const },
  ];

  return (
    <div className="px-5 pt-10 pb-6 text-center">
      <div className="inline-block opacity-40">
        <SocietyStamp
          size="lg"
          pending
          lines={[t("stampLabel"), "SHIMLA LABOUR", "COOP SOCIETY"]}
        />
      </div>
      <div className="mt-6 text-[19px] font-bold">{t("heading")}</div>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{t("body")}</p>

      <div className="mt-7 divide-y divide-sage-200 rounded-card border border-sage-300 text-left">
        {docs.map((doc) => (
          <div key={doc.key} className="flex items-center gap-3 px-3 py-3">
            {doc.status === "submitted" ? (
              <Check size={18} strokeWidth={2.6} className="text-green-600" />
            ) : (
              <AlertCircle size={18} strokeWidth={2.4} className="text-brick-500" />
            )}
            <div className="flex-1">
              <span className="text-[13.5px]">{doc.label}</span>
              {doc.status === "blurred" && (
                <div className="text-[11px] text-brick-700">{t("blurred")}</div>
              )}
            </div>
            {doc.status === "submitted" ? (
              <span className="text-[11.5px] font-semibold text-green-600">{t("submitted")}</span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-auto border-brick-500 px-2 py-1 text-[11.5px] font-bold text-brick-700"
              >
                {t("resend")}
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-card border border-sage-300 bg-sage-50 p-3 text-left">
        <div className="text-[12.5px] font-bold">{t("questionsHeading")}</div>
        <p className="mt-1 text-[12px] leading-snug text-ink-3">
          {t("questionsBody", { name: "सुरेश पाटिल", phone: "98XXXXXX40" })}
        </p>
      </div>
    </div>
  );
}
