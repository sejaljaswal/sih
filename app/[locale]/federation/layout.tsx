import { useTranslations } from "next-intl";
import { AdminSidebar } from "@/components/domain/admin-sidebar";

export default function FederationLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="flex flex-1">
      <AdminSidebar
        orgName="Sahaayak"
        orgSubtitle={"Himachal Pradesh Labour\nCooperative Federation"}
        footerName="Dr. Rao"
        footerRole="Federation Administrator"
        items={[
          { href: "/federation/overview", label: t("overview") },
          { href: "/federation/societies", label: t("societies") },
          { href: "/federation/heatmap", label: t("heatmap") },
          { href: "/federation/insights", label: t("insights") },
          { href: "/federation/welfare", label: t("welfare") },
        ]}
      />
      <div className="min-w-0 flex-1 bg-sage-50">{children}</div>
    </div>
  );
}
