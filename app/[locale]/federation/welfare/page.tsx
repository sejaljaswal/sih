import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/utils";

export default async function FederationWelfarePage() {
  const t = await getTranslations("federation.welfare");
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
    .select("id")
    .eq("federation_id", profile?.federation_id ?? "");
  const societyIds = (societies ?? []).map((s) => s.id);

  const { data: workersRaw } = await supabase
    .from("workers")
    .select("id, profiles!workers_user_id_fkey(full_name), societies(name)")
    .in("society_id", societyIds.length ? societyIds : [""]);
  const workers = workersRaw as unknown as
    | { id: string; profiles: { full_name: string } | null; societies: { name: string } | null }[]
    | null;
  const workerIds = (workers ?? []).map((w) => w.id);
  const workerById = new Map((workers ?? []).map((w) => [w.id, w]));

  const { data: contributions } = await supabase
    .from("welfare_contributions")
    .select("worker_id, amount_paise, status, created_at")
    .in("worker_id", workerIds.length ? workerIds : [""])
    .order("created_at", { ascending: false });

  const totalCredited = (contributions ?? [])
    .filter((c) => c.status === "CREDITED")
    .reduce((sum, c) => sum + c.amount_paise, 0);

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-4 text-[13px] text-ink-3">{t("subtitle")}</p>

      <div className="rounded-xs border border-ink">
        <div className="bg-ink px-3 py-2 text-[12px] font-bold text-white">{t("fundHeading")}</div>
        <div className="p-4">
          <div className="num text-[30px] font-bold text-ochre-700">{formatPaise(totalCredited)}</div>
          <div className="mt-1 text-[12px] text-ink-3">{t("fundSubtitle", { count: contributions?.length ?? 0 })}</div>
        </div>
      </div>

      <div className="mt-4 text-[13px] font-bold">{t("recentHeading")}</div>
      <div className="mt-2 divide-y divide-sage-200 rounded-card border border-sage-300 bg-white">
        {(contributions ?? []).length === 0 && (
          <p className="px-3 py-4 text-[12.5px] text-ink-3">{t("empty")}</p>
        )}
        {(contributions ?? []).map((c, i) => {
          const worker = workerById.get(c.worker_id);
          return (
            <div key={i} className="flex items-center justify-between px-3 py-2.5">
              <div>
                <div className="text-[13px] font-semibold">{worker?.profiles?.full_name}</div>
                <div className="text-[11.5px] text-ink-3">{worker?.societies?.name}</div>
              </div>
              <span className="num text-[13.5px] font-bold text-ochre-700">+{formatPaise(c.amount_paise)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
