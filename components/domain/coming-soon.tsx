import { useTranslations } from "next-intl";

/**
 * Not in design/sahaayak-ui.html — that file covers 13 core screens; these
 * routes are scaffolded shells waiting on a later build-order step (real
 * data, or a screen the mockup didn't draw). Styled to the system so nothing
 * looks like leftover boilerplate, but honestly labelled per DESIGN.md's
 * copy rule: "Empty states give direction, not mood."
 */
export function ComingSoon({ title }: { title: string }) {
  const t = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center">
      <h1 className="text-[19px] font-bold">{title}</h1>
      <p className="text-[13px] text-ink-3">{t("comingSoonBody")}</p>
    </div>
  );
}
