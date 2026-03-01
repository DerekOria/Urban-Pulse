// =====================================================
// Urban Pulse - Données produits : Chaussures
// =====================================================
const products = [
  {
    id: 1,
    name: "Chaussures Marocaines Streetwear",
    price: 79.99,
    category: "chaussures",
    image:
      "../../clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbgekv83qchn5z5nkpq (1).png",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
  {
    id: 2,
    name: "Sneakers Urban Design",
    price: 89.99,
    category: "chaussures",
    image:
      "../../clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbgekv83qchn5z5nkpq (1).png",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  displayCategoryProducts(products, "productsGrid");
});
