"use client";

import { Briefcase, ClipboardList, Home, User, Wallet } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const ICONS = { Briefcase, ClipboardList, Home, User, Wallet } as const;

export type TabItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
};

/**
 * DESIGN.md layout: "<640px — Customer + worker (primary) — single column,
 * bottom tab bar, sticky bottom CTA." Active tab is green-600 + bold label;
 * inactive is ink-4.
 */
export function BottomTabBar({ items }: { items: TabItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 grid border-t border-sage-300 bg-white py-2"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = ICONS[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-1",
              active ? "text-green-600" : "text-ink-4",
            )}
          >
            <Icon size={19} strokeWidth={2.2} />
            <span className={cn("text-[10px]", active && "font-bold")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
