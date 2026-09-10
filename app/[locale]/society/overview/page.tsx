import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/utils";

export default async function SocietyOverviewPage() {
  const t = await getTranslations("society.overview");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("society_id, societies(name)")
    .eq("id", user?.id ?? "")
    .single();
  const profile = profileRaw as unknown as { society_id: string | null; societies: { name: string } | null } | null;

  const societyId = profile?.society_id;

  const [{ count: workerCount }, { count: verifiedCount }, { count: pendingCount }, { count: activeBookings }, { data: demand }] =
    await Promise.all([
      supabase.from("workers").select("id", { count: "exact", head: true }).eq("society_id", societyId ?? ""),
      supabase
        .from("workers")
        .select("id", { count: "exact", head: true })
        .eq("society_id", societyId ?? "")
        .eq("verification_status", "VERIFIED"),
      supabase
        .from("workers")
        .select("id", { count: "exact", head: true })
        .eq("society_id", societyId ?? "")
        .in("verification_status", ["PENDING", "UNDER_REVIEW"]),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("society_id", societyId ?? "")
        .not("status", "in", "(COMPLETED,PAID,CANCELLED,UNFULFILLED)"),
      supabase
        .from("daily_demand_stats")
        .select("revenue_paise, bookings_fulfilled")
        .eq("society_id", societyId ?? ""),
    ]);

  const weekRevenue = (demand ?? []).reduce((sum, d) => sum + d.revenue_paise, 0);
  const weekFulfilled = (demand ?? []).reduce((sum, d) => sum + d.bookings_fulfilled, 0);

  const cards = [
    { label: t("verifiedWorkers"), value: verifiedCount ?? 0 },
    { label: t("pendingVerification"), value: pendingCount ?? 0 },
    { label: t("activeBookings"), value: activeBookings ?? 0 },
    { label: t("jobsThisWeek"), value: weekFulfilled },
  ];

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">
        {t("heading", { society: profile?.societies?.name ?? "" })}
      </h1>
      <p className="mt-0.5 text-[13px] text-ink-3">{t("subtitle", { count: workerCount ?? 0 })}</p>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-sage-300 bg-white p-4">
            <div className="num text-[26px] font-bold">{c.value}</div>
            <div className="mt-0.5 text-[12px] text-ink-3">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xs border border-ink">
        <div className="bg-ink px-3 py-2 text-[12px] font-bold text-white">{t("revenueHeading")}</div>
        <div className="p-4">
          <div className="num text-[30px] font-bold">{formatPaise(weekRevenue)}</div>
          <div className="mt-1 text-[12px] text-ink-3">{t("revenueSubtitle")}</div>
        </div>
      </div>
    </div>
  );
}
