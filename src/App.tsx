import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import type { CartItem, Lang, Product } from "@/types";
import { PRODUCTS } from "@/data/products";
import { Header } from "@/components/Header";
import { Catalog } from "@/components/Catalog";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { ProductSheet } from "@/components/ProductSheet";
import { CartDrawer } from "@/components/CartDrawer";
import { BlurUpImg } from "@/components/ProductCard";

const Hero3D = lazy(() =>
  import("@/components/Hero3D").then((m) => ({ default: m.Hero3D }))
);
const WallPreview = lazy(() =>
  import("@/components/WallPreview").then((m) => ({ default: m.WallPreview }))
);

const CART_KEY = "toile-cart-v1";
const LANG_KEY = "toile-lang";

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem(LANG_KEY) === "fr" ? "fr" : "ar")
  );
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string>(PRODUCTS[0].slug);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.slug === item.slug && x.sizeId === item.sizeId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(9, next[i].qty + item.qty) };
        return next;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }, []);

  const previewProduct = useMemo(
    () => PRODUCTS.find((p) => p.slug === previewSlug) ?? PRODUCTS[0],
    [previewSlug]
  );

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const cartCount = cart.reduce((n, it) => n + it.qty, 0);

  return (
    <div className="min-h-[100dvh]">
      <div className="grain" aria-hidden="true" />
      <Header
        lang={lang}
        onLang={setLang}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <Suspense
          fallback={
            <section className="flex min-h-[100dvh] items-end px-4 pb-16 pt-24 sm:px-6">
              <div className="dotted-line w-full" />
            </section>
          }
        >
          <Hero3D
            lang={lang}
            onBrowse={() => scrollTo("shop")}
            onTry3d={() => scrollTo("preview")}
          />
        </Suspense>
        <Catalog lang={lang} onOpen={setOpenProduct} />
        <Suspense
          fallback={
            <section id="preview" className="scroll-mt-14 bg-foreground py-14 text-background">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-background/20 sm:aspect-[16/9]">
                  <BlurUpImg
                    src={previewProduct.image}
                    alt={previewProduct.name[lang]}
                    className="h-full w-full object-cover opacity-60"
                  />
                </div>
              </div>
            </section>
          }
        >
          <WallPreview
            lang={lang}
            product={previewProduct}
            onSelect={(p) => setPreviewSlug(p.slug)}
          />
        </Suspense>
        <HowItWorks lang={lang} />
      </main>

      <Footer lang={lang} onOpenCart={() => setCartOpen(true)} />

      <ProductSheet
        product={openProduct}
        lang={lang}
        onClose={() => setOpenProduct(null)}
        onAdd={addToCart}
        onView3d={(p) => {
          setPreviewSlug(p.slug);
          setOpenProduct(null);
          requestAnimationFrame(() => scrollTo("preview"));
        }}
      />

      {cartOpen && (
        <CartDrawer
          lang={lang}
          items={cart}
          onClose={() => setCartOpen(false)}
          onRemove={(i) => setCart((p) => p.filter((_, x) => x !== i))}
          onQty={(i, q) =>
            setCart((p) => p.map((it, x) => (x === i ? { ...it, qty: q } : it)))
          }
          onBrowse={() => scrollTo("shop")}
        />
      )}
    </div>
  );
}
