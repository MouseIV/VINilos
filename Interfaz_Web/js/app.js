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

// Redirección si ya está logueado
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = 'perfil.html';
  }
}

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
  
  // Cambiar tipo de usuario
  if (userTypeSelect) {
    userTypeSelect.onchange = function(e) {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        actualizarSeccionesPorTipo(nuevoTipo);
        alert(`✅ Tipo cambiado a: ${nuevoTipo}`);
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
  const vinilosLista = ['Dark Side of the Moon - Pink Floyd', 'Thriller - Michael Jackson', 'Abbey Road - The Beatles', 'Back in Black - AC/DC'];
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

  // Scroll para destacados
  const scrollLeft = document.getElementById('scrollLeft');
  const scrollRight = document.getElementById('scrollRight');
  if (scrollLeft && featuredGrid) {
    scrollLeft.onclick = () => featuredGrid.scrollBy({ left: -300, behavior: 'smooth' });
    scrollRight.onclick = () => featuredGrid.scrollBy({ left: 300, behavior: 'smooth' });
  }

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
    
    if (openLeft) openLeft.style.visibility = 'visible';
    if (openRight) openRight.style.visibility = 'visible';
  }

  function abrirSidebarLeft() {
    cerrarSidebars();
    if (sidebarLeft) sidebarLeft.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-left-open');
    
    if (openLeft) openLeft.style.visibility = 'hidden';
    if (openRight) openRight.style.visibility = 'visible';
  }

  function abrirSidebarRight() {
    cerrarSidebars();
    if (sidebarRight) sidebarRight.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-right-open');
    
    if (openRight) openRight.style.visibility = 'hidden';
    if (openLeft) openLeft.style.visibility = 'visible';
  }

  if (openLeft) openLeft.onclick = abrirSidebarLeft;
  if (closeLeft) closeLeft.onclick = cerrarSidebars;
  if (openRight) openRight.onclick = abrirSidebarRight;
  if (closeRight) closeRight.onclick = cerrarSidebars;
  if (overlay) overlay.onclick = cerrarSidebars;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarSidebars();
  });

  // ========== VINILOS ALEATORIOS ==========
  const vinylGrid = document.getElementById('vinylGrid');
  
  const artistasPopulares = [
    'pink floyd', 'beatles', 'michael jackson', 'queen', 'ac dc',
    'nirvana', 'radiohead', 'bowie', 'led zeppelin', 'rolling stones',
    'fleetwood mac', 'prince', 'u2', 'metallica', 'guns and roses',
    'abba', 'elvis presley', 'bob dylan', 'the clash', 'ramones'
  ];

  function mostrarVinilos(discos) {
    if (!vinylGrid) return;
    
    if (!discos || discos.length === 0) {
      vinylGrid.innerHTML = '<p>🎧 No se encontraron vinilos</p>';
      return;
    }
    
    const tokenActual = localStorage.getItem('token');
    
    vinylGrid.innerHTML = discos.map(disco => `
      <div class="vinyl-card">
        ${disco.imagenUrl ? `<img src="${disco.imagenUrl}" alt="portada">` : '<div style="height:100px; background:#e0d5c0;">Sin imagen</div>'}
        <h3>${disco.titulo || 'Sin título'}</h3>
        <p>🎤 ${disco.artista || 'Desconocido'}</p>
        <p>📅 ${disco.anio || 'N/A'}</p>
        <p>🎸 ${disco.genero || 'Sin género'}</p>
        ${tokenActual ? 
          `<button class="import-btn" data-titulo="${disco.titulo || ''}" data-artista="${disco.artista || ''}" data-anio="${disco.anio || 0}" data-genero="${disco.genero || ''}" data-imagen="${disco.imagenUrl || ''}">➕ Importar a colección</button>` :
          `<button class="login-to-buy" onclick="window.location.href='login.html'">🔒 Inicia sesión para importar</button>`
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
          
          try {
            const res = await fetch(`${API_URL}/discos`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenActual}`
              },
              body: JSON.stringify(discoData)
            });
            alert(res.ok ? '✅ Disco importado a tu colección' : '❌ Error al importar');
          } catch (error) {
            alert('❌ Error de conexión');
          }
        };
      });
    }
  }

  async function cargarVinilosAleatorios() {
    if (!vinylGrid) return;
    
    vinylGrid.innerHTML = '<p>🔄 Cargando vinilos destacados...</p>';
    
    try {
      const artistasSeleccionados = [...artistasPopulares]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const query = artistasSeleccionados.join(' ');
      
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        let discos = await response.json();
        
        if (discos.length > 15) {
          discos = discos.sort(() => 0.5 - Math.random()).slice(0, 15);
        }
        
        mostrarVinilos(discos);
      } else {
        vinylGrid.innerHTML = '<p>❌ Error al cargar vinilos</p>';
      }
    } catch (error) {
      console.error('Error:', error);
      vinylGrid.innerHTML = '<p>❌ Error de conexión</p>';
    }
  }

  // ========== BÚSQUEDA MANUAL ==========
  const searchInput = document.getElementById('searchInput');
  
  async function buscarVinilos(query) {
    if (!query.trim()) return alert('Escribe un artista o título');
    vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const discos = await response.json();
        mostrarVinilos(discos);
      } else {
        vinylGrid.innerHTML = '<p>❌ Error al buscar</p>';
      }
    } catch(e) { 
      vinylGrid.innerHTML = '<p>❌ Error de conexión</p>'; 
    }
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => { 
      if (e.key === 'Enter') buscarVinilos(searchInput.value); 
    });
  }

  // Cargar vinilos aleatorios al iniciar
  cargarVinilosAleatorios();
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
    const tipoTexto = usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    perfilInfo.innerHTML = `
      <p><strong>Nombre:</strong> ${usuario.nombre || usuario.username}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Tipo:</strong> ${tipoTexto}</p>
    `;
  }
  
  const miColeccion = document.getElementById('miColeccion');
  if (miColeccion) {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/discos/mi-coleccion`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const discos = await response.json();
          if (discos.length === 0) {
            miColeccion.innerHTML = '<p>No tienes vinilos en tu colección.</p>';
          } else {
            miColeccion.innerHTML = discos.map(d => `
              <div class="vinyl-card-small">
                <strong>${d.disco?.titulo || d.titulo}</strong> - ${d.disco?.artista || d.artista}
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

window.verPerfil = function() {
  window.location.href = 'perfil.html';
};

window.cerrarSesion = function() {
  localStorage.clear();
  window.location.href = 'login.html';
};

console.log('App cargada correctamente');