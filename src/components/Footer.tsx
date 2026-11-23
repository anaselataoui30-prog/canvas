import { STORE } from "@/config";
import type { Lang } from "@/types";
import { makeT } from "@/i18n";

export function Footer({ lang, onOpenCart }: { lang: Lang; onOpenCart: () => void }) {
  const t = makeT(lang);
  const wa = `https://wa.me/${STORE.whatsappNumber}`;
  return (
    <footer className="border-t-2 border-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="text-3xl font-black tracking-tight">
              {STORE.name[lang]}
              <span className="mx-1.5 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
            </p>
            <p className="mt-2 max-w-xs text-[15px] opacity-70">{STORE.tagline[lang]}</p>
          </div>
          <div className="flex flex-col gap-2 text-[15px]">
            <a className="w-fit opacity-60 transition-opacity hover:opacity-100" href="#shop">{lang === "ar" ? "المتجر" : "Boutique"}</a>
            <a className="w-fit opacity-60 transition-opacity hover:opacity-100" href="#how">{t("how_title")}</a>
            <button type="button" className="w-fit cursor-pointer text-start opacity-60 transition-opacity hover:opacity-100" onClick={onOpenCart}>
              {t("cart_title")}
            </button>
          </div>
          <div className="flex flex-col gap-2 text-[15px]">
            <a
              className="flex w-fit items-center gap-2 opacity-60 transition-opacity hover:opacity-100"
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.2 1.5Z" />
              </svg>
              WhatsApp
            </a>
            {STORE.instagram && (
              <a className="flex w-fit items-center gap-2 opacity-60 transition-opacity hover:opacity-100" href={STORE.instagram} target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
                </svg>
                Instagram
              </a>
            )}
            <p className="label-spec mt-1">{t("footer_hours")}</p>
          </div>
        </div>
        <div className="dotted-line my-8" />
        <p className="label-spec">© 2026 {STORE.name[lang]} — {t("footer_made")}</p>
      </div>
    </footer>
  );
}
