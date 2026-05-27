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
  
  // ========== DESTACADOS COMO TARJETAS ==========
  const featuredGrid = document.getElementById('featuredGrid');
  
  async function cargarDestacados() {
    if (!featuredGrid) return;
    
    featuredGrid.innerHTML = '<div class="vinyl-card">Cargando destacados...</div>';
    
    try {
        const response = await fetch(`${API_URL}/discos/buscar?q=beatles%20OR%20pink%20floyd%20OR%20michael%20jackson&type=release&per_page=10`);
        
        if (response.ok) {
            let discos = await response.json();
            
            discos = discos.filter(d => 
                d.artista && 
                d.artista !== 'Artista desconocido' &&
                !d.artista.toLowerCase().includes('various') &&
                d.titulo
            );
            
            const destacados = discos.slice(0, 6);
            
            if (destacados.length === 0) {
                featuredGrid.innerHTML = '<div class="vinyl-card">No hay destacados disponibles</div>';
                return;
            }
            
            featuredGrid.innerHTML = destacados.map(disco => {
                const precio = Math.floor(Math.random() * (35 - 15 + 1) + 15);
                return `
                <div class="vinyl-card">
                    <div class="vinyl-image-container">
                        ${disco.imagenUrl ? 
                            `<img src="${disco.imagenUrl}" alt="portada" onerror="this.src='https://picsum.photos/100/100'">` : 
                            '<div style="width:100px; height:100px; background:#e0d5c0; border-radius:8px; display:flex; align-items:center; justify-content:center;">Sin imagen</div>'
                        }
                    </div>
                    <div class="vinyl-info">
                        <h3>${disco.titulo ? disco.titulo.substring(0, 40) : 'Sin título'}</h3>
                        <p>🎤 ${disco.artista || 'Desconocido'}</p>
                        <p>📅 ${disco.anio || 'N/A'}</p>
                        <span class="precio">💰 ${precio}€</span>
                    </div>
                </div>
            `}).join('');
            
            // Reasignar eventos de scroll
            const scrollLeft = document.getElementById('scrollLeft');
            const scrollRight = document.getElementById('scrollRight');
            
            if (scrollLeft && scrollRight) {
                const newScrollLeft = scrollLeft.cloneNode(true);
                const newScrollRight = scrollRight.cloneNode(true);
                scrollLeft.parentNode.replaceChild(newScrollLeft, scrollLeft);
                scrollRight.parentNode.replaceChild(newScrollRight, scrollRight);
                
                newScrollLeft.onclick = () => {
                    featuredGrid.scrollBy({ left: -280, behavior: 'smooth' });
                };
                newScrollRight.onclick = () => {
                    featuredGrid.scrollBy({ left: 280, behavior: 'smooth' });
                };
            }
            
        } else {
            featuredGrid.innerHTML = '<div class="vinyl-card">Error al cargar destacados</div>';
        }
    } catch (error) {
        console.error('Error cargando destacados:', error);
        featuredGrid.innerHTML = '<div class="vinyl-card">Error de conexión</div>';
    }
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

  let discosEnCache = null;
  let ultimaPeticion = 0;

  function mostrarVinilos(discos) {
    if (!vinylGrid) return;
    
    if (!discos || discos.length === 0) {
        vinylGrid.innerHTML = '<p>🎧 No se encontraron vinilos</p>';
        return;
    }
    
    const tokenActual = localStorage.getItem('token');
    
    vinylGrid.innerHTML = discos.map(disco => {
        const precio = Math.floor(Math.random() * (35 - 15 + 1) + 15);
        const imagenValida = disco.imagenUrl && 
                            disco.imagenUrl !== '' && 
                            !disco.imagenUrl.includes('blank.png') &&
                            !disco.imagenUrl.includes('img.discogs.com/');
        
        return `
        <div class="vinyl-card">
            <div class="vinyl-image-container">
                ${imagenValida ? 
                    `<img src="${disco.imagenUrl}" alt="portada" onerror="this.src='https://picsum.photos/100/100'">` : 
                    '<div style="width:100px; height:100px; background:#e0d5c0; border-radius:8px; display:flex; align-items:center; justify-content:center;">Sin imagen</div>'
                }
            </div>
            <div class="vinyl-info">
                <h3>${disco.titulo || 'Sin título'}</h3>
                <p>🎤 ${disco.artista || 'Desconocido'}</p>
                <p>📅 ${disco.anio || 'N/A'}</p>
                <p>🎸 ${disco.genero || 'Sin género'}</p>
                <span class="precio">💰 ${precio}€</span>
            </div>
            ${tokenActual ? 
                `<button class="import-btn" data-titulo="${disco.titulo || ''}" data-artista="${disco.artista || ''}" data-anio="${disco.anio || 0}" data-genero="${disco.genero || ''}" data-imagen="${disco.imagenUrl || ''}" data-precio="${precio}">➕ Importar a colección</button>` :
                `<button class="login-to-buy" onclick="window.location.href='login.html'">🔒 Inicia sesión para importar</button>`
            }
        </div>
    `}).join('');
    
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
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenActual}` },
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
    
    const ahora = Date.now();
    if (discosEnCache && (ahora - ultimaPeticion) < 30000) {
        console.log('📦 Usando caché de vinilos');
        mostrarVinilos(discosEnCache);
        return;
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando vinilos destacados...</p>';
    
    try {
      const artistasSeleccionados = [...artistasPopulares]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      
      const query = artistasSeleccionados.join(' ');
      
      console.log('🎵 Búsqueda combinada:', query);
      
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}&type=release&per_page=50`);
      
      if (response.status === 429) {
          if (discosEnCache) {
              console.warn('Rate limit, usando caché');
              mostrarVinilos(discosEnCache);
          } else {
              vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Cargando discos de ejemplo...</p>';
              // Cargar discos de ejemplo desde el backend
              cargarDiscosEjemplo();
          }
          return;
      }
      
      if (response.ok) {
          let discos = await response.json();
          
          discos = discos.filter(d => 
              d.artista && 
              d.artista !== 'Artista desconocido' &&
              !d.artista.toLowerCase().includes('various') &&
              d.titulo &&
              d.imagenUrl !== 'null'
          );
          
          // Eliminar duplicados
          const discosUnicos = [];
          const idsVistos = new Set();
          for (const disco of discos) {
              const id = `${disco.artista}-${disco.titulo}`;
              if (!idsVistos.has(id)) {
                  idsVistos.add(id);
                  discosUnicos.push(disco);
              }
          }
          
          let discosFinal = discosUnicos;
          if (discosUnicos.length > 15) {
              discosFinal = discosUnicos.sort(() => 0.5 - Math.random()).slice(0, 15);
          }
          
          discosEnCache = discosFinal;
          ultimaPeticion = ahora;
          
          console.log(`✅ Cargados ${discosFinal.length} vinilos`);
          mostrarVinilos(discosFinal);
      } else {
          if (discosEnCache) {
              mostrarVinilos(discosEnCache);
          } else {
              cargarDiscosEjemplo();
          }
      }
    } catch (error) {
      console.error('Error:', error);
      if (discosEnCache) {
          mostrarVinilos(discosEnCache);
      } else {
          cargarDiscosEjemplo();
      }
    }
  }

  function cargarDiscosEjemplo() {
      // Discos de ejemplo en caso de que no se pueda conectar a Discogs
      const discosEjemplo = [
          { titulo: "Dark Side of the Moon", artista: "Pink Floyd", anio: 1973, genero: "Rock", imagenUrl: "https://picsum.photos/id/104/100/100" },
          { titulo: "Thriller", artista: "Michael Jackson", anio: 1982, genero: "Pop", imagenUrl: "https://picsum.photos/id/101/100/100" },
          { titulo: "Abbey Road", artista: "The Beatles", anio: 1969, genero: "Rock", imagenUrl: "https://picsum.photos/id/100/100/100" },
          { titulo: "Back in Black", artista: "AC/DC", anio: 1980, genero: "Rock", imagenUrl: "https://picsum.photos/id/103/100/100" },
          { titulo: "Rumours", artista: "Fleetwood Mac", anio: 1977, genero: "Rock", imagenUrl: "https://picsum.photos/id/107/100/100" },
          { titulo: "The Wall", artista: "Pink Floyd", anio: 1979, genero: "Rock", imagenUrl: "https://picsum.photos/id/105/100/100" },
          { titulo: "Nevermind", artista: "Nirvana", anio: 1991, genero: "Grunge", imagenUrl: "https://picsum.photos/id/106/100/100" },
          { titulo: "Hotel California", artista: "Eagles", anio: 1976, genero: "Rock", imagenUrl: "https://picsum.photos/id/108/100/100" },
          { titulo: "Born to Run", artista: "Bruce Springsteen", anio: 1975, genero: "Rock", imagenUrl: "https://picsum.photos/id/109/100/100" },
          { titulo: "Let It Be", artista: "The Beatles", anio: 1970, genero: "Rock", imagenUrl: "https://picsum.photos/id/110/100/100" }
      ];
      mostrarVinilos(discosEjemplo);
  }

  // ========== BÚSQUEDA MANUAL ==========
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
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
  
  if (searchBtn) {
    searchBtn.onclick = () => buscarVinilos(searchInput.value);
    console.log('✅ Botón de búsqueda asignado');
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => { 
      if (e.key === 'Enter') buscarVinilos(searchInput.value); 
    });
    console.log('✅ Input de búsqueda asignado');
  }

  // Cargar todo
  cargarVinilosAleatorios();
  cargarDestacados();
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