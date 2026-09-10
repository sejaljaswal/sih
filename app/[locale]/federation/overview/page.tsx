import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/utils";

export default async function FederationOverviewPage() {
  const t = await getTranslations("federation.overview");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("federation_id, federations(name)")
    .eq("id", user?.id ?? "")
    .single();
  const profile = profileRaw as unknown as
    | { federation_id: string | null; federations: { name: string } | null }
    | null;

  const { data: societiesRaw } = await supabase
    .from("societies")
    .select("id, name, workers(id)")
    .eq("federation_id", profile?.federation_id ?? "");
  const societies = societiesRaw as unknown as { id: string; name: string; workers: { id: string }[] }[] | null;

  const societyIds = (societies ?? []).map((s) => s.id);
  const totalWorkers = (societies ?? []).reduce((sum, s) => sum + (s.workers?.length ?? 0), 0);

  const { data: demand } = await supabase
    .from("daily_demand_stats")
    .select("revenue_paise, bookings_fulfilled, society_id")
    .in("society_id", societyIds.length ? societyIds : [""]);

  const weekRevenue = (demand ?? []).reduce((sum, d) => sum + d.revenue_paise, 0);
  const weekJobs = (demand ?? []).reduce((sum, d) => sum + d.bookings_fulfilled, 0);

  const cards = [
    { label: t("societies"), value: societies?.length ?? 0 },
    { label: t("workers"), value: totalWorkers },
    { label: t("jobsThisWeek"), value: weekJobs },
    { label: t("revenueThisWeek"), value: formatPaise(weekRevenue) },
  ];

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">
        {t("heading", { federation: profile?.federations?.name ?? "" })}
      </h1>
      <p className="mt-0.5 mb-5 text-[13px] text-ink-3">{t("subtitle")}</p>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-sage-300 bg-white p-4">
            <div className="num text-[24px] font-bold">{c.value}</div>
            <div className="mt-0.5 text-[12px] text-ink-3">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[13px] font-bold">{t("societiesHeading")}</div>
      <div className="mt-2 space-y-2">
        {(societies ?? []).map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-card border border-sage-300 bg-white p-3">
            <span className="text-[13.5px] font-semibold">{s.name}</span>
            <span className="num text-[12.5px] text-ink-3">{t("workerCount", { count: s.workers?.length ?? 0 })}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
