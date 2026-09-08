"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  href: string;
  label: string;
  badge?: number;
};

/**
 * DESIGN.md: ">1024px — Society + federation — green-900 sidebar + content,
 * tables and charts." Active item gets a translucent fill and an ochre left
 * rule; a badge (e.g. pending verification count) sits on the active row.
 */
export function AdminSidebar({
  orgName,
  orgSubtitle,
  items,
  footerName,
  footerRole,
}: {
  orgName: string;
  orgSubtitle: string;
  items: SidebarItem[];
  footerName: string;
  footerRole: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-[196px] shrink-0 bg-green-900 py-4 text-white/85">
      <div className="border-b border-white/10 px-4 pb-4">
        <div className="text-[15px] leading-tight font-bold text-white">{orgName}</div>
        <div className="mt-0.5 text-[11px] leading-tight whitespace-pre-line text-white/55">
          {orgSubtitle}
        </div>
      </div>
      <nav className="mt-3 text-[13px]">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between border-l-2 border-transparent px-4 py-2",
                active && "border-ochre-500 bg-white/12 font-semibold text-white",
              )}
            >
              <span>{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className="num rounded-pill bg-ochre-500 px-1.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-white/10 px-4 pt-4 text-[11px] leading-relaxed text-white/55">
        {footerName}
        <br />
        {footerRole}
      </div>
    </aside>
  );
}
