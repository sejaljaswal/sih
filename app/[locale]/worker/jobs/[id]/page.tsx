import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn, formatPaise } from "@/lib/utils";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("worker.jobDetail");
  const supabase = await createClient();

  const { data: bookingRaw } = await supabase
    .from("bookings")
    .select(
      "id, booking_code, status, quoted_price_paise, final_price_paise, start_otp, scheduled_at, services(name_key), addresses(line1, city), profiles(full_name, phone)",
    )
    .eq("id", id)
    .single();

  const booking = bookingRaw as unknown as
    | {
        id: string;
        booking_code: string;
        status: string;
        quoted_price_paise: number;
        final_price_paise: number | null;
        start_otp: string | null;
        services: { name_key: string } | null;
        addresses: { line1: string; city: string } | null;
        profiles: { full_name: string; phone: string } | null;
      }
    | null;

  if (!booking) notFound();

  const price = booking.final_price_paise ?? booking.quoted_price_paise;

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-[17px] font-bold">{t(`services.${booking.services?.name_key}`)}</h1>
        <span className="num text-[11.5px] text-ink-3">{booking.booking_code}</span>
      </div>

      <div className="mt-3 rounded-xs border border-ink">
        <div className="bg-ink px-3 py-2 text-[12px] font-bold text-white">{t("statusHeading")}</div>
        <div className="p-3">
          <span
            className={cn(
              "rounded-xs border px-2 py-1 text-[12px] font-semibold",
              booking.status === "COMPLETED" || booking.status === "PAID"
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-slateb-500/40 bg-slateb-100 text-slateb-700",
            )}
          >
            {t(`bookingStatus.${booking.status}`)}
          </span>
          {booking.start_otp && (
            <div className="mt-3">
              <div className="text-[11.5px] text-ink-3">{t("startOtp")}</div>
              <div className="num text-[24px] font-bold tracking-widest">{booking.start_otp}</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-card border border-sage-300 p-3">
        <MapPin size={16} strokeWidth={2.2} className="shrink-0 text-green-600" />
        <div className="text-[13px]">
          {booking.addresses?.line1}, {booking.addresses?.city}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 rounded-card border border-sage-300 p-3">
        <div className="flex-1">
          <div className="text-[13px] font-semibold">{booking.profiles?.full_name}</div>
          <div className="num flex items-center gap-1 text-[12px] text-ink-3">
            <Phone size={11} strokeWidth={2.4} />
            {booking.profiles?.phone}
          </div>
        </div>
        {price != null && <span className="num text-[16px] font-bold">{formatPaise(price)}</span>}
      </div>
    </div>
  );
}
