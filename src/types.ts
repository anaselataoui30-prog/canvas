export type Lang = "ar" | "fr";

export interface SizeOption {
  id: string;
  /** physical size in cm */
  w: number;
  h: number;
  price: number; // MAD
}

export interface Product {
  slug: string;
  name: Record<Lang, string>;
  desc: Record<Lang, string>;
  category: "landscapes" | "patterns" | "minimal" | "cities";
  image: string;
  sizes: SizeOption[];
  badge?: "new" | "bestseller";
}

export interface CartItem {
  slug: string;
  sizeId: string;
  qty: number;
}
