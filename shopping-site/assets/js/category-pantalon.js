// =====================================================
// Urban Pulse - Données produits : Pantalon
// =====================================================
const products = [
  {
    id: 1,
    name: "Pantalon Urban Style",
    price: 49.99,
    category: "pantalon",
    image:
      "../../clothes/20250506_1433_Pantalon Urbain Marocain_simple_compose_01jtkdwwewf1ctweh05gave060.png",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Jeans Street Fashion",
    price: 59.99,
    category: "pantalon",
    image:
      "../../clothes/20250506_1433_Pantalon Urbain Marocain_simple_compose_01jtkdwwewf1ctweh05gave060.png",
    sizes: ["S", "M", "L", "XL"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  displayCategoryProducts(products, "productsGrid");
});
