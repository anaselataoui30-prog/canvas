import { STORE } from "@/config";
import type { Lang } from "@/types";

interface Props {
  lang: Lang;
  onLang: (l: Lang) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function Header({ lang, onLang, cartCount, onOpenCart }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-foreground/15 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="text-xl font-black tracking-tight"
          aria-label={STORE.name[lang]}
        >
          {STORE.name[lang]}
          <span className="mx-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
        </a>

        <nav className="hidden items-center gap-7 text-[13px] font-semibold uppercase tracking-[0.14em] md:flex">
          <a className="opacity-60 transition-opacity hover:opacity-100" href="#shop">
            {lang === "ar" ? "المتجر" : "Boutique"}
          </a>
          <a className="opacity-60 transition-opacity hover:opacity-100" href="#how">
            {lang === "ar" ? "كيف نعمل" : "Comment ça marche"}
          </a>
          <a className="opacity-60 transition-opacity hover:opacity-100" href="#preview">
            3D
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex border border-foreground/30 text-[13px] font-bold uppercase tracking-widest"
            role="group"
            aria-label="Language / اللغة"
          >
            {(["ar", "fr"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLang(l)}
                aria-pressed={lang === l}
                className={`px-3 py-1.5 transition-colors ${
                  lang === l ? "bg-foreground text-background" : "opacity-60 hover:opacity-100"
                }`}
              >
                {l === "ar" ? "ع" : "FR"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative border border-foreground/30 p-2 transition-colors hover:bg-foreground hover:text-background"
            aria-label={lang === "ar" ? "سلة الطلبات" : "Panier"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
