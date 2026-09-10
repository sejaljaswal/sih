import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { cn, formatPaise } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  REQUESTED: "border-ochre-300 bg-ochre-50 text-ochre-700",
  ASSIGNED: "border-slateb-500/40 bg-slateb-100 text-slateb-700",
  EN_ROUTE: "border-slateb-500/40 bg-slateb-100 text-slateb-700",
  ARRIVED: "border-slateb-500/40 bg-slateb-100 text-slateb-700",
  IN_PROGRESS: "border-slateb-500/40 bg-slateb-100 text-slateb-700",
  COMPLETED: "border-green-600 bg-green-50 text-green-700",
  PAID: "border-green-600 bg-green-50 text-green-700",
  CANCELLED: "border-brick-500/40 bg-brick-100 text-brick-700",
  UNFULFILLED: "border-brick-500/40 bg-brick-100 text-brick-700",
};

export default async function SocietyBookingsPage() {
  const t = await getTranslations("society.bookingsList");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("society_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, quoted_price_paise, final_price_paise, created_at, services(name_key), profiles(full_name), workers(profiles!workers_user_id_fkey(full_name))",
    )
    .eq("society_id", profile?.society_id ?? "")
    .order("created_at", { ascending: false });

  const bookings = bookingsRaw as unknown as
    | {
        id: string;
        booking_code: string;
        status: string;
        quoted_price_paise: number;
        final_price_paise: number | null;
        services: { name_key: string } | null;
        profiles: { full_name: string } | null;
        workers: { profiles: { full_name: string } | null } | null;
      }[]
    | null;

  return (
    <div className="p-6">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>
      <p className="mt-0.5 mb-4 text-[13px] text-ink-3">{t("subtitle", { count: bookings?.length ?? 0 })}</p>

      <div className="overflow-hidden rounded-xs border border-sage-300">
        <table className="w-full text-[13px]">
          <thead className="bg-sage-100 text-[12px] text-ink-3">
            <tr className="text-left">
              <th className="px-3 py-2 font-semibold">{t("code")}</th>
              <th className="px-3 py-2 font-semibold">{t("service")}</th>
              <th className="px-3 py-2 font-semibold">{t("customer")}</th>
              <th className="px-3 py-2 font-semibold">{t("worker")}</th>
              <th className="px-3 py-2 font-semibold">{t("status")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("amount")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-200 bg-white">
            {(bookings ?? []).map((b) => {
              const price = b.final_price_paise ?? b.quoted_price_paise;
              return (
                <tr key={b.id}>
                  <td className="num px-3 py-2.5 text-ink-3">{b.booking_code}</td>
                  <td className="px-3 py-2.5 font-semibold">{t(`services.${b.services?.name_key}`)}</td>
                  <td className="px-3 py-2.5">{b.profiles?.full_name}</td>
                  <td className="px-3 py-2.5">{b.workers?.profiles?.full_name ?? "—"}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-xs border px-1.5 py-0.5 text-[11px] font-semibold",
                        STATUS_STYLE[b.status] ?? "border-sage-300 bg-sage-50 text-ink-3",
                      )}
                    >
                      {t(`bookingStatus.${b.status}`)}
                    </span>
                  </td>
                  <td className="num px-3 py-2.5 text-right font-semibold">
                    {price != null ? formatPaise(price) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
