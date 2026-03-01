// =====================================================
// Urban Pulse - Detalle de producto
// =====================================================

function getProduitBasePath() {
  const path = window.location.pathname;
  if (path.includes("/pages/categories/")) return "../..";
  if (path.includes("/pages/")) return "..";
  return ".";
}

const PROD_BASE = getProduitBasePath();

const allProducts = [
  {
    id: 1,
    name: "T-shirt Urban Pulse Design",
    price: 29.99,
    image:
      PROD_BASE +
      "/clothes/20250503_1656_T-shirts Urban Pulse_simple_compose_01jtbywsbff2msb5gwaj99ygnj.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "T-shirt Urban Style",
    price: 34.99,
    image:
      PROD_BASE +
      "/clothes/20250503_1700_T-shirts Urban Pulse_simple_compose_01jtbz3b19ejracw6c29yqczy9.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Hoodies Urbains Marocains",
    price: 49.99,
    image:
      PROD_BASE +
      "/clothes/20250506_1418_Hoodies Urbains Marocains_simple_compose_01jtkd01vge4h9szvfkjkj3c91.png",
    category: "vetements-haut",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Pantalon Urbain Marocain",
    price: 44.99,
    image:
      PROD_BASE +
      "/clothes/20250506_1433_Pantalon Urbain Marocain_simple_compose_01jtkdwwewf1ctweh05gave060.png",
    category: "pantalon",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 5,
    name: "Chaussures Marocaines Streetwear",
    price: 79.99,
    image:
      PROD_BASE +
      "/clothes/20250503_1703_Chaussures Marocaines Streetwear_simple_compose_01jtbz9m9hfy890xn51wpy1aya.png",
    category: "chaussures",
    sizes: ["38", "39", "40", "41", "42", "43"],
  },
  {
    id: 6,
    name: "Casquette Urban",
    price: 24.99,
    image: PROD_BASE + "/clothes/CasquetteUrban.webp",
    category: "accessoires",
    sizes: ["Unique"],
  },
  {
    id: 7,
    name: "Lunettes Urban Shade",
    price: 44.99,
    image: PROD_BASE + "/clothes/lunetteUrbanshade.webp",
    category: "accessoires",
    sizes: ["Unique"],
  },
];

function getProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const category = urlParams.get("category");

  const product = allProducts.find(
    (p) => p.id === productId && p.category === category,
  );

  if (!product) {
    document.getElementById("productContainer").innerHTML =
      '<h2 style="color: #00f5ff; text-align: center;">Produit non trouvé</h2>';
    return;
  }

  const productContainer = document.getElementById("productContainer");
  const sizeOptions = product.sizes
    .map((size) => `<option value="${size}">${size}</option>`)
    .join("");

  productContainer.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
            <h2 class="product-title">${product.name}</h2>
            <p class="product-price">${product.price.toFixed(2)} $</p>
            
            <div class="size-selector">
                <label for="size">Taille :</label>
                <select id="size" name="size">
                    ${sizeOptions}
                </select>
            </div>
            
            <div class="quantity-selector">
                <label for="quantity">Quantité :</label>
                <input type="number" id="quantity" name="quantity" value="1" min="1" max="10">
            </div>

            <button class="add-to-cart-btn" onclick="addToCart()">Ajouter au panier</button>
        </div>
    `;
}

function addToCart() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const product = allProducts.find((p) => p.id === productId);

  const size = document.getElementById("size").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!product || !size || quantity < 1) {
    alert("Erreur : Veuillez sélectionner une taille et une quantité valide.");
    return;
  }

  fetch(PROD_BASE + "/api/cart/add.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: product.name,
      price: product.price,
      size: size,
      quantity: quantity,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert(
          `${product.name} (Taille: ${size}, Quantité: ${quantity}) a été ajouté au panier !`,
        );
      } else {
        alert("Erreur : " + data.message);
      }
    });
}

document.addEventListener("DOMContentLoaded", getProductDetails);
