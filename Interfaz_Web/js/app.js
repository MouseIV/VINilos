// REGISTRO
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

    alert("Registro completado");
    window.location.href = "index.html";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (storedUser && email === storedUser.email && password === storedUser.password) {
      window.location.href = "dashboard.html";
    } else {
      alert("Correo o contraseña incorrectos");
    }
  });
}

// LOGOUT
function logout() {
  window.location.href = "index.html";
}