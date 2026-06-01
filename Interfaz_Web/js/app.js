// ============================================
// 🎧 VINYLMARKET - APP COMPLETA
// ============================================

const API_URL = 'http://localhost:8080/api';

// ============================================
// 🔔 NOTIFICACIONES PERSONALIZADAS (POPUPS)
// ============================================

function mostrarNotificacion(mensaje, tipo = 'info') {
  // Eliminar notificaciones anteriores
  const notificacionesExistentes = document.querySelectorAll('.toast-notification');
  notificacionesExistentes.forEach(notif => {
    if (notif.parentNode) notif.parentNode.removeChild(notif);
  });
  
  // Crear elemento
  const toast = document.createElement('div');
  toast.className = `toast-notification ${tipo}`;
  toast.innerText = mensaje;
  
  // Añadir al body
  document.body.appendChild(toast);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 500);
  }, 3000);
}

// ============================================
// 🔐 REGISTRO
// ============================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    if (password.length < 10) {
      mostrarNotificacion('❌ La contraseña debe tener al menos 10 caracteres', 'error');
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
        mostrarNotificacion('✅ Registro exitoso. Redirigiendo al inicio de sesión...', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        const error = await response.text();
        mostrarNotificacion('❌ Error: ' + error, 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
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

        mostrarNotificacion(`✅ ¡Bienvenido ${data.nombre || data.username}!`, 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        mostrarNotificacion('❌ Credenciales inválidas. Verifica tu email y contraseña.', 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
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
    mostrarNotificacion('📧 Se ha enviado un código de recuperación a tu correo', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
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
        mostrarNotificacion(`✅ Tipo de usuario cambiado a: ${nuevoTipo === 'comprador' ? 'Comprador' : nuevoTipo === 'vendedor' ? 'Vendedor' : 'Comprador y Vendedor'}`, 'success');
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
      
      if (response.status === 429) {
        featuredGrid.innerHTML = '<div class="vinyl-card">⏳ Límite de peticiones. Reintentando...</div>';
        setTimeout(() => cargarDestacados(), 3000);
        return;
      }
      
      if (response.ok) {
        let discos = await response.json();
        
        discos = discos.filter(d => 
          d.artista && 
          d.artista !== 'Artista desconocido' &&
          !d.artista.toLowerCase().includes('various') &&
          d.titulo &&
          d.imagenUrl &&
          d.imagenUrl !== ''
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
          `;
        }).join('');
        
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

  // ========== FUNCIÓN PARA LEER PARÁMETROS DE URL ==========
  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

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
  
  // Variables para géneros
  let generosDisponibles = new Set();

  // ========== FUNCIONES DE GÉNEROS ==========
  function actualizarGeneros(discos) {
    if (!discos || discos.length === 0) return;
    
    discos.forEach(disco => {
      if (disco.genero && disco.genero !== 'Sin género') {
        const generos = disco.genero.split(/[,/]/).map(g => g.trim());
        generos.forEach(g => {
          if (g && g !== 'Sin género' && g !== '') {
            generosDisponibles.add(g);
          }
        });
      }
    });
    
    renderizarListaGeneros();
  }

  function renderizarListaGeneros() {
    const generosList = document.getElementById('generosList');
    if (!generosList) return;
    
    if (generosDisponibles.size === 0) {
      generosList.innerHTML = '<div class="loading-text">No hay géneros disponibles</div>';
      return;
    }
    
    const generosOrdenados = Array.from(generosDisponibles).sort();
    
    generosList.innerHTML = generosOrdenados.map(genero => `
      <div class="genero-item" data-genero="${genero}">
        🎸 ${genero}
      </div>
    `).join('');
    
    document.querySelectorAll('.genero-item').forEach(item => {
      item.addEventListener('click', () => {
        const genero = item.dataset.genero;
        buscarPorGenero(genero);
      });
    });
  }

  async function buscarPorGenero(genero) {
    if (!genero) return;
    
    mostrarNotificacion(`🔍 Buscando discos de ${genero}...`, 'info');
    vinylGrid.innerHTML = '<p>🔄 Cargando discos por género...</p>';
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(genero)}&type=release&per_page=30`);
      
      if (response.status === 429) {
        setTimeout(() => buscarPorGenero(genero), 3000);
        return;
      }
      
      if (response.ok) {
        let discos = await response.json();
        
        discos = discos.filter(d => 
          d.genero && 
          d.genero.toLowerCase().includes(genero.toLowerCase()) &&
          d.artista && 
          d.artista !== 'Artista desconocido' &&
          !d.artista.toLowerCase().includes('various') &&
          d.imagenUrl && 
          d.imagenUrl !== ''
        );
        
        if (discos.length === 0) {
          vinylGrid.innerHTML = '<p>🎧 No se encontraron discos de este género. Intenta con otro.</p>';
          return;
        }
        
        if (discos.length > 15) {
          discos = discos.sort(() => 0.5 - Math.random()).slice(0, 15);
        }
        
        mostrarVinilos(discos);
        mostrarNotificacion(`✅ Encontrados ${discos.length} discos de ${genero}`, 'success');
        
        actualizarGeneros(discos);
        
      } else {
        vinylGrid.innerHTML = '<p>❌ Error al buscar por género</p>';
      }
    } catch (error) {
      console.error('Error:', error);
      vinylGrid.innerHTML = '<p>❌ Error de conexión</p>';
    }
  }

  // ========== BOTONES DEL SIDEBAR ==========
  function inicializarBotonesSidebar() {
    const btnMasSolicitados = document.getElementById('btnMasSolicitados');
    const btnGrandesOfertas = document.getElementById('btnGrandesOfertas');
    const btnTopVentas = document.getElementById('btnTopVentas');
    const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion');
    
    if (btnMasSolicitados) {
      btnMasSolicitados.addEventListener('click', () => {
        mostrarNotificacion('🎧 Próximamente: Los vinilos más solicitados por la comunidad', 'info');
      });
    }
    
    if (btnGrandesOfertas) {
      btnGrandesOfertas.addEventListener('click', () => {
        mostrarNotificacion('💸 Próximamente: Las mejores ofertas y descuentos', 'info');
      });
    }
    
    if (btnTopVentas) {
      btnTopVentas.addEventListener('click', () => {
        mostrarNotificacion('📈 Próximamente: Los vinilos más vendidos del mes', 'info');
      });
    }
    
    if (btnNuevaPublicacion) {
      btnNuevaPublicacion.addEventListener('click', () => {
        mostrarNotificacion('➕ Próximamente: Publica tus propios vinilos a la venta', 'info');
      });
    }
  }

  // ========== MOSTRAR VINILOS ==========
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
            `<button class="import-btn" 
                data-titulo="${disco.titulo || ''}" 
                data-artista="${disco.artista || ''}" 
                data-anio="${disco.anio || 0}" 
                data-genero="${disco.genero || ''}" 
                data-imagen="${disco.imagenUrl || ''}" 
                data-precio="${precio}">➕ Importar a colección</button>` :
            `<button class="login-to-buy" onclick="window.location.href='login.html'">🔒 Inicia sesión para importar</button>`
          }
        </div>
      `;
    }).join('');
    
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
            if (res.ok) {
              mostrarNotificacion('✅ Disco importado a tu colección', 'success');
            } else {
              mostrarNotificacion('❌ Error al importar', 'error');
            }
          } catch (error) {
            mostrarNotificacion('❌ Error de conexión', 'error');
          }
        };
      });
    }
    
    // Actualizar lista de géneros
    actualizarGeneros(discos);
  }

  // ========== CARGAR VINILOS ALEATORIOS ==========
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
        console.warn('Rate limit de Discogs, reintentando en 3 segundos...');
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Reintentando...</p>';
        setTimeout(() => cargarVinilosAleatorios(), 3000);
        return;
      }
      
      if (response.ok) {
        let discos = await response.json();
        
        discos = discos.filter(d => 
          d.artista && 
          d.artista !== 'Artista desconocido' &&
          !d.artista.toLowerCase().includes('various') &&
          d.titulo &&
          d.imagenUrl && 
          d.imagenUrl !== '' &&
          !d.imagenUrl.includes('blank.png')
        );
        
        if (discos.length === 0) {
          console.warn('No se encontraron discos con imagen, reintentando...');
          setTimeout(() => cargarVinilosAleatorios(), 1000);
          return;
        }
        
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
        
        console.log(`✅ Cargados ${discosFinal.length} vinilos desde Discogs`);
        mostrarVinilos(discosFinal);
        
      } else if (response.status === 404) {
        console.warn('No se encontraron resultados, reintentando con otros artistas...');
        setTimeout(() => cargarVinilosAleatorios(), 1000);
      } else {
        console.error('Error en la respuesta:', response.status);
        if (discosEnCache) {
          console.log('📦 Usando caché como fallback');
          mostrarVinilos(discosEnCache);
        } else {
          vinylGrid.innerHTML = '<p>❌ Error al cargar vinilos. Intenta de nuevo más tarde.</p>';
        }
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      if (discosEnCache) {
        console.log('📦 Usando caché por error de conexión');
        mostrarVinilos(discosEnCache);
      } else {
        vinylGrid.innerHTML = '<p>❌ Error de conexión. Verifica que el servidor esté corriendo.</p>';
      }
    }
  }

  // ========== BÚSQUEDA MANUAL ==========
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  async function buscarVinilos(query) {
    if (!query.trim()) {
      mostrarNotificacion('⚠️ Escribe un artista o título para buscar', 'info');
      return;
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      
      if (response.status === 429) {
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Espera unos segundos...</p>';
        setTimeout(() => buscarVinilos(query), 3000);
        return;
      }
      
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

  // ========== BÚSQUEDA DESDE INDEX (parámetro URL) ==========
  const buscarQuery = getParameterByName('buscar');
  if (buscarQuery) {
    setTimeout(() => {
      if (searchInput) {
        searchInput.value = decodeURIComponent(buscarQuery);
        buscarVinilos(decodeURIComponent(buscarQuery));
      }
    }, 500);
  }

  // ========== INICIALIZAR TODO ==========
  cargarVinilosAleatorios();
  cargarDestacados();
  inicializarBotonesSidebar();
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
  
  // ========== DATOS ADICIONALES DEL USUARIO ==========
  function cargarDatosAdicionales() {
    const ciudad = localStorage.getItem('user_ciudad') || '';
    const telefono = localStorage.getItem('user_telefono') || '';
    const tipoColeccionista = localStorage.getItem('user_tipo_coleccionista') || 'principiante';
    
    const ciudadInput = document.getElementById('ciudad');
    const telefonoInput = document.getElementById('telefono');
    const tipoSelect = document.getElementById('tipoColeccionista');
    
    if (ciudadInput) ciudadInput.value = ciudad;
    if (telefonoInput) telefonoInput.value = telefono;
    if (tipoSelect) tipoSelect.value = tipoColeccionista;
  }
  
  function guardarDatosAdicionales() {
    const ciudad = document.getElementById('ciudad')?.value || '';
    const telefono = document.getElementById('telefono')?.value || '';
    const tipoColeccionista = document.getElementById('tipoColeccionista')?.value || 'principiante';
    
    localStorage.setItem('user_ciudad', ciudad);
    localStorage.setItem('user_telefono', telefono);
    localStorage.setItem('user_tipo_coleccionista', tipoColeccionista);
    
    mostrarNotificacion('✅ Datos adicionales guardados correctamente', 'success');
  }
  
  const guardarDatosBtn = document.getElementById('guardarDatosAdicionales');
  if (guardarDatosBtn) {
    guardarDatosBtn.onclick = guardarDatosAdicionales;
  }
  
  // ========== AGREGAR VINILO MANUALMENTE ==========
  async function agregarViniloManual() {
    const titulo = document.getElementById('nuevoTitulo')?.value.trim();
    const artista = document.getElementById('nuevoArtista')?.value.trim();
    const anio = parseInt(document.getElementById('nuevoAnio')?.value) || 0;
    const genero = document.getElementById('nuevoGenero')?.value.trim() || 'Sin género';
    const imagenUrl = document.getElementById('nuevaImagen')?.value.trim() || '';
    const estadoVinilo = document.getElementById('estadoVinilo')?.value || 'NUEVO';
    const calificacion = parseInt(document.getElementById('calificacion')?.value) || 5;
    
    if (!titulo || !artista) {
      mostrarNotificacion('❌ El título y el artista son obligatorios', 'error');
      return;
    }
    
    const discoData = { titulo, artista, anio, genero, imagenUrl };
    
    try {
      const response = await fetch(`${API_URL}/discos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(discoData)
      });
      
      if (response.ok) {
        const discoGuardado = await response.json();
        const discoId = discoGuardado.id;
        
        const coleccionData = {
          discoId: discoId,
          estado: estadoVinilo,
          calificacion: calificacion
        };
        
        const coleccionResponse = await fetch(`${API_URL}/discos/${discoId}/agregar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(coleccionData)
        });
        
        if (coleccionResponse.ok) {
          mostrarNotificacion('✅ Vinilo añadido a tu colección', 'success');
          
          // Limpiar formulario
          const inputs = ['nuevoTitulo', 'nuevoArtista', 'nuevoAnio', 'nuevoGenero', 'nuevaImagen'];
          inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
          });
          
          cargarColeccion();
        } else {
          const error = await coleccionResponse.text();
          mostrarNotificacion('❌ Error al añadir a colección: ' + error, 'error');
        }
      } else {
        const error = await response.text();
        mostrarNotificacion('❌ Error al guardar el disco: ' + error, 'error');
      }
    } catch (error) {
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
    }
  }
  
  const agregarBtn = document.getElementById('btnAgregarVinilo');
  if (agregarBtn) {
    agregarBtn.onclick = agregarViniloManual;
  }
  
  // ========== CARGAR COLECCIÓN ==========
  async function cargarColeccion() {
    const miColeccion = document.getElementById('miColeccion');
    if (!miColeccion) return;
    
    miColeccion.innerHTML = '<p>🔄 Cargando tu colección...</p>';
    
    try {
      const response = await fetch(`${API_URL}/discos/mi-coleccion`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const coleccion = await response.json();
        
        if (coleccion.length === 0) {
          miColeccion.innerHTML = '<p>📀 No tienes vinilos en tu colección. ¡Añade algunos desde la tienda o desde este formulario!</p>';
        } else {
          miColeccion.innerHTML = coleccion.map(item => {
            const disco = item.disco;
            const estadoTexto = {
              'NUEVO': '🟢 Nuevo',
              'MUY_BUENO': '🟡 Muy bueno',
              'BUENO': '🟠 Bueno',
              'REGULAR': '🔴 Regular'
            }[item.estado] || item.estado;
            
            const estrellas = '⭐'.repeat(item.calificacion || 5);
            
            return `
              <div class="vinyl-card-small">
                <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                  ${disco.imagenUrl ? `<img src="${disco.imagenUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">` : '<div style="width: 50px; height: 50px; background: #e0d5c0; border-radius: 5px;"></div>'}
                  <div style="flex: 1;">
                    <strong>${disco.titulo}</strong> - ${disco.artista}
                    <br>
                    <small>📅 ${disco.anio || 'N/A'} | 🎸 ${disco.genero || 'Sin género'}</small>
                    <br>
                    <small>💿 ${estadoTexto} | ${estrellas} (${item.calificacion || 5}/5)</small>
                    <br>
                    <small>📅 Añadido: ${new Date(item.fechaAdquisicion).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      } else if (response.status === 401) {
        window.location.href = 'login.html';
      } else {
        miColeccion.innerHTML = '<p>❌ Error al cargar tu colección</p>';
      }
    } catch (error) {
      console.error('Error:', error);
      miColeccion.innerHTML = '<p>❌ Error de conexión</p>';
    }
  }
  
  // Cargar datos adicionales y colección
  cargarDatosAdicionales();
  cargarColeccion();
  
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

console.log('🎧 App cargada correctamente');