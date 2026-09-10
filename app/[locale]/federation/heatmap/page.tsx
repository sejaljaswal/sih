import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

/**
 * A real Leaflet map needs lat/lng centroids per society and is a bigger
 * lift than this build-order step covers yet (CLAUDE.md: Leaflet is SSR-
 * unsafe, needs dynamic import). Demand intensity by society × service is
 * real data — shown as a ranked bar list instead of claiming a live map.
 */
export default async function FederationHeatmapPage() {
  const t = await getTranslations("federation.heatmap");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("federation_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: societies } = await supabase
    .from("societies")
    .select("id, name")
    .eq("federation_id", profile?.federation_id ?? "");

  const societyIds = (societies ?? []).map((s) => s.id);
  const nameById = new Map((societies ?? []).map((s) => [s.id, s.name]));

  const { data: demand } = await supabase
    .from("daily_demand_stats")
    .select("society_id, bookings_requested")
    .in("society_id", societyIds.length ? societyIds : [""]);

  const bySociety = new Map<string, number>();
  for (const row of demand ?? []) {
    bySociety.set(row.society_id, (bySociety.get(row.society_id) ?? 0) + row.bookings_requested);
  }
  const rows = [...bySociety.entries()]
    .map(([id, requested]) => ({ id, name: nameById.get(id) ?? "", requested }))
    .sort((a, b) => b.requested - a.requested);
  const max = Math.max(1, ...rows.map((r) => r.requested));

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-5 text-[13px] text-ink-3">{t("subtitle")}</p>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id}>
            <div className="mb-1 flex items-baseline justify-between text-[13px]">
              <span className="font-semibold">{r.name}</span>
              <span className="num text-ink-3">{t("requestsCount", { count: r.requested })}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-pill bg-sage-200">
              <div
                className="h-full rounded-pill bg-green-600"
                style={{ width: `${Math.round((r.requested / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
