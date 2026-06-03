// ============================================
// 🛠️ FUNCIONES AUXILIARES
// ============================================

function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function verPerfil() {
  window.location.href = 'perfil.html';
}

function redirigirSegunAutenticacion() {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'perfil.html';
  } else {
    window.location.href = 'login.html';
  }
}

function validarFormatoEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isTokenExpirado() {
  const token = localStorage.getItem('token');
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}