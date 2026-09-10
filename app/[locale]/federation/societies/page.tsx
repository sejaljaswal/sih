import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

export default async function FederationSocietiesPage() {
  const t = await getTranslations("federation.societiesList");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("federation_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: societiesRaw } = await supabase
    .from("societies")
    .select("id, name, district, registration_no, service_radius_km, is_active, workers(id, verification_status)")
    .eq("federation_id", profile?.federation_id ?? "")
    .order("name");

  const societies = societiesRaw as unknown as
    | {
        id: string;
        name: string;
        district: string;
        registration_no: string;
        workers: { id: string; verification_status: string }[];
      }[]
    | null;

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-4 text-[13px] text-ink-3">{t("subtitle", { count: societies?.length ?? 0 })}</p>

      <div className="overflow-hidden rounded-xs border border-sage-300">
        <table className="w-full text-[13px]">
          <thead className="bg-sage-100 text-[12px] text-ink-3">
            <tr className="text-left">
              <th className="px-3 py-2 font-semibold">{t("name")}</th>
              <th className="px-3 py-2 font-semibold">{t("district")}</th>
              <th className="px-3 py-2 font-semibold">{t("registrationNo")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("verifiedWorkers")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("totalWorkers")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 bg-white">
            {(societies ?? []).map((s) => {
              const workers = s.workers ?? [];
              const verified = workers.filter((w) => w.verification_status === "VERIFIED").length;
              return (
                <tr key={s.id}>
                  <td className="px-3 py-2.5 font-semibold">{s.name}</td>
                  <td className="px-3 py-2.5 text-ink-3">{s.district}</td>
                  <td className="num px-3 py-2.5 text-ink-3">{s.registration_no}</td>
                  <td className="num px-3 py-2.5 text-right text-green-700">{verified}</td>
                  <td className="num px-3 py-2.5 text-right">{workers.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
