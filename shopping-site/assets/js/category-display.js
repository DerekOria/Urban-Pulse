// =====================================================
// Urban Pulse - Category Products Display
// Reutilizable para todas las paginas de categoria
// =====================================================

function displayCategoryProducts(products, gridId) {
  const productGrid = document.getElementById(gridId || "productsGrid");
  if (!productGrid) return;
  productGrid.innerHTML = "";

  products.forEach((product) => {
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
      fetch("../../api/cart/add.php", {
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
        window.location.href = `../product.html?id=${product.id}&category=${product.category}`;
      }
    });

    productGrid.appendChild(productElement);
  });
}

// Exponer globalmente
window.displayCategoryProducts = displayCategoryProducts;
