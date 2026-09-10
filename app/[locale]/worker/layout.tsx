import { useTranslations } from "next-intl";
import { BottomTabBar } from "@/components/domain/bottom-tab-bar";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white pb-16">
      <div className="flex-1">{children}</div>
      <BottomTabBar
        items={[
          { href: "/worker/dashboard", label: t("home"), icon: "Home" },
          { href: "/worker/offers", label: t("jobs"), icon: "Briefcase" },
          { href: "/worker/earnings", label: t("earnings"), icon: "Wallet" },
          { href: "/worker/profile", label: t("profile"), icon: "User" },
        ]}
      />
    </div>
  );
}
