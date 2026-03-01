// =====================================================
// Urban Pulse - Données produits : Vêtements Haut
// =====================================================
const products = [
  {
    id: 1,
    name: "T-shirt Urban Pulse Design",
    price: 29.99,
    category: "vetements-haut",
    image:
      "../../clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbff2msb5gwaj99ygnj.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "T-shirt Urban Style",
    price: 34.99,
    category: "vetements-haut",
    image:
      "../../clothes/20250503_1700_T-shirts Urban Pulse_simple_compose_01jtbz3b19ejracw6c29yqczy9.png",
    sizes: ["S", "M", "L", "XL"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  displayCategoryProducts(products, "productsGrid");
});
