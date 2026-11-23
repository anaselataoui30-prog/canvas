export const STORE = {
  // ☎️ EDIT ME: your WhatsApp number in international format, digits only.
  // Morocco example: "212612345678" (= +212 6 12 34 56 78)
  whatsappNumber: "212612345678",

  name: { ar: "لوحة", fr: "Toile" },
  tagline: {
    ar: "لوحات فنية تُطبع عند الطلب، من الدار إلى جدارك",
    fr: "Des œuvres imprimées à la demande, de l'atelier à votre mur",
  },
  city: "Casablanca",
  country: { ar: "المغرب", fr: "Maroc" },

  currency: { ar: "د.م.", fr: "MAD" },

  // Cash on delivery
  deliveryFee: 30,
  freeDeliveryOver: 600,
  cities: [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
    "Kénitra",
    "Tétouan",
    "Salé",
    "Mohammedia",
    "El Jadida",
    "Nador",
    "Béni Mellal",
    "Mohammédia",
    "Essaouira",
    "Chefchaouen",
  ],

  instagram: "", // e.g. "https://instagram.com/yourstore" — empty hides the icon
} as const;
