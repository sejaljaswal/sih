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

export default async function CustomerBookingsPage() {
  const t = await getTranslations("customer.bookings");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookingsRaw } = await supabase
    .from("bookings")
    .select("id, booking_code, status, quoted_price_paise, final_price_paise, scheduled_at, services(name_key), workers(profiles!workers_user_id_fkey(full_name))")
    .eq("customer_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  const bookings = bookingsRaw as unknown as
    | {
        id: string;
        booking_code: string;
        status: string;
        quoted_price_paise: number;
        final_price_paise: number | null;
        services: { name_key: string } | null;
        workers: { profiles: { full_name: string } | null } | null;
      }[]
    | null;

  return (
    <div className="px-4 pt-3 pb-4">
      <h1 className="text-[19px] font-bold tracking-[-0.01em]">{t("heading")}</h1>

      {!bookings || bookings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-1 text-center">
          <p className="text-[13px] text-ink-3">{t("emptyTitle")}</p>
          <p className="text-[12px] text-ink-4">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {bookings.map((b) => {
            const serviceName = t(`services.${b.services?.name_key ?? "unknown"}`);
            const workerName = b.workers?.profiles?.full_name;
            const price = b.final_price_paise ?? b.quoted_price_paise;
            return (
              <div key={b.id} className="rounded-card border border-sage-300 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[14px] font-semibold">{serviceName}</div>
                    <div className="num mt-0.5 text-[11.5px] text-ink-3">{b.booking_code}</div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-xs border px-1.5 py-0.5 text-[11px] font-semibold",
                      STATUS_STYLE[b.status] ?? "border-sage-300 bg-sage-50 text-ink-3",
                    )}
                  >
                    {t(`bookingStatus.${b.status}`)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12.5px] text-ink-3">
                  <span>{workerName ?? t("noWorkerYet")}</span>
                  {price != null && <span className="num font-semibold text-ink">{formatPaise(price)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
