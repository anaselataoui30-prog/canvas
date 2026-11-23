import { STORE } from "@/config";
import type { CartItem, Lang } from "@/types";
import { findProduct, sizeLabel } from "@/data/products";
import { makeT } from "@/i18n";

function money(amount: number, lang: Lang): string {
  return lang === "ar" ? `${amount} ${STORE.currency.ar}` : `${amount} ${STORE.currency.fr}`;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, it) => {
    const p = findProduct(it.slug);
    const s = p?.sizes.find((x) => x.id === it.sizeId);
    return sum + (s ? s.price * it.qty : 0);
  }, 0);
}

export function deliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= STORE.freeDeliveryOver) return 0;
  return STORE.deliveryFee;
}

interface Customer {
  name: string;
  city: string;
  address: string;
}

export function buildOrderMessage(
  items: CartItem[],
  customer: Customer,
  lang: Lang
): string {
  const t = makeT(lang);
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;
  const lines: string[] = [t("order_msg_head"), ""];

  items.forEach((it, i) => {
    const p = findProduct(it.slug);
    const s = p?.sizes.find((x) => x.id === it.sizeId);
    if (!p || !s) return;
    lines.push(
      `${i + 1}) ${t("order_msg_item")} « ${p.name[lang]} »`,
      `   ${t("order_msg_size")}: ${sizeLabel(s, t("inch"))} — ${money(s.price, lang)} × ${it.qty}`
    );
  });

  lines.push(
    "",
    `${t("order_msg_total")}: ${money(total, lang)}${fee === 0 ? ` (${t("cart_free")})` : ""}`,
    "",
    `${t("order_msg_name")}: ${customer.name}`,
    `${t("order_msg_city")}: ${customer.city}`,
    `${t("order_msg_address")}: ${customer.address}`,
    "",
    t("order_msg_tail")
  );

  return lines.join("\n");
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
