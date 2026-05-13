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
          tipo: data.tipo || 'comprador'  // Por defecto comprador
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
// 🔐 RECUPERACIÓN DE CONTRASEÑA
// ============================================
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    if (!email) {
      alert('Ingresa tu correo electrónico');
      return;
    }
    alert(`📧 Se ha enviado un código de recuperación a ${email}`);
    window.location.href = 'login.html';
  });
}

// ============================================
// 🎧 DASHBOARD / TIENDA
// ============================================

if (window.location.pathname.includes('dashboard.html')) {
  
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // ========== SIDEBAR DERECHO - PERFIL ==========
  const profileInfo = document.getElementById('profileInfo');
  const logoutBtn = document.getElementById('logoutBtn');
  const userTypeBadge = document.getElementById('userTypeBadge');
  const userTypeValue = document.getElementById('userTypeValue');
  
  function actualizarTipoUsuario(tipo) {
    if (!userTypeValue) return;
    userTypeValue.className = 'user-type-value';
    if (tipo === 'comprador') {
      userTypeValue.innerText = '🟡 Comprador';
      userTypeValue.classList.add('comprador');
    } else if (tipo === 'vendedor') {
      userTypeValue.innerText = '🔵 Vendedor';
      userTypeValue.classList.add('vendedor');
    } else {
      userTypeValue.innerText = '🟢 Comprador y Vendedor';
      userTypeValue.classList.add('ambos');
    }
  }
  
  if (token && usuario && profileInfo) {
    const tipoUsuario = usuario.tipo || 'comprador';
    
    profileInfo.innerHTML = `
      <p><strong>${usuario.nombre || usuario.username}</strong></p>
      <p>${usuario.email}</p>
      <button class="btn" onclick="verPerfil()">📀 Mi colección</button>
    `;
    
    if (userTypeBadge) userTypeBadge.style.display = 'block';
    actualizarTipoUsuario(tipoUsuario);
    
    if (logoutBtn) logoutBtn.style.display = 'block';
  } else if (profileInfo) {
    profileInfo.innerHTML = `
      <p>Inicia sesión para ver tu perfil</p>
      <button class="btn" onclick="window.location.href='login.html'">Iniciar sesión</button>
      <button class="btn btn-secondary" onclick="window.location.href='register.html'">Registrarse</button>
    `;
    if (userTypeBadge) userTypeBadge.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
  
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.clear();
      window.location.href = 'login.html';
    };
  }
  
  // ========== CAMBIO DE ROL (COMPRADOR / VENDEDOR) ==========
  let userRole = 'buyer';
  const buyerSection = document.querySelector('.buyer-section');
  const sellerSection = document.querySelector('.seller-section');
  const switchBuyer = document.getElementById('switchBuyer');
  const switchSeller = document.getElementById('switchSeller');
  
  function updateRoleUI() {
    if (userRole === 'buyer') {
      if (buyerSection) buyerSection.style.display = 'block';
      if (sellerSection) sellerSection.style.display = 'none';
      if (userTypeValue && usuario) actualizarTipoUsuario('comprador');
    } else {
      if (buyerSection) buyerSection.style.display = 'none';
      if (sellerSection) sellerSection.style.display = 'block';
      if (userTypeValue && usuario) actualizarTipoUsuario('vendedor');
    }
  }
  
  if (switchBuyer) switchBuyer.onclick = () => { userRole = 'buyer'; updateRoleUI(); };
  if (switchSeller) switchSeller.onclick = () => { userRole = 'seller'; updateRoleUI(); };
  updateRoleUI();
  
  // ========== VINILO DEL DÍA ==========
  const vinilosLista = [
    'Dark Side of the Moon - Pink Floyd',
    'Thriller - Michael Jackson',
    'Abbey Road - The Beatles',
    'Back in Black - AC/DC',
    'Rumours - Fleetwood Mac',
    'The Wall - Pink Floyd'
  ];
  
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
  
  // ========== DESTACADOS (CARRUSEL) ==========
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const destacadosVinilos = [
      { titulo: 'Abbey Road', artista: 'The Beatles', precio: 25, imagen: 'https://picsum.photos/id/100/150/150' },
      { titulo: 'Thriller', artista: 'Michael Jackson', precio: 30, imagen: 'https://picsum.photos/id/101/150/150' },
      { titulo: 'Dark Side of the Moon', artista: 'Pink Floyd', precio: 28, imagen: 'https://picsum.photos/id/102/150/150' },
      { titulo: 'Back in Black', artista: 'AC/DC', precio: 22, imagen: 'https://picsum.photos/id/103/150/150' },
      { titulo: 'Rumours', artista: 'Fleetwood Mac', precio: 24, imagen: 'https://picsum.photos/id/104/150/150' },
      { titulo: 'The Wall', artista: 'Pink Floyd', precio: 27, imagen: 'https://picsum.photos/id/105/150/150' }
    ];
    
    featuredGrid.innerHTML = destacadosVinilos.map(v => `
      <div class="vinyl-card">
        <img src="${v.imagen}" alt="${v.titulo}">
        <h3>${v.titulo}</h3>
        <p>${v.artista}</p>
        <span class="precio">${v.precio}€</span>
      </div>
    `).join('');
  }
  
  // ========== CARRUSEL - SCROLL ==========
  const scrollLeft = document.getElementById('scrollLeft');
  const scrollRight = document.getElementById('scrollRight');
  if (scrollLeft) scrollLeft.onclick = () => featuredGrid.scrollBy({ left: -320, behavior: 'smooth' });
  if (scrollRight) scrollRight.onclick = () => featuredGrid.scrollBy({ left: 320, behavior: 'smooth' });
  
  // ========== SIDEBARS ==========
  const sidebarLeft = document.getElementById('sidebarLeft');
  const sidebarRight = document.getElementById('sidebarRight');
  const overlay = document.getElementById('overlay');
  const openSidebarLeft = document.getElementById('openSidebarLeft');
  const closeSidebarLeft = document.getElementById('closeSidebarLeft');
  const openSidebarRight = document.getElementById('openSidebarRight');
  const closeSidebarRight = document.getElementById('closeSidebarRight');
  const body = document.body;
  
  function cerrarSidebars() {
    if (sidebarLeft) sidebarLeft.classList.remove('active');
    if (sidebarRight) sidebarRight.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.classList.remove('sidebar-left-open', 'sidebar-right-open');
  }
  
  function abrirIzquierdo() {
    cerrarSidebars();
    if (sidebarLeft) sidebarLeft.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-left-open');
  }
  
  function abrirDerecho() {
    cerrarSidebars();
    if (sidebarRight) sidebarRight.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-right-open');
  }
  
  if (openSidebarLeft) openSidebarLeft.onclick = abrirIzquierdo;
  if (closeSidebarLeft) closeSidebarLeft.onclick = cerrarSidebars;
  if (openSidebarRight) openSidebarRight.onclick = abrirDerecho;
  if (closeSidebarRight) closeSidebarRight.onclick = cerrarSidebars;
  if (overlay) overlay.onclick = cerrarSidebars;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarSidebars();
  });
  
  // ========== BÚSQUEDA EN DISCOGS ==========
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const vinylGrid = document.getElementById('vinylGrid');
  
  async function buscarVinilos(query) {
    if (!query.trim()) {
      alert('Escribe un artista o título');
      return;
    }
    
    if (vinylGrid) vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const discos = await response.json();
        mostrarVinilos(discos);
      } else {
        if (vinylGrid) vinylGrid.innerHTML = '<p>❌ Error al buscar discos</p>';
      }
    } catch (error) {
      if (vinylGrid) vinylGrid.innerHTML = '<p>❌ Error de conexión</p>';
    }
  }
  
  function mostrarVinilos(discos) {
    if (!vinylGrid) return;
    
    if (!discos || discos.length === 0) {
      vinylGrid.innerHTML = '<p>🎧 No se encontraron vinilos</p>';
      return;
    }
    
    const tokenActual = localStorage.getItem('token');
    
    vinylGrid.innerHTML = discos.map(disco => `
      <div class="vinyl-card">
        ${disco.imagenUrl ? `<img src="${disco.imagenUrl}" alt="portada">` : '<div style="height:150px; background:#e0d5c0;">Sin imagen</div>'}
        <h3>${disco.titulo || 'Sin título'}</h3>
        <p>🎤 ${disco.artista || 'Artista desconocido'}</p>
        <p>📅 ${disco.anio || 'N/A'}</p>
        <p>🎸 ${disco.genero || 'Sin género'}</p>
        ${tokenActual ? 
          `<button class="import-btn" data-titulo="${disco.titulo || ''}" data-artista="${disco.artista || ''}" data-anio="${disco.anio || 0}" data-genero="${disco.genero || ''}" data-imagen="${disco.imagenUrl || ''}">➕ Importar a colección</button>` :
          `<button class="login-to-buy" onclick="window.location.href='login.html'">🔒 Inicia sesión para comprar</button>`
        }
      </div>
    `).join('');
    
    if (tokenActual) {
      document.querySelectorAll('.import-btn').forEach(btn => {
        btn.onclick = async () => {
          const discoData = {
            titulo: btn.dataset.titulo,
            artista: btn.dataset.artista,
            anio: parseInt(btn.dataset.anio) || 0,
            genero: btn.dataset.genero,
            imagenUrl: btn.dataset.imagen
          };
          await importarDisco(discoData);
        };
      });
    }
  }
  
  async function importarDisco(discoData) {
    const tokenActual = localStorage.getItem('token');
    if (!tokenActual) {
      window.location.href = 'login.html';
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/discos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenActual}`
        },
        body: JSON.stringify(discoData)
      });
      
      if (response.ok) {
        alert('✅ Disco importado a tu colección');
      } else {
        alert('❌ Error al importar');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  }
  
  if (searchBtn) {
    searchBtn.onclick = () => buscarVinilos(searchInput.value);
  }
  if (searchInput) {
    searchInput.onkeypress = (e) => {
      if (e.key === 'Enter') buscarVinilos(searchInput.value);
    };
  }
  
  console.log('Dashboard cargado correctamente');
}

// ============================================
// 👤 PERFIL / COLECCIÓN PERSONAL
// ============================================

if (window.location.pathname.includes('perfil.html')) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'login.html';
  }
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const perfilInfo = document.getElementById('perfilInfo');
  if (perfilInfo && usuario) {
    perfilInfo.innerHTML = `
      <p><strong>Nombre:</strong> ${usuario.nombre || usuario.username}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Tipo:</strong> ${usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor'}</p>
    `;
  }
  
  const miColeccion = document.getElementById('miColeccion');
  if (miColeccion) {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/discos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const discos = await response.json();
          if (discos.length === 0) {
            miColeccion.innerHTML = '<p>No tienes vinilos en tu colección.</p>';
          } else {
            miColeccion.innerHTML = discos.map(d => `
              <div class="vinyl-card-small">
                <strong>${d.titulo}</strong> - ${d.artista} (${d.anio})
              </div>
            `).join('');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.clear();
      window.location.href = 'login.html';
    };
  }
}

// ============================================
// 🚪 FUNCIONES GLOBALES
// ============================================

window.cerrarSesion = function() {
  localStorage.clear();
  window.location.href = 'login.html';
};

window.verPerfil = function() {
  window.location.href = 'perfil.html';
};

console.log('App cargada correctamente');