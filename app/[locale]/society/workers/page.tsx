import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  VERIFIED: "border-green-600 bg-green-50 text-green-700",
  PENDING: "border-ochre-300 bg-ochre-50 text-ochre-700",
  UNDER_REVIEW: "border-ochre-300 bg-ochre-50 text-ochre-700",
  REJECTED: "border-brick-500/40 bg-brick-100 text-brick-700",
  SUSPENDED: "border-brick-500/40 bg-brick-100 text-brick-700",
};

export default async function SocietyWorkersPage() {
  const t = await getTranslations("society.workers");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("society_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: workersRaw } = await supabase
    .from("workers")
    .select(
      "id, membership_no, verification_status, is_available, rating_avg, total_ratings, jobs_completed, profiles!workers_user_id_fkey(full_name)",
    )
    .eq("society_id", profile?.society_id ?? "")
    .order("jobs_completed", { ascending: false });

  const workers = workersRaw as unknown as
    | {
        id: string;
        membership_no: string;
        verification_status: string;
        is_available: boolean;
        rating_avg: number;
        total_ratings: number;
        jobs_completed: number;
        profiles: { full_name: string } | null;
      }[]
    | null;

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-4 text-[13px] text-ink-3">{t("subtitle", { count: workers?.length ?? 0 })}</p>

      <div className="overflow-hidden rounded-xs border border-sage-300">
        <table className="w-full text-[13px]">
          <thead className="bg-sage-100 text-[12px] text-ink-3">
            <tr className="text-left">
              <th className="px-3 py-2 font-semibold">{t("name")}</th>
              <th className="px-3 py-2 font-semibold">{t("membershipNo")}</th>
              <th className="px-3 py-2 font-semibold">{t("status")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("rating")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("jobsCompleted")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("available")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 bg-white">
            {(workers ?? []).map((w) => (
              <tr key={w.id}>
                <td className="px-3 py-2.5 font-semibold">{w.profiles?.full_name}</td>
                <td className="num px-3 py-2.5 text-ink-3">{w.membership_no}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "rounded-xs border px-1.5 py-0.5 text-[11px] font-semibold",
                      STATUS_STYLE[w.verification_status] ?? "border-sage-300 bg-sage-50 text-ink-3",
                    )}
                  >
                    {t(`verificationStatus.${w.verification_status}`)}
                  </span>
                </td>
                <td className="num px-3 py-2.5 text-right">
                  {w.total_ratings > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Star size={11} className="fill-ochre-500 text-ochre-500" />
                      {w.rating_avg}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="num px-3 py-2.5 text-right">{w.jobs_completed}</td>
                <td className="px-3 py-2.5 text-right">
                  {w.is_available ? (
                    <span className="text-[12px] font-semibold text-green-600">{t("yes")}</span>
                  ) : (
                    <span className="text-[12px] text-ink-4">{t("no")}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
