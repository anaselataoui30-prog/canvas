import { useEffect, useRef, useState } from "react";
import type { Lang, Product } from "@/types";
import { makeT } from "@/i18n";

export function BlurUpImg({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={`${className} fx-blurup ${loaded ? "loaded" : ""}`}
    />
  );
}

export function ProductCard({
  product,
  index,
  lang,
  onOpen,
}: {
  product: Product;
  index: number;
  lang: Lang;
  onOpen: (p: Product) => void;
}) {
  const t = makeT(lang);
  const minPrice = Math.min(...product.sizes.map((s) => s.price));
  return (
    <button
      type="button"
      onClick={() => onOpen(product)}
      className="group relative block w-full cursor-pointer overflow-hidden border-b border-e border-foreground/15 bg-background text-start focus-visible:outline-offset-[-2px]"
      aria-label={product.name[lang]}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <BlurUpImg
          src={product.image}
          alt={product.name[lang]}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />
        {product.badge && (
          <span className="absolute start-2 top-2 bg-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-background">
            {t(product.badge === "new" ? "badge_new" : "badge_bestseller")}
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t border-foreground/15 px-3 py-2.5">
        <span className="truncate text-[15px] font-semibold leading-tight">
          <span className="me-2 text-[11px] opacity-40">
            {String(index + 1).padStart(2, "0")}
          </span>
          {product.name[lang]}
        </span>
        <span className="shrink-0 text-[13px] font-bold" style={{ color: "#8a6f2f" }}>
          {t("from")} {minPrice} {lang === "ar" ? "د.م." : "MAD"}
        </span>
      </div>
    </button>
  );
}

/** scroll-triggered entrance wrapper */
export function Rise({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-inview");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fx-rise ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
