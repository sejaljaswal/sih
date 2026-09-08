import { cn } from "@/lib/utils";

/**
 * DESIGN.md: "Trust is a stamp, not a checkmark." A circular double-ruled
 * outline rotated -9deg at 92% opacity, so verification reads as a society
 * seal rather than a platform checkmark. Content is always 2-4 short lines
 * (mark, society name split across lines, optional registration year).
 *
 * Pending state: dashed border, 40% opacity — an unstamped register entry.
 */
export function SocietyStamp({
  size = "sm",
  lines,
  pending = false,
  className,
}: {
  size?: "xs" | "sm" | "lg";
  lines: string[];
  pending?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("stamp", `stamp-${size}`, pending && "stamp-pending", className)}
      role="img"
      aria-label={lines.join(", ")}
    >
      {lines.map((line, i) => (
        <span key={i} style={i > 0 ? { marginTop: 1 } : undefined}>
          {line}
        </span>
      ))}
    </div>
  );
}
