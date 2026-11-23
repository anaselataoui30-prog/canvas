import { useEffect, useState } from "react";
import { STORE } from "@/config";
import type { CartItem, Lang } from "@/types";
import { findProduct, sizeLabel } from "@/data/products";
import { buildOrderMessage, cartSubtotal, deliveryFee, whatsappUrl } from "@/lib/order";
import { makeT } from "@/i18n";

export function CartDrawer({
  lang,
  items,
  onClose,
  onRemove,
  onQty,
  onBrowse,
}: {
  lang: Lang;
  items: CartItem[];
  onClose: () => void;
  onRemove: (i: number) => void;
  onQty: (i: number, qty: number) => void;
  onBrowse: () => void;
}) {
  const t = makeT(lang);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState<string>(STORE.cities[0]);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(subtotal);
  const money = (n: number) => `${n} ${lang === "ar" ? "د.م." : "MAD"}`;

  const checkout = () => {
    if (!name.trim() || !address.trim()) {
      setError(true);
      return;
    }
    setError(false);
    const msg = buildOrderMessage(items, { name: name.trim(), city, address: address.trim() }, lang);
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("cart_title")}>
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute bottom-0 left-0 right-0 flex max-h-[94dvh] flex-col border-t-2 border-foreground bg-background transition-transform duration-300 ease-out md:inset-y-0 md:left-auto md:w-[460px] md:border-l-2 md:border-t-0 ${
          visible ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-foreground/15 px-5 py-3">
          <span className="label-spec">{t("cart_title")}</span>
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <p className="opacity-60">{t("cart_empty")}</p>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  onClose();
                  onBrowse();
                }}
              >
                {t("cart_empty_cta")}
              </button>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-foreground/10">
                {items.map((it, i) => {
                  const p = findProduct(it.slug);
                  const s = p?.sizes.find((x) => x.id === it.sizeId);
                  if (!p || !s) return null;
                  return (
                    <li key={`${it.slug}-${it.sizeId}`} className="flex gap-4 py-4">
                      <img src={p.image} alt={p.name[lang]} className="h-24 w-16 shrink-0 border border-foreground/15 object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{p.name[lang]}</p>
                        <p className="label-spec mt-0.5">{sizeLabel(s, t("inch"))}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-stretch border border-foreground/25">
                            <button type="button" className="cursor-pointer px-2.5 py-0.5 font-bold hover:bg-foreground hover:text-background disabled:opacity-30" disabled={it.qty <= 1} onClick={() => onQty(i, it.qty - 1)} aria-label="−">−</button>
                            <span className="min-w-8 border-x border-foreground/25 text-center text-sm font-bold leading-6">{it.qty}</span>
                            <button type="button" className="cursor-pointer px-2.5 py-0.5 font-bold hover:bg-foreground hover:text-background disabled:opacity-30" disabled={it.qty >= 9} onClick={() => onQty(i, it.qty + 1)} aria-label="+">+</button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="cursor-pointer text-[12px] underline opacity-50 transition-opacity hover:opacity-100"
                          >
                            {t("close")}
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold">{money(s.price * it.qty)}</p>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5">
                <p className="label-spec mb-3">{t("your_name")}</p>
                <input className="input-line" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("your_name")} autoComplete="name" />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="label-spec mb-2">{t("your_city")}</p>
                    <select className="input-line cursor-pointer bg-background" value={city} onChange={(e) => setCity(e.target.value)}>
                      {STORE.cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="label-spec mb-2">{t("your_address")}</p>
                    <input className="input-line" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t("your_address")} autoComplete="street-address" />
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm font-semibold text-destructive">{t("form_required")}</p>
                )}
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-foreground/15 px-5 py-4">
            <div className="flex justify-between text-sm">
              <span className="opacity-60">{t("cart_total")}</span>
              <span className="font-bold">{money(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm">
              <span className="opacity-60">{t("cart_delivery")}</span>
              <span className="font-bold">{fee === 0 ? t("cart_free") : money(fee)}</span>
            </div>
            <div className="dotted-line my-3" />
            <div className="flex justify-between text-lg font-black">
              <span>{t("cart_total")}</span>
              <span>{money(subtotal + fee)}</span>
            </div>
            <button type="button" className="btn-gold mt-4 w-full" onClick={checkout}>
              {t("cart_checkout")}
            </button>
            <p className="mt-2.5 text-center text-[12.5px] opacity-60">{t("cart_note")}</p>
          </div>
        )}
      </aside>
    </div>
  );
}
