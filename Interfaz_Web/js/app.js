// REGISTRO
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Registrado");
    window.location.href = "index.html";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (user && email === user.email && password === user.password) {
      window.location.href = "dashboard.html";
    } else {
      alert("Error");
    }
  });
}

console.log("🎧 VinylMarket Dashboard cargado");

// ===============================
// 🔧 ESTADO GLOBAL DE LA APP
// ===============================

let userRole = "buyer"; 
// buyer = comprador (default)
// seller = vendedor

// ===============================
// 📚 SIDEBARS (OPEN / CLOSE)
// ===============================

// 🔵 SIDEBAR IZQUIERDA
const sidebarLeft = document.getElementById("sidebarLeft");
const openSidebarLeft = document.getElementById("openSidebarLeft");
const closeSidebarLeft = document.getElementById("closeSidebarLeft");

// 🔵 SIDEBAR DERECHA
const sidebarRight = document.getElementById("sidebarRight");
const openSidebarRight = document.getElementById("openSidebarRight");
const closeSidebarRight = document.getElementById("closeSidebarRight");


// ===============================
// 👉 ABRIR / CERRAR SIDEBAR IZQ
// ===============================
openSidebarLeft.addEventListener("click", () => {
  sidebarLeft.classList.add("active");
});

closeSidebarLeft.addEventListener("click", () => {
  sidebarLeft.classList.remove("active");
});


// ===============================
// 👉 ABRIR / CERRAR SIDEBAR DCHA
// ===============================
openSidebarRight.addEventListener("click", () => {
  sidebarRight.classList.add("active");
});

closeSidebarRight.addEventListener("click", () => {
  sidebarRight.classList.remove("active");
});


// ===============================
// 🔄 CAMBIO DE ROL (COMPRADOR / VENDEDOR)
// ===============================

const buyerView = document.querySelector(".buyer-view");
const sellerView = document.querySelector(".seller-view");

const switchBuyer = document.getElementById("switchBuyer");
const switchSeller = document.getElementById("switchSeller");

switchBuyer.addEventListener("click", () => {
  userRole = "buyer";
  updateRoleUI();
});

switchSeller.addEventListener("click", () => {
  userRole = "seller";
  updateRoleUI();
});

function updateRoleUI() {

  if (userRole === "buyer") {
    buyerView.style.display = "block";
    sellerView.style.display = "none";
    console.log("🟡 Modo comprador activado");
  }

  if (userRole === "seller") {
    buyerView.style.display = "none";
    sellerView.style.display = "block";
    console.log("🔵 Modo vendedor activado");
  }
}


// ===============================
// 🎲 VINILO DEL DÍA (RANDOM)
// ===============================

// Simulación de base de datos
const vinilos = [
  "Dark Side of the Moon",
  "Thriller",
  "Abbey Road",
  "Back in Black",
  "Rumours",
  "The Wall",
  "Kind of Blue"
];

// guardamos en localStorage para que no cambie cada reload del día
function getViniloDelDia() {

  const today = new Date().toDateString();
  const saved = localStorage.getItem("viniloDia");

  if (saved) {
    const data = JSON.parse(saved);

    if (data.date === today) {
      console.log("🎲 Vinilo del día (guardado):", data.vinilo);
      return data.vinilo;
    }
  }

  // nuevo vinilo aleatorio
  const random = vinilos[Math.floor(Math.random() * vinilos.length)];

  localStorage.setItem("viniloDia", JSON.stringify({
    date: today,
    vinilo: random
  }));

  console.log("🎲 Nuevo vinilo del día:", random);
  return random;
}


// ===============================
// 💸 DESTACADOS (SIMULACIÓN PAGO 3€)
// ===============================

function loadFeaturedVinilos() {

  const featured = document.querySelector(".featured-grid");

  const destacados = [
    "Vinilo Premium 1",
    "Vinilo Premium 2",
    "Vinilo Premium 3",
    "Vinilo Premium 4"
  ];

  featured.innerHTML = "";

  destacados.forEach(v => {
    const div = document.createElement("div");
    div.classList.add("featured-item");
    div.innerText = "⭐ " + v;
    featured.appendChild(div);
  });

}


// ===============================
// 🎧 INIT APP
// ===============================

function initDashboard() {

  updateRoleUI();
  loadFeaturedVinilos();

  const viniloDia = getViniloDelDia();
  console.log("🎧 Vinilo del día actual:", viniloDia);

}

initDashboard();
const featuredGrid = document.getElementById("featuredGrid");
const scrollLeft = document.getElementById("scrollLeft");
const scrollRight = document.getElementById("scrollRight");

// mover izquierda
scrollLeft.addEventListener("click", () => {
  featuredGrid.scrollBy({
    left: -300,
    behavior: "smooth"
  });
});

// mover derecha
scrollRight.addEventListener("click", () => {
  featuredGrid.scrollBy({
    left: 300,
    behavior: "smooth"
  });
});