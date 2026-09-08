import { useTranslations } from "next-intl";
import { AdminSidebar } from "@/components/domain/admin-sidebar";

export default function SocietyLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="flex flex-1">
      <AdminSidebar
        orgName="Sahaayak"
        orgSubtitle={"Shimla Labour\nCooperative Society"}
        footerName="Suresh Patil"
        footerRole="Society Administrator"
        items={[
          { href: "/society/overview", label: t("overview") },
          // Demo count until the verification queue reads a real query.
          { href: "/society/verification", label: t("verification"), badge: 3 },
          { href: "/society/workers", label: t("workers") },
          { href: "/society/rates", label: t("rates") },
          { href: "/society/bookings", label: t("bookings") },
          { href: "/society/analytics", label: t("analytics") },
        ]}
      />
      <div className="min-w-0 flex-1 bg-sage-50">{children}</div>
    </div>
  );
}
