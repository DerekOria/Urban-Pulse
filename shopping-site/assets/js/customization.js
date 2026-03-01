// =====================================================
// Urban Pulse - 3D Product Customization
// Three.js + fabric.js integration
// =====================================================

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { TransformControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/TransformControls.js";

// ---- State ----
let canvas;
let productData;
let poloMaterial = null;
let scene, camera, renderer, controls;
let current3DObject = null;
let textPlane = null;
let transformControls = null;
let logoPlane = null;
let logoControls = null;
let isTextLocked = false;
let isLogoLocked = false;

// Prix des extras
const PRIX_TEXTE = 5.99;
const PRIX_LOGO = 9.99;

// Détection du chemin de base (pages/ -> racine du projet)
const BASE_PATH = "../";

const products = [
  { id: 1, name: "T-shirt", price: 19.99, model: "t-shirt" },
  { id: 2, name: "Pantalon", price: 29.99, model: "pantalon" },
  { id: 3, name: "Chaussures", price: 89.99, model: "chaussures" },
  { id: 4, name: "Casquette", price: 14.99, model: "casquette" },
  { id: 5, name: "Hoodie", price: 30.99, model: "hoodie" },
];

const productKeyMap = {
  tshirt: "T-shirt",
  pantalon: "Pantalon",
  chaussure: "Chaussures",
  casquette: "Casquette",
  hoodie: "Hoodie",
};

const reverseKeyMap = {
  "T-shirt": "tshirt",
  Pantalon: "pantalon",
  Chaussures: "chaussure",
  Casquette: "casquette",
  Hoodie: "hoodie",
};

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product") || 1;
  productData = products.find((p) => p.id == productId) || products[0];

  document.getElementById("productType").value =
    reverseKeyMap[productData.name] || "tshirt";
  updatePrice();
  load3DModel();
  initializeControls();

  document
    .getElementById("productType")
    .addEventListener("change", function () {
      const newProduct = products.find(
        (p) => p.name === productKeyMap[this.value],
      );
      if (newProduct) {
        productData = newProduct;
        if (textPlane) {
          scene.remove(textPlane);
          if (transformControls) {
            transformControls.detach();
            scene.remove(transformControls);
          }
          textPlane = null;
          transformControls = null;
        }
        update3DModel();
        updatePrice();
      }
    });

  // Bouton ajouter au panier
  document
    .getElementById("addToCartBtn")
    .addEventListener("click", ajouterAuPanier);
});

// ---- Price ----
function updatePrice() {
  let prixTotal = productData.price;
  if (textPlane) prixTotal += PRIX_TEXTE;
  if (logoPlane) prixTotal += PRIX_LOGO;
  document.getElementById("price").textContent = prixTotal.toFixed(2);
}

// ---- Sauvegarde personnalisation ----
function sauvegarderPersonnalisation() {
  return {
    produit: {
      id: productData.id,
      nom: productData.name,
      prixBase: productData.price,
    },
    texte: textPlane
      ? {
          contenu: document.getElementById("textInput").value,
          police: document.getElementById("fontSelect").value,
          couleur: document.getElementById("textColorPicker").value,
          position: textPlane.position.toArray(),
          rotation: textPlane.rotation.toArray(),
          echelle: textPlane.scale.toArray(),
        }
      : null,
    logo: logoPlane
      ? {
          position: logoPlane.position.toArray(),
          rotation: logoPlane.rotation.toArray(),
          echelle: logoPlane.scale.toArray(),
        }
      : null,
    couleurProduit: poloMaterial ? poloMaterial.color.getHexString() : null,
    prixTotal: parseFloat(document.getElementById("price").textContent),
  };
}

// ---- Panier ----
function ajouterAuPanier() {
  const personnalisation = sauvegarderPersonnalisation();

  fetch(BASE_PATH + "api/cart/add.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: personnalisation.produit.nom + " personnalisé",
      price: personnalisation.prixTotal,
      quantity: 1,
      personnalisation: JSON.stringify(personnalisation),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Produit personnalisé ajouté au panier !");
      } else {
        alert(
          "Erreur : " + (data.message || "Erreur lors de l'ajout au panier"),
        );
      }
    })
    .catch((err) => {
      console.error("Erreur:", err);
      alert("Erreur de connexion au serveur.");
    });
}

// ---- Controls Init ----
function initializeControls() {
  const textInput = document.getElementById("textInput");
  const fontSelect = document.getElementById("fontSelect");
  const textColorPicker = document.getElementById("textColorPicker");

  function createTextTexture(text, font, color) {
    const cnv = document.createElement("canvas");
    cnv.width = 512;
    cnv.height = 256;
    const ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = color;
    ctx.font = `bold 48px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cnv.width / 2, cnv.height / 2);
    return new THREE.CanvasTexture(cnv);
  }

  function updateTextOnModel() {
    const text = textInput.value.trim();
    const font = fontSelect.value;
    const color = textColorPicker.value;
    if (!text) return;

    const texture = createTextTexture(text, font, color);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    if (!textPlane) {
      const geometry = new THREE.PlaneGeometry(1.0, 0.5);
      textPlane = new THREE.Mesh(geometry, material);
      textPlane.position.set(0, 0.2, 0.1);
      scene.add(textPlane);

      transformControls = new TransformControls(camera, renderer.domElement);
      transformControls.attach(textPlane);
      scene.add(transformControls);
      transformControls.setMode("translate");

      transformControls.addEventListener("dragging-changed", function (event) {
        controls.enabled = !event.value;
        if (!event.value) updatePrice();
      });
    } else {
      textPlane.material.map.dispose();
      textPlane.material.map = texture;
      textPlane.material.needsUpdate = true;
    }
    updatePrice();
  }

  // Text events
  document
    .getElementById("addTextBtn")
    .addEventListener("click", updateTextOnModel);
  textInput.addEventListener("input", updateTextOnModel);
  fontSelect.addEventListener("change", updateTextOnModel);
  textColorPicker.addEventListener("input", updateTextOnModel);

  // Color picker
  document.getElementById("customColor").addEventListener("input", (e) => {
    if (poloMaterial) {
      poloMaterial.color.set(e.target.value);
    }
  });

  // Logo upload
  const addLogoBtn = document.getElementById("addLogoBtn");
  const logoInput = document.getElementById("logoInput");

  addLogoBtn.addEventListener("click", () => logoInput.click());

  logoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const cnv = document.createElement("canvas");
        cnv.width = 512;
        cnv.height = 512;
        const ctx = cnv.getContext("2d");
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

        const texture = new THREE.CanvasTexture(cnv);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });

        if (logoPlane) {
          scene.remove(logoPlane);
          logoPlane.geometry.dispose();
          logoPlane.material.dispose();
        }

        const geometry = new THREE.PlaneGeometry(1, 1);
        logoPlane = new THREE.Mesh(geometry, material);
        logoPlane.position.set(0, 0.2, 0.9);
        scene.add(logoPlane);

        if (logoControls) {
          scene.remove(logoControls);
          logoControls.dispose?.();
        }

        logoControls = new TransformControls(camera, renderer.domElement);
        logoControls.attach(logoPlane);
        scene.add(logoControls);

        logoControls.addEventListener("dragging-changed", function (event) {
          controls.enabled = !event.value;
          if (!event.value) updatePrice();
        });

        updatePrice();
      };
      img.onerror = () => alert("Erreur lors du chargement du logo.");
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---- Global transform functions ----
window.setTransformMode = function (mode) {
  if (transformControls) transformControls.setMode(mode);
};

window.setLogoTransformMode = function (mode) {
  if (logoControls) logoControls.setMode(mode);
};

window.resetTextPosition = function () {
  if (textPlane) {
    textPlane.position.set(0, 0.2, 0.8);
    textPlane.rotation.set(0, 0, 0);
    textPlane.scale.set(1, 1, 1);
  }
};

window.toggleLockText = function () {
  if (!transformControls || !textPlane) return;
  isTextLocked = !isTextLocked;
  isTextLocked
    ? transformControls.detach()
    : transformControls.attach(textPlane);
};

window.deleteLogo = function () {
  if (logoPlane && logoControls) {
    logoControls.detach();
    scene.remove(logoPlane);
    scene.remove(logoControls);
    logoPlane.geometry.dispose();
    logoPlane.material.dispose();
    logoPlane = null;
    logoControls = null;
    updatePrice();
  }
};

window.toggleLocklogoPlane = function () {
  if (!logoControls || !logoPlane) return;
  isLogoLocked = !isLogoLocked;
  isLogoLocked ? logoControls.detach() : logoControls.attach(logoPlane);
};

// ---- 3D Scene ----
function load3DModel() {
  const container = document.getElementById("container3D");
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  camera.position.set(0, 1, 2);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500);
  scene.add(topLight);

  update3DModel();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (transformControls) transformControls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function update3DModel() {
  const loader = new GLTFLoader();

  loader.load(
    `${BASE_PATH}models/${productData.model}/scene.gltf`,
    (gltf) => {
      if (current3DObject) scene.remove(current3DObject);
      const object = gltf.scene;
      object.position.set(0, -3.8, 0);
      object.scale.set(3.0, 3.0, 3.0);
      scene.add(object);
      current3DObject = object;

      object.traverse((child) => {
        if (child.isMesh && child.material) {
          poloMaterial = child.material;
        }
      });
    },
    undefined,
    (error) => console.error("Erreur chargement 3D:", error),
  );
}
