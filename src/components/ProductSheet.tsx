import { useEffect, useState } from "react";
import type { CartItem, Lang, Product } from "@/types";
import { sizeLabel } from "@/data/products";
import { buildOrderMessage, whatsappUrl } from "@/lib/order";
import { makeT } from "@/i18n";
import { BlurUpImg } from "./ProductCard";

export function ProductSheet({
  product,
  lang,
  onClose,
  onAdd,
  onView3d,
}: {
  product: Product | null;
  lang: Lang;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
  onView3d: (p: Product) => void;
}) {
  const t = makeT(lang);
  const [sizeId, setSizeId] = useState<string>("m");
  const [qty, setQty] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (product) {
      setSizeId("m");
      setQty(1);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[1];
  const total = size.price * qty;

  const orderOne = () => {
    const msg = buildOrderMessage([{ slug: product.slug, sizeId, qty }], {
      name: "—",
      city: "—",
      address: t("order_details_in_chat"),
    }, lang);
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={product.name[lang]}
    >
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 max-h-[94dvh] overflow-y-auto border-t-2 border-foreground bg-background transition-transform duration-300 ease-out md:inset-y-0 md:left-auto md:w-[540px] md:border-l-2 md:border-t-0 ${
          visible ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-foreground/15 px-5 py-3">
          <span className="label-spec">{t("shop_title")}</span>
          <button
            type="button"
            onClick={onClose}
            className="border border-foreground/30 p-1.5 transition-colors hover:bg-foreground hover:text-background"
            aria-label={t("close")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-1">
          <div className="relative aspect-[2/3] max-h-[42dvh] w-full overflow-hidden border-b border-foreground/15 md:max-h-none">
            <BlurUpImg src={product.image} alt={product.name[lang]} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onView3d(product)}
              className="absolute bottom-3 end-3 flex items-center gap-2 bg-background/90 px-3 py-2 text-[12px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 7l9 5m0 0 9-5m-9 5v10" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {t("view_3d")}
            </button>
          </div>

          <div className="px-5 py-5">
            <h3 className="text-2xl font-black tracking-tight">{product.name[lang]}</h3>
            <p className="mt-2 text-[15px] leading-relaxed opacity-75">{product.desc[lang]}</p>

            <div className="mt-5">
              <p className="label-spec mb-2">{t("size_label")}</p>
              <div className="grid grid-cols-3 gap-px border border-foreground/15 bg-foreground/15">
                {product.sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sizeId === s.id}
                    onClick={() => setSizeId(s.id)}
                    className={`cursor-pointer bg-background px-2 py-3 text-center transition-colors ${
                      sizeId === s.id ? "bg-foreground text-background" : "hover:bg-secondary"
                    }`}
                  >
                    <span className="block text-[13px] font-bold">{sizeLabel(s, t("inch"))}</span>
                    <span className="block text-[12px] opacity-70">
                      {s.price} {lang === "ar" ? "د.م." : "MAD"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <p className="label-spec mb-2">{t("qty_label")}</p>
                <div className="flex items-stretch border border-foreground/30">
                  <button
                    type="button"
                    className="cursor-pointer px-4 py-2 text-lg font-bold transition-colors hover:bg-foreground hover:text-background disabled:opacity-30"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="−"
                  >
                    −
                  </button>
                  <span className="flex min-w-12 items-center justify-center border-x border-foreground/30 text-base font-bold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    className="cursor-pointer px-4 py-2 text-lg font-bold transition-colors hover:bg-foreground hover:text-background"
                    onClick={() => setQty((q) => Math.min(9, q + 1))}
                    aria-label="+"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-end">
                <p className="label-spec mb-1">{t("cart_total")}</p>
                <p className="text-2xl font-black tracking-tight">
                  {total} <span className="text-sm font-semibold opacity-60">{lang === "ar" ? "د.م." : "MAD"}</span>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button type="button" className="btn-gold w-full" onClick={orderOne}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .8-.2 1.5Z" />
                </svg>
                {t("order_now")}
              </button>
              <button
                type="button"
                className="btn-ghost w-full"
                onClick={() => {
                  onAdd({ slug: product.slug, sizeId, qty });
                  onClose();
                }}
              >
                {t("add_to_cart")}
              </button>
            </div>

            <div className="dotted-line my-5" />
            <p className="text-center text-[12.5px] opacity-60">{t("cart_note")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
