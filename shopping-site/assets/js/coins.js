// =====================================================
// Urban Pulse - Gestion de Coins
// Carga y muestra los coins del usuario loggeado
// SIN polling agresivo - solo se actualiza al cargar
// =====================================================

const Coins = {
  getApiBase() {
    const path = window.location.pathname;
    if (path.includes("/pages/categories/")) {
      return "../../api";
    }
    if (path.includes("/pages/")) {
      return "../api";
    }
    return "api";
  },

  fetchAndDisplay() {
    const apiBase = this.getApiBase();
    fetch(`${apiBase}/user/get.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          this.updateDisplay(data.user.coins);
        }
      })
      .catch((err) => {
        console.error("Erreur coins:", err);
      });
  },

  updateDisplay(coins) {
    const el = document.getElementById("coinHeader");
    if (el) el.textContent = coins;

    const dashCoins = document.getElementById("dashboard-coins");
    if (dashCoins) dashCoins.textContent = coins + " coins";
  },

  // Forzar actualizacion despues de una accion
  forceRefresh() {
    return this.fetchAndDisplay();
  },
};

// Exponer globalmente
window.Coins = Coins;
