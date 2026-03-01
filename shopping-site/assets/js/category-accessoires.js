// =====================================================
// Urban Pulse - Données produits : Accessoires
// =====================================================
const products = [
  {
    id: 1,
    name: "Casquette Urban Zellige",
    price: 30.0,
    category: "accessoires",
    image: "../../clothes/CasquetteUrban.webp",
    sizes: ["Unique"],
  },
  {
    id: 2,
    name: "Lunettes Sahara Shade",
    price: 45.0,
    category: "accessoires",
    image: "../../clothes/lunetteUrbanshade.webp",
    sizes: ["Unique"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  displayCategoryProducts(products, "productsGrid");
});
