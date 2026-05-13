// ============================================
// 🎧 VINYLMARKET - APP COMPLETA
// ============================================

const API_URL = 'http://localhost:8080/api';

// ============================================
// 🔐 REGISTRO
// ============================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    if (password.length < 10) {
      alert('La contraseña debe tener al menos 10 caracteres');
      return;
    }
    
    const userData = {
      nombre: document.getElementById('nombre').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: password
    };
    
    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        alert('✅ Registro exitoso. Ahora inicia sesión.');
        window.location.href = 'login.html';
      } else {
        const error = await response.text();
        alert('❌ Error: ' + error);
      }
    } catch (error) {
      alert('❌ Error de conexión: ' + error.message);
    }
  });
}

// ============================================
// 🔐 LOGIN
// ============================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          username: data.username,
          tipo: 'comprador'
        }));
        alert('✅ Login exitoso');
        window.location.href = 'dashboard.html';
      } else {
        alert('❌ Credenciales inválidas');
      }
    } catch (error) {
      alert('❌ Error de conexión: ' + error.message);
    }
  });
}

// ============================================
// 🔐 RECUPERACIÓN
// ============================================
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    alert('📧 Se ha enviado un código a tu correo');
    window.location.href = 'login.html';
  });
}

// ============================================
// 🎧 DASHBOARD
// ============================================

if (window.location.pathname.includes('dashboard.html')) {
  
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Elementos
  const profileInfo = document.getElementById('profileInfo');
  const logoutBtn = document.getElementById('logoutBtn');
  const miColeccionBtn = document.getElementById('miColeccionBtn');
  const userTypeSelector = document.getElementById('userTypeSelector');
  const userTypeSelect = document.getElementById('userTypeSelect');
  const buyerSection = document.querySelector('.buyer-section');
  const sellerSection = document.querySelector('.seller-section');
  
  // Función para actualizar secciones según tipo
  function actualizarSeccionesPorTipo(tipo) {
    if (!buyerSection || !sellerSection) return;
    if (tipo === 'comprador') {
      buyerSection.style.display = 'block';
      sellerSection.style.display = 'none';
    } else if (tipo === 'vendedor') {
      buyerSection.style.display = 'none';
      sellerSection.style.display = 'block';
    } else {
      buyerSection.style.display = 'block';
      sellerSection.style.display = 'block';
    }
  }
  
  // Mostrar info si está logueado
  if (token && usuario && profileInfo) {
    const tipoUsuario = usuario.tipo || 'comprador';
    
    profileInfo.innerHTML = `
      <p><strong>${usuario.nombre || usuario.username}</strong></p>
      <p>${usuario.email}</p>
    `;
    
    if (userTypeSelector) {
      userTypeSelector.style.display = 'block';
      if (userTypeSelect) userTypeSelect.value = tipoUsuario;
    }
    if (miColeccionBtn) miColeccionBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    actualizarSeccionesPorTipo(tipoUsuario);
    
  } else if (profileInfo) {
    profileInfo.innerHTML = `
      <p>Inicia sesión para ver tu perfil</p>
      <button class="btn" onclick="window.location.href='login.html'">Iniciar sesión</button>
      <button class="btn btn-secondary" onclick="window.location.href='register.html'">Registrarse</button>
    `;
    if (userTypeSelector) userTypeSelector.style.display = 'none';
    if (miColeccionBtn) miColeccionBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
  
  // Evento cambiar tipo de usuario
  if (userTypeSelect) {
    userTypeSelect.onchange = function(e) {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        actualizarSeccionesPorTipo(nuevoTipo);
        alert(`✅ Tipo cambiado a: ${nuevoTipo === 'comprador' ? 'Comprador' : nuevoTipo === 'vendedor' ? 'Vendedor' : 'Comprador y Vendedor'}`);
      }
    };
  }
  
  // Cerrar sesión
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      localStorage.clear();
      window.location.href = 'login.html';
    };
  }
  
  // ========== VINILO DEL DÍA ==========
  const vinilosLista = ['Dark Side of the Moon - Pink Floyd', 'Thriller - Michael Jackson', 'Abbey Road - The Beatles'];
  const hoy = new Date().toDateString();
  let viniloDia = localStorage.getItem('viniloDia');
  if (!viniloDia || !viniloDia.includes(hoy)) {
    viniloDia = vinilosLista[Math.floor(Math.random() * vinilosLista.length)];
    localStorage.setItem('viniloDia', hoy + '|' + viniloDia);
  } else {
    viniloDia = viniloDia.split('|')[1];
  }
  const viniloDiaElem = document.getElementById('viniloDelDia');
  if (viniloDiaElem) viniloDiaElem.innerText = viniloDia;
  
  // ========== DESTACADOS ==========
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const destacados = ['Abbey Road', 'Thriller', 'Dark Side', 'Back in Black'];
    featuredGrid.innerHTML = destacados.map(v => `<div class="featured-item">⭐ ${v}</div>`).join('');
  }
  
  // Scroll
  const scrollLeft = document.getElementById('scrollLeft');
  const scrollRight = document.getElementById('scrollRight');
  if (scrollLeft) scrollLeft.onclick = () => featuredGrid.scrollBy({ left: -300, behavior: 'smooth' });
  if (scrollRight) scrollRight.onclick = () => featuredGrid.scrollBy({ left: 300, behavior: 'smooth' });
  
 // ========== SIDEBARS ==========
const sidebarLeft = document.getElementById('sidebarLeft');
const sidebarRight = document.getElementById('sidebarRight');
const overlay = document.getElementById('sidebarOverlay');
const openLeft = document.getElementById('openSidebarLeft');
const closeLeft = document.getElementById('closeSidebarLeft');
const openRight = document.getElementById('openSidebarRight');
const closeRight = document.getElementById('closeSidebarRight');
const body = document.body;

function cerrarSidebars() {
  if (sidebarLeft) sidebarLeft.classList.remove('active');
  if (sidebarRight) sidebarRight.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  body.classList.remove('sidebar-left-open', 'sidebar-right-open');
}

function abrirSidebarLeft() {
  cerrarSidebars();
  if (sidebarLeft) sidebarLeft.classList.add('active');
  if (overlay) overlay.classList.add('active');
  body.classList.add('sidebar-left-open');
  console.log('Sidebar izquierdo abierto');
}

function abrirSidebarRight() {
  cerrarSidebars();
  if (sidebarRight) sidebarRight.classList.add('active');
  if (overlay) overlay.classList.add('active');
  body.classList.add('sidebar-right-open');
  console.log('Sidebar derecho abierto');
}

// Asignar eventos
if (openLeft) {
  openLeft.onclick = abrirSidebarLeft;
  console.log('Botón izquierdo asignado');
} else {
  console.error('openSidebarLeft no encontrado');
}

if (closeLeft) closeLeft.onclick = cerrarSidebars;
if (openRight) {
  openRight.onclick = abrirSidebarRight;
  console.log('Botón derecho asignado');
} else {
  console.error('openSidebarRight no encontrado');
}
if (closeRight) closeRight.onclick = cerrarSidebars;
if (overlay) overlay.onclick = cerrarSidebars;

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarSidebars();
});
  
  // ========== BÚSQUEDA ==========
  const searchInput = document.getElementById('searchInput');
  const vinylGrid = document.getElementById('vinylGrid');
  
  async function buscarVinilos(query) {
    if (!query.trim()) return alert('Escribe un artista o título');
    vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const discos = await response.json();
        if (!discos.length) vinylGrid.innerHTML = '<p>No se encontraron vinilos</p>';
        else {
          vinylGrid.innerHTML = discos.map(d => `
            <div class="vinyl-card">
              ${d.imagenUrl ? `<img src="${d.imagenUrl}" width="100">` : '<div style="height:100px;">Sin imagen</div>'}
              <h3>${d.titulo || 'Sin título'}</h3>
              <p>${d.artista || 'Desconocido'}</p>
              <p>${d.anio || 'N/A'}</p>
              <button class="import-btn" data-titulo="${d.titulo || ''}" data-artista="${d.artista || ''}" data-anio="${d.anio || 0}" data-genero="${d.genero || ''}" data-imagen="${d.imagenUrl || ''}">➕ Importar</button>
            </div>
          `).join('');
          
          document.querySelectorAll('.import-btn').forEach(btn => {
            btn.onclick = async () => {
              const discoData = {
                titulo: btn.dataset.titulo,
                artista: btn.dataset.artista,
                anio: parseInt(btn.dataset.anio) || 0,
                genero: btn.dataset.genero,
                imagenUrl: btn.dataset.imagen
              };
              const res = await fetch(`${API_URL}/discos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(discoData)
              });
              alert(res.ok ? '✅ Importado' : '❌ Error');
            };
          });
        }
      }
    } catch(e) { vinylGrid.innerHTML = '<p>Error</p>'; }
  }
  
  if (searchInput) {
    searchInput.onkeypress = (e) => { if (e.key === 'Enter') buscarVinilos(searchInput.value); };
  }
}

// Funciones globales
window.verPerfil = function() {
  window.location.href = 'perfil.html';
};