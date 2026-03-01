// =====================================================
// Urban Pulse - Pagina de categorias
// =====================================================

const categories = [
  {
    id: 1,
    name: "Vêtements Haut",
    image:
      "../clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbff2msb5gwaj99ygnj.png",
    link: "categories/vetements-haut.html",
  },
  {
    id: 2,
    name: "Pantalon",
    image:
      "../clothes/20250506_1433_Pantalon Urbain Marocain_simple_compose_01jtkdwwewf1ctweh05gave060.png",
    link: "categories/pantalon.html",
  },
  {
    id: 3,
    name: "Chaussures",
    image:
      "../clothes/20250503_1703_Chaussures Marocaines Streetwear_simple_compose_01jtbz9m9hfy890xn51wpy1aya.png",
    link: "categories/chaussures.html",
  },
  {
    id: 4,
    name: "Accessoires",
    image: "../clothes/CasquetteUrban.webp",
    link: "categories/accessoires.html",
  },
];

function displayCategories() {
  const categoryGrid = document.getElementById("categoryGrid");
  if (!categoryGrid) return;
  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const card = document.createElement("div");
    card.classList.add("category-card");
    card.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <div class="category-info">
                <h2>${category.name}</h2>
                <button class="explore-btn">Explorer</button>
            </div>
        `;
    card.addEventListener("click", () => {
      window.location.href = category.link;
    });
    categoryGrid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", displayCategories);
