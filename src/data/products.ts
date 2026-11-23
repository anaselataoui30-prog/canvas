import type { Product } from "@/types";

const SIZES = [
  { id: "s", w: 30, h: 40, price: 249 },
  { id: "m", w: 50, h: 70, price: 449 },
  { id: "l", w: 70, h: 100, price: 699 },
];

export const PRODUCTS: Product[] = [
  {
    slug: "dunes",
    name: { ar: "كثبان الفجر", fr: "Dunes de l'aube" },
    desc: {
      ar: "كثبان الصحراء عند أول الضوء، ظلال طويلة وشجرة أركان وحيدة على قمة بعيدة.",
      fr: "Les dunes du Sahara à la première lumière, ombres longues et arganier solitaire sur une crête lointaine.",
    },
    category: "landscapes",
    image: "/art/dunes.jpg",
    sizes: SIZES,
    badge: "bestseller",
  },
  {
    slug: "zellige",
    name: { ar: "نجمة الزليج", fr: "Étoile de zellige" },
    desc: {
      ar: "نجمة ثمانية من الزليج المغربي بأيدي حرفيين — أزرق نيلي، تيراكوتا وذهب.",
      fr: "Étoile à huit branches de zellige marocain fait main — indigo, terre cuite et or.",
    },
    category: "patterns",
    image: "/art/zellige.jpg",
    sizes: SIZES,
  },
  {
    slug: "door",
    name: { ar: "باب مراكش", fr: "Porte de Marrakech" },
    desc: {
      ar: "باب رياض عتيق بلون أزرق الشباب ومسامير نحاسية تحت شمس الظهيرة.",
      fr: "Vieille porte de riad bleu patiné, clous de laiton sous le soleil de midi.",
    },
    category: "cities",
    image: "/art/door.jpg",
    sizes: SIZES,
  },
  {
    slug: "essaouira",
    name: { ar: "مراكب الصويرة", fr: "Barques d'Essaouira" },
    desc: {
      ar: "قوارب الصيد الزرقاء في ميناء الصويرة، انعكاسات هادئة وضباب الأطلسي.",
      fr: "Barques bleues du port d'Essaouira, reflets calmes et brume atlantique.",
    },
    category: "cities",
    image: "/art/essaouira.jpg",
    sizes: SIZES,
  },
  {
    slug: "atlas",
    name: { ar: "أطلس الغسق", fr: "Atlas au crépuscule" },
    desc: {
      ar: "سلاسل الأطلس الكبير عند الغروب، طبقات من الليلك والبرقوق تحت آخر ضوء كهرماني.",
      fr: "Les crêtes du Haut Atlas au crépuscule, couches indigo et prune sous le dernier soleil ambré.",
    },
    category: "landscapes",
    image: "/art/atlas.jpg",
    sizes: SIZES,
  },
  {
    slug: "toubkal",
    name: { ar: "قمة توبقال", fr: "Sommet du Toubkal" },
    desc: {
      ar: "قمم توبقال الثلجية في أبسط صورها — هرم واحد وسماء واسعة.",
      fr: "Le Toubkal dans sa forme la plus pure — une pyramide de neige et un ciel immense.",
    },
    category: "minimal",
    image: "/art/toubkal.jpg",
    sizes: SIZES,
    badge: "new",
  },
  {
    slug: "tannery",
    name: { ar: "دباغة فاس", fr: "Tanneries de Fès" },
    desc: {
      ar: "أوعية صبغ فاس من الأعلى — زعفران، تيراكوتا، نيلي ومريمية.",
      fr: "Les cuves de teinture de Fès vues du ciel — safran, terre cuite, indigo et sauge.",
    },
    category: "cities",
    image: "/art/tannery.jpg",
    sizes: SIZES,
  },
  {
    slug: "caravan",
    name: { ar: "القافلة", fr: "La caravane" },
    desc: {
      ar: "قافلة جمال عند الساعة الذهبية، خطوط رفيعة تعبر فضاءً من الرمل.",
      fr: "Une caravane à l'heure dorée, fines silhouettes traversant un océan de sable.",
    },
    category: "minimal",
    image: "/art/caravan.jpg",
    sizes: SIZES,
  },
  {
    slug: "chefchaouen",
    name: { ar: "زقاق شفشاون", fr: "Ruelle de Chefchaouen" },
    desc: {
      ar: "أزقة شفشاون الزرقاء، درجات من السماوي والكوبلت ونبتات خضراء.",
      fr: "Les ruelles bleues de Chefchaouen, du céruléen au cobalt, plantes vertes en pot.",
    },
    category: "cities",
    image: "/art/chefchaouen.jpg",
    sizes: SIZES,
    badge: "bestseller",
  },
  {
    slug: "teatime",
    name: { ar: "وقت الشاي", fr: "L'heure du thé" },
    desc: {
      ar: "إبريق فضي يصب الشاي المنعنع في أكواب ملوّنة — لحظة مغربية خالصة.",
      fr: "Théière d'argent versant le thé à la menthe dans des verres colorés — un pur moment marocain.",
    },
    category: "minimal",
    image: "/art/teatime.jpg",
    sizes: SIZES,
  },
];

export const CATEGORIES = [
  "all",
  "landscapes",
  "patterns",
  "minimal",
  "cities",
] as const;
export type Category = (typeof CATEGORIES)[number];

export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function sizeLabel(size: { w: number; h: number }, unit: string) {
  return `${size.w}×${size.h} ${unit}`;
}
