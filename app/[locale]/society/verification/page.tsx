import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUEUE = [
  { id: "ramesh", initial: "रा", name: "Ramesh Kumar", role: "Electrician · 15 yrs", submitted: "submitted 2 days ago", docs: "3 docs", complete: true, selected: true },
  { id: "anita", initial: "अ", name: "Anita Devi", role: "Caregiver · 6 yrs", submitted: "submitted 1 day ago", docs: "3 docs", complete: true },
  { id: "mohan", initial: "मो", name: "Mohan Lal", role: "Plumber · 9 yrs", submitted: "submitted 4 hours ago", docs: "2 of 3", complete: false },
];

const DOCUMENTS = [
  { label: "Identity proof", file: "aadhaar-front.jpg · 1.2 MB" },
  { label: "Society membership", file: "member-card.jpg · 0.8 MB" },
  { label: "ITI certificate", file: "iti-2009.pdf · 2.1 MB" },
];

const SKILLS = [
  { label: "Wiring", certified: true },
  { label: "Fan repair", certified: true },
  { label: "Inverter install", certified: false },
];

export default function SocietyVerificationPage() {
  const t = useTranslations("society.verification");

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-sage-200 px-6 py-4">
        <div>
          <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
          <p className="mt-0.5 text-[13px] text-ink-3">{t("queueCount", { count: 3 })}</p>
        </div>
        <div className="num text-[12px] text-ink-3">{t("avgTurnaround", { hours: 31 })}</div>
      </div>

      <div className="grid grid-cols-[1fr_360px]">
        <div className="divide-y divide-sage-200 border-r border-sage-200">
          {QUEUE.map((w) => (
            <div
              key={w.id}
              className={cn(
                "flex items-center gap-3 border-l-2 border-transparent px-6 py-3.5",
                w.selected && "border-green-600 bg-green-50",
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-sage-200 text-[14px] font-bold">
                {w.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold">{w.name}</div>
                <div className="text-[12px] text-ink-3">
                  {w.role} · {w.submitted}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-xs border px-1.5 py-0.5 text-[11px] font-semibold",
                  w.complete
                    ? "border-ochre-300 bg-ochre-50 text-ochre-700"
                    : "border-brick-500/40 bg-brick-100 text-brick-700",
                )}
              >
                {w.docs}
              </span>
            </div>
          ))}
          <div className="px-6 py-10 text-center">
            <div className="text-[13px] text-ink-3">{t("emptyTitle")}</div>
            <div className="mt-1 text-[12px] text-ink-4">{t("emptyBody")}</div>
          </div>
        </div>

        <div className="bg-sage-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-card bg-sage-200 text-[19px] font-bold">
              रा
            </div>
            <div className="flex-1">
              <div className="text-[16px] leading-tight font-bold">Ramesh Kumar</div>
              <div className="mt-0.5 text-[12.5px] text-ink-3">{t("membershipSince", { no: 1142, year: 2011 })}</div>
              <div className="num text-[12.5px] text-ink-3">98XXXXXX12 · Sanjauli</div>
            </div>
          </div>

          <div className="mt-4 text-[12px] font-bold">{t("documentsHeading")}</div>
          <div className="mt-2 space-y-2">
            {DOCUMENTS.map((doc) => (
              <div
                key={doc.label}
                className="flex items-center gap-2.5 rounded-xs border border-sage-300 bg-white px-3 py-2"
              >
                <div className="h-10 w-8 shrink-0 rounded-[2px] border border-sage-300 bg-sage-100" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold">{doc.label}</div>
                  <div className="text-[11px] text-ink-3">{doc.file}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-auto border-green-600 px-2 py-1 text-[11.5px] font-semibold text-green-600"
                >
                  {t("viewDocument")}
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] leading-snug text-ink-4">{t("signedUrlNote")}</p>

          <div className="mt-4 text-[12px] font-bold">{t("skillsHeading")}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILLS.map((s) => (
              <span
                key={s.label}
                className={cn(
                  "rounded-pill border px-2.5 py-1 text-[12px]",
                  s.certified
                    ? "border-green-600 bg-white font-semibold text-green-700"
                    : "border-sage-300 bg-white text-ink-3",
                )}
              >
                {s.label} {s.certified && "✓"}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-2">
            <Button className="w-full">{t("approve")}</Button>
            <Button
              variant="outline"
              className="w-full border-brick-500 font-semibold text-brick-700"
            >
              {t("returnWithReason")}
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-snug text-ink-4">{t("auditNote")}</p>
        </div>
      </div>
    </div>
  );
}
