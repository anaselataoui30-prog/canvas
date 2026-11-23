import type { Lang } from "@/types";
import { makeT } from "@/i18n";
import { Rise } from "./ProductCard";

const STEPS = [
  { icon: "M4 5h16l-1.5 12.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 5Zm4 3.5 2.5 5 2.5-4 2 3.5 2.5-4.5", k: "1" },
  { icon: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm-3 8h.01M12 11h.01M15 11h.01", k: "2" },
  { icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 18.5a1.8 1.8 0 1 0 0-.01M17.5 18.5a1.8 1.8 0 1 0 0-.01", k: "3" },
] as const;

export function HowItWorks({ lang }: { lang: Lang }) {
  const t = makeT(lang);
  return (
    <section id="how" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24">
      <Rise>
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t("how_title")}</h2>
          <span className="label-spec hidden sm:block">01 — 03</span>
        </div>
      </Rise>
      <div className="grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Rise key={s.k} delay={i * 90} className="bg-background">
            <div className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "#b39c4f" }}>
                  <path d={s.icon} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-3xl font-black opacity-15">{s.k}</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">{t(`how_${s.k}_t` as never)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed opacity-70">{t(`how_${s.k}_d` as never)}</p>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
}
