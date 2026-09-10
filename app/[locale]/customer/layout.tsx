import { useTranslations } from "next-intl";
import { BottomTabBar } from "@/components/domain/bottom-tab-bar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white pb-16">
      <div className="flex-1">{children}</div>
      <BottomTabBar
        items={[
          { href: "/customer/home", label: t("home"), icon: "Home" },
          { href: "/customer/bookings", label: t("bookings"), icon: "ClipboardList" },
          { href: "/customer/profile", label: t("profile"), icon: "User" },
        ]}
      />
    </div>
  );
}
