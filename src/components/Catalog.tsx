import { useMemo, useState } from "react";
import type { Lang, Product } from "@/types";
import { CATEGORIES, PRODUCTS as products, type Category } from "@/data/products";
import { makeT, type TKey } from "@/i18n";
import { ProductCard, Rise } from "./ProductCard";

const catKey: Record<Category, TKey> = {
  all: "filter_all",
  landscapes: "filter_landscapes",
  patterns: "filter_patterns",
  minimal: "filter_minimal",
  cities: "filter_cities",
};

export function Catalog({
  lang,
  onOpen,
}: {
  lang: Lang;
  onOpen: (p: Product) => void;
}) {
  const t = makeT(lang);
  const [cat, setCat] = useState<Category>("all");

  const filtered = useMemo(
    () =>
      cat === "all"
        ? products
        : products.filter((p) => p.category === cat),
    [cat]
  );

  return (
    <section id="shop" className="mx-auto max-w-7xl scroll-mt-16 px-4 pt-16 sm:px-6 sm:pt-24">
      <Rise>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              {t("shop_title")}
            </h2>
            <p className="mt-2 max-w-md text-[15px] opacity-70">{t("shop_sub")}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label={t("shop_title")}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className="tag-filter"
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
              >
                {t(catKey[c])}
              </button>
            ))}
          </div>
        </div>
      </Rise>

      <div className="grid grid-cols-2 border border-foreground/15 md:grid-cols-4 xl:grid-cols-6">
        {filtered.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} lang={lang} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
