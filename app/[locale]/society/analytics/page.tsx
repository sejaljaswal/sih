import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/utils";

export default async function SocietyAnalyticsPage() {
  const t = await getTranslations("society.analytics");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("society_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: statsRaw } = await supabase
    .from("daily_demand_stats")
    .select("service_id, bookings_requested, bookings_fulfilled, bookings_unfulfilled, revenue_paise, services(name_key)")
    .eq("society_id", profile?.society_id ?? "");

  const stats = statsRaw as unknown as
    | {
        bookings_requested: number;
        bookings_fulfilled: number;
        bookings_unfulfilled: number;
        revenue_paise: number;
        services: { name_key: string } | null;
      }[]
    | null;

  const byService = new Map<
    string,
    { name_key: string; requested: number; fulfilled: number; unfulfilled: number; revenue: number }
  >();
  for (const row of stats ?? []) {
    const key = row.services?.name_key ?? "unknown";
    const acc = byService.get(key) ?? { name_key: key, requested: 0, fulfilled: 0, unfulfilled: 0, revenue: 0 };
    acc.requested += row.bookings_requested;
    acc.fulfilled += row.bookings_fulfilled;
    acc.unfulfilled += row.bookings_unfulfilled;
    acc.revenue += row.revenue_paise;
    byService.set(key, acc);
  }
  const rows = [...byService.values()].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalRequested = rows.reduce((s, r) => s + r.requested, 0);
  const fulfillmentPct = totalRequested > 0 ? Math.round((rows.reduce((s, r) => s + r.fulfilled, 0) / totalRequested) * 100) : 0;

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-4 text-[13px] text-ink-3">{t("subtitle")}</p>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="num text-[26px] font-bold">{formatPaise(totalRevenue)}</div>
          <div className="mt-0.5 text-[12px] text-ink-3">{t("revenue7d")}</div>
        </div>
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="num text-[26px] font-bold">{totalRequested}</div>
          <div className="mt-0.5 text-[12px] text-ink-3">{t("bookings7d")}</div>
        </div>
        <div className="rounded-card border border-sage-300 bg-white p-4">
          <div className="num text-[26px] font-bold">{fulfillmentPct}%</div>
          <div className="mt-0.5 text-[12px] text-ink-3">{t("fulfillmentRate")}</div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xs border border-sage-300">
        <table className="w-full text-[13px]">
          <thead className="bg-sage-100 text-[12px] text-ink-3">
            <tr className="text-left">
              <th className="px-3 py-2 font-semibold">{t("service")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("requested")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("fulfilled")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("unfulfilled")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("revenue")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 bg-white">
            {rows.map((r) => (
              <tr key={r.name_key}>
                <td className="px-3 py-2.5 font-semibold">{t(`services.${r.name_key}`)}</td>
                <td className="num px-3 py-2.5 text-right">{r.requested}</td>
                <td className="num px-3 py-2.5 text-right text-green-700">{r.fulfilled}</td>
                <td className="num px-3 py-2.5 text-right text-brick-700">{r.unfulfilled}</td>
                <td className="num px-3 py-2.5 text-right font-semibold">{formatPaise(r.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
