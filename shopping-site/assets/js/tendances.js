// =====================================================
// Urban Pulse - Productos Tendencia
// =====================================================

function getBasePath() {
  const path = window.location.pathname;
  if (path.includes("/pages/categories/")) return "../..";
  if (path.includes("/pages/")) return "..";
  return ".";
}

const BASE = getBasePath();

const trendingProducts = [
  {
    id: 1,
    name: "T-shirt Urban Pulse Design",
    price: 29.99,
    image:
      BASE +
      "/clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbff2msb5gwaj99ygnj.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "T-shirt Urban Style",
    price: 34.99,
    image:
      BASE +
      "/clothes/20250503_1700_T-shirts Urban Pulse_simple_compose_01jtbz3b19ejracw6c29yqczy9.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Hoodies Urbains Marocains",
    price: 49.99,
    image:
      BASE +
      "/clothes/20250506_1418_Hoodies Urbains Marocains_simple_compose_01jtkd01vge4h9szvfkjkj3c91.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Pantalon Urbain Marocain",
    price: 44.99,
    image:
      BASE +
      "/clothes/20250506_1433_Pantalon Urbain Marocain_simple_compose_01jtkdwwewf1ctweh05gave060.png",
    category: "pantalon",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Chaussures Marocaines Streetwear",
    price: 79.99,
    image:
      BASE +
      "/clothes/20250503_1703_Chaussures Marocaines Streetwear_simple_compose_01jtbz9m9hfy890xn51wpy1aya.png",
    category: "chaussures",
    sizes: ["38", "39", "40", "41", "42", "43"],
  },
  {
    id: 6,
    name: "Casquette Urban",
    price: 24.99,
    image: BASE + "/clothes/CasquetteUrban.webp",
    category: "accessoires",
    sizes: ["Unique"],
  },
  {
    id: 7,
    name: "Lunettes Urban Shade",
    price: 44.99,
    image: BASE + "/clothes/lunetteUrbanshade.webp",
    category: "accessoires",
    sizes: ["Unique"],
  },
];

function displayTrendingProducts() {
  const trendingGrid = document.getElementById("trendingGrid");
  if (!trendingGrid) return;
  trendingGrid.innerHTML = "";

  trendingProducts.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("item-card");
    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="item-details">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toFixed(2)} $</p>
                <button class="ajouter-panier-btn">Ajouter au panier</button>
            </div>
        `;

    const addToCartButton = productElement.querySelector(".ajouter-panier-btn");
    addToCartButton.addEventListener("click", (e) => {
      e.stopPropagation();
      fetch(BASE + "/api/cart/add.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          quantity: 1,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert(`${product.name} a été ajouté au panier !`);
          } else {
            alert("Erreur : " + data.message);
          }
        });
    });

    productElement.addEventListener("click", (e) => {
      if (!e.target.classList.contains("ajouter-panier-btn")) {
        window.location.href =
          BASE +
          `/pages/product.html?id=${product.id}&category=${product.category}`;
      }
    });

    trendingGrid.appendChild(productElement);
  });
}

document.addEventListener("DOMContentLoaded", displayTrendingProducts);
