// =====================================================
// Urban Pulse - Navbar compartida
// Se inyecta dinamicamente en todas las paginas
// =====================================================

const NavBar = {
  // Detectar la profundidad del archivo actual respecto a la raiz del proyecto
  getBasePath() {
    const path = window.location.pathname;
    // pages/categories/ -> 2 niveles de profundidad
    if (path.includes("/pages/categories/")) {
      return "../..";
    }
    // pages/ -> 1 nivel de profundidad
    if (path.includes("/pages/")) {
      return "..";
    }
    // raiz
    return ".";
  },

  render() {
    const base = this.getBasePath();
    const header = document.querySelector("header");
    if (!header) return;

    header.innerHTML = `
            <nav>
                <div class="logo"><a href="${base}/index.html">Urban Pulse</a></div>
                <ul>
                    <li class="nav-coins">💰 <span id="coinHeader">0</span> coins</li>
                    <li><a href="${base}/index.html">Accueil</a></li>
                    <li><a href="${base}/pages/trends.html">Tendances</a></li>
                    <li><a href="${base}/pages/categories.html">Catégories</a></li>
                    <li><a href="${base}/pages/box.html">Box Surprise</a></li>
                    <li><a href="${base}/pages/account.html">Mon Compte</a></li>
                    <li><a href="${base}/pages/cart.html">Panier</a></li>
                    <li><a href="${base}/pages/customize.html">Personnalisation</a></li>
                    <li><a href="${base}/pages/coins.html">Coins</a></li>
                </ul>
            </nav>
        `;
  },

  init() {
    this.render();
    // Charger les coins de l'utilisateur
    if (typeof Coins !== "undefined") {
      Coins.fetchAndDisplay();
    }
  },
};

document.addEventListener("DOMContentLoaded", () => NavBar.init());
