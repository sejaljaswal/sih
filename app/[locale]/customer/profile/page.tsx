import { getTranslations } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function CustomerProfilePage() {
  const t = await getTranslations("customer.profile");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, preferred_language")
    .eq("id", user?.id ?? "")
    .single();

  const { data: addresses } = await supabase
    .from("addresses")
    .select("id, label, line1, city, pincode, is_default")
    .eq("user_id", user?.id ?? "")
    .is("deleted_at", null);

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-sage-200 text-[19px] font-bold">
          {profile?.full_name?.slice(0, 1) ?? "?"}
        </div>
        <div>
          <div className="text-[16px] font-bold">{profile?.full_name}</div>
          <div className="num flex items-center gap-1 text-[12.5px] text-ink-3">
            <Phone size={12} strokeWidth={2.4} />
            {profile?.phone}
          </div>
        </div>
      </div>

      <div className="mt-5 text-[13px] font-bold">{t("addressesHeading")}</div>
      {!addresses || addresses.length === 0 ? (
        <p className="mt-2 text-[12.5px] text-ink-3">{t("noAddresses")}</p>
      ) : (
        <div className="mt-2 space-y-2">
          {addresses.map((a) => (
            <div key={a.id} className="flex items-start gap-2.5 rounded-card border border-sage-300 p-3">
              <MapPin size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-green-600" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                  {a.label}
                  {a.is_default && (
                    <span className="rounded-xs border border-green-600 px-1 py-0.5 text-[10px] font-bold text-green-700">
                      {t("default")}
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-ink-3">
                  {a.line1}, {a.city} {a.pincode}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        action={async () => {
          "use server";
          await logout();
        }}
        className="mt-6"
      >
        <Button type="submit" variant="outline" className="w-full">
          {t("logout")}
        </Button>
      </form>
    </div>
  );
}
