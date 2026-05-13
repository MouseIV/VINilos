console.log("🎧 VinylMarket cargado");


// ===============================
// 🔐 REGISTRO
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const user = {
      username: document.getElementById("user").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    localStorage.setItem("user", JSON.stringify(user));

<<<<<<< Updated upstream
    alert("Registro completado");
=======
    alert("Registrado");

>>>>>>> Stashed changes
    window.location.href = "index.html";

  });

}


// ===============================
// 🔑 LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

<<<<<<< Updated upstream
    if (storedUser && email === storedUser.email && password === storedUser.password) {
=======
    if (user && email === user.email && password === user.password) {

>>>>>>> Stashed changes
      window.location.href = "dashboard.html";

    } else {
<<<<<<< Updated upstream
      alert("Correo o contraseña incorrectos");
=======

      alert("Error");

>>>>>>> Stashed changes
    }

  });

}

<<<<<<< Updated upstream
// LOGOUT
function logout() {
  window.location.href = "index.html";
=======


// ===============================
// 📚 SIDEBAR IZQUIERDA
// ===============================

const sidebarLeft = document.getElementById("sidebarLeft");
const openSidebarLeft = document.getElementById("openSidebarLeft");
const closeSidebarLeft = document.getElementById("closeSidebarLeft");

if (openSidebarLeft && sidebarLeft) {

  openSidebarLeft.addEventListener("click", () => {

    sidebarLeft.classList.toggle("active");

  });

}

if (closeSidebarLeft && sidebarLeft) {

  closeSidebarLeft.addEventListener("click", () => {

    sidebarLeft.classList.remove("active");

  });

}



// ===============================
// 👤 SIDEBAR DERECHA
// ===============================

const sidebarRight = document.getElementById("sidebarRight");
const openSidebarRight = document.getElementById("openSidebarRight");
const closeSidebarRight = document.getElementById("closeSidebarRight");

if (openSidebarRight && sidebarRight) {

  openSidebarRight.addEventListener("click", () => {

    sidebarRight.classList.toggle("active");

  });

}

if (closeSidebarRight && sidebarRight) {

  closeSidebarRight.addEventListener("click", () => {

    sidebarRight.classList.remove("active");

  });

}



// ===============================
// 🔄 CAMBIO DE ROL
// ===============================

// ===============================
// 🔄 CAMBIO DE ROL
// ===============================

// rol por defecto
let userRole = "buyer";


// vistas
const buyerViews = document.querySelectorAll(".buyer-view");
const sellerViews = document.querySelectorAll(".seller-view");


// botones
const switchBuyer = document.getElementById("switchBuyer");
const switchSeller = document.getElementById("switchSeller");


// función actualizar interfaz
function updateRoleUI() {

  buyerViews.forEach(el => {
    el.style.display = (userRole === "buyer") ? "block" : "none";
  });

  sellerViews.forEach(el => {
    el.style.display = (userRole === "seller") ? "block" : "none";
  });

}



// botón comprador
if (switchBuyer) {

  switchBuyer.addEventListener("click", () => {

    userRole = "buyer";

    updateRoleUI();

  });

}


// botón vendedor
if (switchSeller) {

  switchSeller.addEventListener("click", () => {

    userRole = "seller";

    updateRoleUI();

  });

}


// iniciar
updateRoleUI();

// ===============================
// 🎧 CARRUSEL
// ===============================

const featuredGrid = document.getElementById("featuredGrid");

const scrollLeft = document.getElementById("scrollLeft");

const scrollRight = document.getElementById("scrollRight");

if (scrollLeft && featuredGrid) {

  scrollLeft.addEventListener("click", () => {

    featuredGrid.scrollBy({
      left: -300,
      behavior: "smooth"
    });

  });

}

if (scrollRight && featuredGrid) {

  scrollRight.addEventListener("click", () => {

    featuredGrid.scrollBy({
      left: 300,
      behavior: "smooth"
    });

  });

>>>>>>> Stashed changes
}