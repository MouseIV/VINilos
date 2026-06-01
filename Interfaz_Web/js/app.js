// ============================================
// 🎧 VINYLMARKET - APP COMPLETA
// ============================================


// Configuración de la API
const API_URL = 'http://localhost:8080/api';

// ============================================
// 🔔 NOTIFICACIONES PERSONALIZADAS (POPUPS)
// ============================================
// Descripción: Muestra notificaciones emergentes en la esquina superior derecha
// Tipos: success (verde), error (rojo), info (marrón)
// ============================================

function mostrarNotificacion(mensaje, tipo = 'info') 
{
  // Eliminar notificaciones anteriores para evitar acumulación
  const notificacionesExistentes = document.querySelectorAll('.toast-notification');
  notificacionesExistentes.forEach(notif => 
  {
    if (notif.parentNode) notif.parentNode.removeChild(notif);
  });
  
  // Crear el elemento de la notificación
  const toast = document.createElement('div');
  toast.className = `toast-notification ${tipo}`;
  toast.innerText = mensaje;
  
  // Añadir al cuerpo de la página
  document.body.appendChild(toast);
  
  // Eliminar automáticamente después de 3 segundos
  setTimeout(() => 
  {
    toast.classList.add('fade-out');
    setTimeout(() => 
    {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 500);
  }, 3000);
}

// ============================================
// 🔐 REGISTRO DE USUARIO
// ============================================
// Descripción: Permite crear una nueva cuenta de usuario
// Validaciones: Contraseña mínima de 10 caracteres
// Endpoint: POST /api/auth/registro
// ============================================

const registerForm = document.getElementById('registerForm');
if (registerForm) 
{
  registerForm.addEventListener('submit', async (e) => 
  {
    e.preventDefault();
    
    // Validar longitud de la contraseña
    const password = document.getElementById('password').value;
    if (password.length < 10) 
    {
      mostrarNotificacion('❌ La contraseña debe tener al menos 10 caracteres', 'error');
      return;
    }
    
    // Preparar datos del usuario
    const userData = {
      nombre: document.getElementById('nombre').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: password
    };
    
    try 
    {
      // Enviar petición al backend
      const response = await fetch(`${API_URL}/auth/registro`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) 
      {
        mostrarNotificacion('✅ Registro exitoso. Redirigiendo al inicio de sesión...', 'success');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
      } 
      else 
      {
        const error = await response.text();
        mostrarNotificacion('❌ Error: ' + error, 'error');
      }
    } 
    catch (error) 
    {
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
    }
  });
}

// ============================================
// 🔐 LOGIN DE USUARIO (INICIO DE SESIÓN)
// ============================================
// Descripción: Autentica al usuario y guarda el token JWT
// Endpoint: POST /api/auth/login
// Almacena: token JWT y datos del usuario en localStorage
// ============================================

// Redirección si ya está logueado (desde la página de inicio)
if (window.location.pathname.includes('index.html') || 
    window.location.pathname === '/' || 
    window.location.pathname === '/index.html') 
{
  const token = localStorage.getItem('token');
  if (token) window.location.href = 'perfil.html';
}

const loginForm = document.getElementById('loginForm');
if (loginForm) 
{
  loginForm.addEventListener('submit', async (e) => 
  {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try 
    {
      const response = await fetch(`${API_URL}/auth/login`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) 
      {
        const data = await response.json();
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          username: data.username,
          tipo: 'comprador'
        }));
        
        mostrarNotificacion(`✅ ¡Bienvenido ${data.nombre || data.username}!`, 'success');
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
      } 
      else 
      {
        mostrarNotificacion('❌ Credenciales inválidas. Verifica tu email y contraseña.', 'error');
      }
    } 
    catch (error) 
    {
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
    }
  });
}

// ============================================
// 🔐 RECUPERACIÓN DE CONTRASEÑA
// ============================================
// Descripción: Simula el envío de un código de recuperación
// Endpoint: POST /api/auth/forgot (simulado)
// ============================================

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) 
{
  forgotForm.addEventListener('submit', async (e) => 
  {
    e.preventDefault();
    mostrarNotificacion('📧 Se ha enviado un código de recuperación a tu correo', 'success');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  });
}

// ============================================
// 🎧 DASHBOARD (TIENDA PRINCIPAL)
// ============================================
// Descripción: Página principal de la tienda
// Funcionalidades:
//   - Vinilos destacados (carrusel)
//   - Búsqueda en Discogs
//   - Sidebars izquierdo (géneros) y derecho (perfil)
//   - Carga aleatoria de vinilos al iniciar
// ============================================

if (window.location.pathname.includes('dashboard.html')) 
{
  // Obtener token y datos del usuario
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Elementos del DOM
  const profileInfo = document.getElementById('profileInfo');
  const logoutBtn = document.getElementById('logoutBtn');
  const miColeccionBtn = document.getElementById('miColeccionBtn');
  const userTypeSelector = document.getElementById('userTypeSelector');
  const userTypeSelect = document.getElementById('userTypeSelect');
  const buyerSection = document.querySelector('.buyer-section');
  const sellerSection = document.querySelector('.seller-section');
  
  // ========== FUNCIÓN PARA ACTUALIZAR SECCIONES SEGÚN TIPO DE USUARIO ==========
  function actualizarSeccionesPorTipo(tipo) 
  {
    if (!buyerSection || !sellerSection) return;
    if (tipo === 'comprador') 
    {
      buyerSection.style.display = 'block';
      sellerSection.style.display = 'none';
    } 
    else if (tipo === 'vendedor') 
    {
      buyerSection.style.display = 'none';
      sellerSection.style.display = 'block';
    } 
    else 
    {
      buyerSection.style.display = 'block';
      sellerSection.style.display = 'block';
    }
  }

  // ========== MOSTRAR INFORMACIÓN DEL PERFIL SI ESTÁ LOGUEADO ==========
  if (token && usuario && profileInfo) 
  {
    const tipoUsuario = usuario.tipo || 'comprador';
    profileInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p><p>${usuario.email}</p>`;
    
    if (userTypeSelector) 
    {
      userTypeSelector.style.display = 'block';
      if (userTypeSelect) userTypeSelect.value = tipoUsuario;
    }
    if (miColeccionBtn) miColeccionBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    actualizarSeccionesPorTipo(tipoUsuario);
  } 
  else if (profileInfo) 
  {
    profileInfo.innerHTML = `<p>Inicia sesión para ver tu perfil</p>
                             <button class="btn" onclick="window.location.href='login.html'">Iniciar sesión</button>
                             <button class="btn btn-secondary" onclick="window.location.href='register.html'">Registrarse</button>`;
    if (userTypeSelector) userTypeSelector.style.display = 'none';
    if (miColeccionBtn) miColeccionBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
  
  // ========== CAMBIO DE TIPO DE USUARIO (COMPRADOR/VENDEDOR) ==========
  if (userTypeSelect) 
  {
    userTypeSelect.onchange = function(e) 
    {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) 
      {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        actualizarSeccionesPorTipo(nuevoTipo);
        mostrarNotificacion(`✅ Tipo de usuario cambiado a: ${nuevoTipo === 'comprador' ? 'Comprador' : nuevoTipo === 'vendedor' ? 'Vendedor' : 'Comprador y Vendedor'}`, 'success');
      }
    };
  }

  // ========== CERRAR SESIÓN ==========
  if (logoutBtn) 
  {
    logoutBtn.onclick = () => { localStorage.clear(); window.location.href = 'login.html'; };
  }
  
  // ========== VINILO DEL DÍA ==========
  // Selecciona un vinilo aleatorio que cambia cada día
  const vinilosLista = [
    'Dark Side of the Moon - Pink Floyd', 
    'Thriller - Michael Jackson', 
    'Abbey Road - The Beatles', 
    'Back in Black - AC/DC'
  ];
  
  const hoy = new Date().toDateString();
  let viniloDia = localStorage.getItem('viniloDia');
  
  if (!viniloDia || !viniloDia.includes(hoy)) 
  {
    viniloDia = vinilosLista[Math.floor(Math.random() * vinilosLista.length)];
    localStorage.setItem('viniloDia', hoy + '|' + viniloDia);
  } 
  else 
  {
    viniloDia = viniloDia.split('|')[1];
  }
  
  const viniloDiaElem = document.getElementById('viniloDelDia');
  if (viniloDiaElem) viniloDiaElem.innerText = viniloDia;
  
  // ========== DESTACADOS (CARRUSEL) ==========
  // Carga vinilos destacados desde Discogs
  const featuredGrid = document.getElementById('featuredGrid');
  
  async function cargarDestacados() 
  {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '<div class="vinyl-card">Cargando destacados...</div>';
    
    try 
    {
      const response = await fetch(`${API_URL}/discos/buscar?q=beatles%20OR%20pink%20floyd%20OR%20michael%20jackson&type=release&per_page=10`);
      
      // Manejar límite de peticiones (rate limit)
      if (response.status === 429) 
      {
        featuredGrid.innerHTML = '<div class="vinyl-card">⏳ Límite de peticiones. Reintentando...</div>';
        setTimeout(() => cargarDestacados(), 3000);
        return;
      }
      
      if (response.ok) 
      {
        let discos = await response.json();
        
        // Filtrar discos válidos
        discos = discos.filter(d => 
          d.artista && 
          d.artista !== 'Artista desconocido' &&
          !d.artista.toLowerCase().includes('various') &&
          d.titulo &&
          d.imagenUrl &&
          d.imagenUrl !== ''
        );
        
        const destacados = discos.slice(0, 6);
        
        if (destacados.length === 0) 
        {
          featuredGrid.innerHTML = '<div class="vinyl-card">No hay destacados disponibles</div>';
          return;
        }
        
        // Generar HTML de las tarjetas destacadas
        featuredGrid.innerHTML = destacados.map(disco => {
          const precio = Math.floor(Math.random() * (35 - 15 + 1) + 15);
          return `<div class="vinyl-card">
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
                  </div>`;
        }).join('');
        
        // Reasignar eventos de scroll del carrusel
        const scrollLeft = document.getElementById('scrollLeft');
        const scrollRight = document.getElementById('scrollRight');
        
        if (scrollLeft && scrollRight) 
        {
          const newScrollLeft = scrollLeft.cloneNode(true);
          const newScrollRight = scrollRight.cloneNode(true);
          scrollLeft.parentNode.replaceChild(newScrollLeft, scrollLeft);
          scrollRight.parentNode.replaceChild(newScrollRight, scrollRight);
          
          newScrollLeft.onclick = () => { featuredGrid.scrollBy({ left: -280, behavior: 'smooth' }); };
          newScrollRight.onclick = () => { featuredGrid.scrollBy({ left: 280, behavior: 'smooth' }); };
        }
      } 
      else 
      {
        featuredGrid.innerHTML = '<div class="vinyl-card">Error al cargar destacados</div>';
      }
    } 
    catch (error) 
    {
      console.error('Error cargando destacados:', error);
      featuredGrid.innerHTML = '<div class="vinyl-card">Error de conexión</div>';
    }
  }

  // ========== SIDEBARS (MENÚS LATERALES) ==========
  // Controla la apertura y cierre de los sidebars izquierdo y derecho
  const sidebarLeft = document.getElementById('sidebarLeft');
  const sidebarRight = document.getElementById('sidebarRight');
  const overlay = document.getElementById('sidebarOverlay');
  const openLeft = document.getElementById('openSidebarLeft');
  const closeLeft = document.getElementById('closeSidebarLeft');
  const openRight = document.getElementById('openSidebarRight');
  const closeRight = document.getElementById('closeSidebarRight');
  const body = document.body;

  function cerrarSidebars() 
  {
    if (sidebarLeft) sidebarLeft.classList.remove('active');
    if (sidebarRight) sidebarRight.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.classList.remove('sidebar-left-open', 'sidebar-right-open');
    if (openLeft) openLeft.style.visibility = 'visible';
    if (openRight) openRight.style.visibility = 'visible';
  }

  function abrirSidebarLeft() 
  {
    cerrarSidebars();
    if (sidebarLeft) sidebarLeft.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-left-open');
    if (openLeft) openLeft.style.visibility = 'hidden';
    if (openRight) openRight.style.visibility = 'visible';
  }

  function abrirSidebarRight() 
  {
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
  
  // Cerrar sidebars con la tecla Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarSidebars(); });

  // ========== FUNCIÓN PARA LEER PARÁMETROS DE LA URL ==========
  // Útil para búsquedas desde la página de inicio
  function getParameterByName(name) 
  {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // ========== VINILOS ALEATORIOS ==========
  // Carga vinilos aleatorios desde Discogs al iniciar la página
  const vinylGrid = document.getElementById('vinylGrid');
  
  const artistasPopulares = [
    'pink floyd', 'beatles', 'michael jackson', 'queen', 'ac dc',
    'nirvana', 'radiohead', 'bowie', 'led zeppelin', 'rolling stones',
    'fleetwood mac', 'prince', 'u2', 'metallica', 'guns and roses',
    'abba', 'elvis presley', 'bob dylan', 'the clash', 'ramones'
  ];

  let discosEnCache = null;
  let ultimaPeticion = 0;
  let generosDisponibles = new Set();

  // ========== FUNCIONES DE GÉNEROS ==========
  // Extrae géneros de los discos mostrados y actualiza la lista en el sidebar
  function actualizarGeneros(discos) 
  {
    if (!discos || discos.length === 0) return;
    
    discos.forEach(disco => 
    {
      if (disco.genero && disco.genero !== 'Sin género') 
      {
        const generos = disco.genero.split(/[,/]/).map(g => g.trim());
        generos.forEach(g => { if (g && g !== 'Sin género' && g !== '') generosDisponibles.add(g); });
      }
    });
    
    renderizarListaGeneros();
  }

  function renderizarListaGeneros() 
  {
    const generosList = document.getElementById('generosList');
    if (!generosList) return;
    
    if (generosDisponibles.size === 0) 
    {
      generosList.innerHTML = '<div class="loading-text">No hay géneros disponibles</div>';
      return;
    }
    
    const generosOrdenados = Array.from(generosDisponibles).sort();
    generosList.innerHTML = generosOrdenados.map(genero => 
      `<div class="genero-item" data-genero="${genero}">🎸 ${genero}</div>`
    ).join('');
    
    // Añadir evento de clic a cada género
    document.querySelectorAll('.genero-item').forEach(item => 
    {
      item.addEventListener('click', () => { buscarPorGenero(item.dataset.genero); });
    });
  }

  async function buscarPorGenero(genero) 
  {
    if (!genero) return;
    
    mostrarNotificacion(`🔍 Buscando discos de ${genero}...`, 'info');
    vinylGrid.innerHTML = '<p>🔄 Cargando discos por género...</p>';
    
    try 
    {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(genero)}&type=release&per_page=30`);
      
      if (response.status === 429) 
      { 
        setTimeout(() => buscarPorGenero(genero), 3000); 
        return; 
      }
      
      if (response.ok) 
      {
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
        
        if (discos.length === 0) 
        { 
          vinylGrid.innerHTML = '<p>🎧 No se encontraron discos de este género.</p>'; 
          return; 
        }
        
        if (discos.length > 15) 
        {
          discos = discos.sort(() => 0.5 - Math.random()).slice(0, 15);
        }
        
        mostrarVinilos(discos);
        mostrarNotificacion(`✅ Encontrados ${discos.length} discos de ${genero}`, 'success');
        actualizarGeneros(discos);
      } 
      else 
      { 
        vinylGrid.innerHTML = '<p>❌ Error al buscar por género</p>'; 
      }
    } 
    catch (error) 
    { 
      vinylGrid.innerHTML = '<p>❌ Error de conexión</p>'; 
    }
  }

  // ========== BOTONES DEL SIDEBAR ==========
  // Funcionalidades próximas (muestran notificaciones)
  function inicializarBotonesSidebar() 
  {
    const btnMasSolicitados = document.getElementById('btnMasSolicitados');
    const btnGrandesOfertas = document.getElementById('btnGrandesOfertas');
    const btnTopVentas = document.getElementById('btnTopVentas');
    const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion');
    
    if (btnMasSolicitados) 
    {
      btnMasSolicitados.addEventListener('click', () => 
      {
        mostrarNotificacion('🎧 Próximamente: Los vinilos más solicitados por la comunidad', 'info');
      });
    }
    
    if (btnGrandesOfertas) 
    {
      btnGrandesOfertas.addEventListener('click', () => 
      {
        mostrarNotificacion('💸 Próximamente: Las mejores ofertas y descuentos', 'info');
      });
    }
    
    if (btnTopVentas) 
    {
      btnTopVentas.addEventListener('click', () => 
      {
        mostrarNotificacion('📈 Próximamente: Los vinilos más vendidos del mes', 'info');
      });
    }
    
    if (btnNuevaPublicacion) 
    {
      btnNuevaPublicacion.addEventListener('click', () => 
      {
        mostrarNotificacion('➕ Próximamente: Publica tus propios vinilos a la venta', 'info');
      });
    }
  }

  // ========== MOSTRAR VINILOS (TARJETAS) ==========
  // Genera el HTML de las tarjetas de vinilo
  function mostrarVinilos(discos) 
  {
    if (!vinylGrid) return;
    if (!discos || discos.length === 0) 
    { 
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
      
      return `<div class="vinyl-card">
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
              </div>`;
    }).join('');
    
    // Asignar eventos a los botones de importar
    if (tokenActual) 
    {
      document.querySelectorAll('.import-btn').forEach(btn => 
      {
        btn.onclick = async () => 
        {
          const discoData = { 
            titulo: btn.dataset.titulo, 
            artista: btn.dataset.artista, 
            anio: parseInt(btn.dataset.anio) || 0, 
            genero: btn.dataset.genero, 
            imagenUrl: btn.dataset.imagen 
          };
          try 
          {
            const res = await fetch(`${API_URL}/discos`, 
            { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenActual}` }, 
              body: JSON.stringify(discoData) 
            });
            res.ok ? mostrarNotificacion('✅ Disco importado a tu colección', 'success') : mostrarNotificacion('❌ Error al importar', 'error');
          } 
          catch (error) 
          { 
            mostrarNotificacion('❌ Error de conexión', 'error'); 
          }
        };
      });
    }
    
    // Actualizar lista de géneros con los nuevos discos
    actualizarGeneros(discos);
  }

  // ========== CARGAR VINILOS ALEATORIOS ==========
  // Realiza una búsqueda combinada de varios artistas populares
  async function cargarVinilosAleatorios() 
  {
    if (!vinylGrid) return;
    
    const ahora = Date.now();
    if (discosEnCache && (ahora - ultimaPeticion) < 30000) 
    { 
      mostrarVinilos(discosEnCache); 
      return; 
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando vinilos destacados...</p>';
    
    try 
    {
      const artistasSeleccionados = [...artistasPopulares]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const query = artistasSeleccionados.join(' ');
      
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}&type=release&per_page=50`);
      
      // Manejar rate limit
      if (response.status === 429) 
      { 
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Reintentando...</p>'; 
        setTimeout(() => cargarVinilosAleatorios(), 3000); 
        return; 
      }
      
      if (response.ok) 
      {
        let discos = await response.json();
        
        // Filtrar discos válidos
        discos = discos.filter(d => 
          d.artista && 
          d.artista !== 'Artista desconocido' &&
          !d.artista.toLowerCase().includes('various') &&
          d.titulo &&
          d.imagenUrl && 
          d.imagenUrl !== '' &&
          !d.imagenUrl.includes('blank.png')
        );
        
        if (discos.length === 0) 
        { 
          setTimeout(() => cargarVinilosAleatorios(), 1000); 
          return; 
        }
        
        // Eliminar duplicados
        const discosUnicos = [];
        const idsVistos = new Set();
        for (const disco of discos) 
        { 
          const id = `${disco.artista}-${disco.titulo}`; 
          if (!idsVistos.has(id)) 
          { 
            idsVistos.add(id); 
            discosUnicos.push(disco); 
          } 
        }
        
        let discosFinal = discosUnicos;
        if (discosUnicos.length > 15) 
        {
          discosFinal = discosUnicos.sort(() => 0.5 - Math.random()).slice(0, 15);
        }
        
        discosEnCache = discosFinal;
        ultimaPeticion = ahora;
        mostrarVinilos(discosFinal);
      } 
      else 
      {
        if (discosEnCache) mostrarVinilos(discosEnCache);
        else vinylGrid.innerHTML = '<p>❌ Error al cargar vinilos</p>';
      }
    } 
    catch (error) 
    {
      if (discosEnCache) mostrarVinilos(discosEnCache);
      else vinylGrid.innerHTML = '<p>❌ Error de conexión</p>';
    }
  }

  // ========== BÚSQUEDA MANUAL ==========
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  async function buscarVinilos(query) 
  {
    if (!query.trim()) 
    { 
      mostrarNotificacion('⚠️ Escribe un artista o título para buscar', 'info'); 
      return; 
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    
    try 
    {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      
      if (response.status === 429) 
      { 
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Espera unos segundos...</p>'; 
        setTimeout(() => buscarVinilos(query), 3000); 
        return; 
      }
      
      if (response.ok) 
      { 
        const discos = await response.json(); 
        mostrarVinilos(discos); 
      }
      else 
      { 
        vinylGrid.innerHTML = '<p>❌ Error al buscar</p>'; 
      }
    } 
    catch(e) 
    { 
      vinylGrid.innerHTML = '<p>❌ Error de conexión</p>'; 
    }
  }
  
  if (searchBtn) searchBtn.onclick = () => buscarVinilos(searchInput.value);
  if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') buscarVinilos(searchInput.value); });

  // ========== BÚSQUEDA DESDE INDEX (PARÁMETRO DE URL) ==========
  const buscarQuery = getParameterByName('buscar');
  if (buscarQuery) 
  {
    setTimeout(() => 
    {
      if (searchInput) 
      { 
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
// Descripción: Página de perfil del usuario
// Funcionalidades:
//   - Ver y editar datos personales (ciudad, teléfono, tipo de coleccionista)
//   - Ver colección personal de vinilos
//   - Añadir vinilos manualmente
//   - Editar estado y calificación de vinilos
//   - Eliminar vinilos de la colección
//   - Estadísticas de la colección (total, calificación media, género favorito, década favorita)
// ============================================

if (window.location.pathname.includes('perfil.html')) 
{
  const token = localStorage.getItem('token');
  if (!token) window.location.href = 'login.html';
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  // Mostrar información básica del perfil
  const perfilInfo = document.getElementById('perfilInfo');
  if (perfilInfo && usuario) 
  {
    const tipoTexto = usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    perfilInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p>
                            <p>📧 ${usuario.email}</p>
                            <p>🎭 ${tipoTexto}</p>`;
  }
  
  // Información en el sidebar derecho
  const sidebarProfileInfo = document.getElementById('sidebarProfileInfo');
  if (sidebarProfileInfo && usuario) 
  {
    const tipoTexto = usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    sidebarProfileInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p>
                                    <p>📧 ${usuario.email}</p>
                                    <p>🎭 ${tipoTexto}</p>`;
  }
  
  // ========== SIDEBAR DERECHO ==========
  const sidebarRight = document.getElementById('sidebarRight');
  const overlay = document.getElementById('sidebarOverlay');
  const openRight = document.getElementById('openSidebarRight');
  const closeRight = document.getElementById('closeSidebarRight');
  const body = document.body;
  
  function cerrarSidebar() 
  {
    if (sidebarRight) sidebarRight.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.classList.remove('sidebar-right-open');
  }
  
  function abrirSidebar() 
  {
    cerrarSidebar();
    if (sidebarRight) sidebarRight.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-right-open');
  }
  
  if (openRight) openRight.onclick = abrirSidebar;
  if (closeRight) closeRight.onclick = cerrarSidebar;
  if (overlay) overlay.onclick = cerrarSidebar;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarSidebar(); });
  
  // ========== CAMBIO DE TIPO DE USUARIO ==========
  const userTypeSelect = document.getElementById('userTypeSelect');
  if (userTypeSelect) 
  {
    userTypeSelect.value = usuario?.tipo || 'comprador';
    userTypeSelect.onchange = function(e) 
    {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) 
      {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        mostrarNotificacion(`✅ Tipo cambiado a: ${nuevoTipo === 'comprador' ? 'Comprador' : nuevoTipo === 'vendedor' ? 'Vendedor' : 'Comprador y Vendedor'}`, 'success');
        const tipoTexto = nuevoTipo === 'comprador' ? '🟡 Comprador' : nuevoTipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
        if (perfilInfo) perfilInfo.innerHTML = `<p><strong>${usuarioActual.nombre || usuarioActual.username}</strong></p><p>📧 ${usuarioActual.email}</p><p>🎭 ${tipoTexto}</p>`;
        if (sidebarProfileInfo) sidebarProfileInfo.innerHTML = `<p><strong>${usuarioActual.nombre || usuarioActual.username}</strong></p><p>📧 ${usuarioActual.email}</p><p>🎭 ${tipoTexto}</p>`;
      }
    };
  }
  
  // ========== DATOS ADICIONALES DEL USUARIO ==========
  // Guarda ciudad, teléfono y tipo de coleccionista en localStorage
  function cargarDatosAdicionales() 
  {
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
  
  function guardarDatosAdicionales() 
  {
    const ciudad = document.getElementById('ciudad')?.value || '';
    const telefono = document.getElementById('telefono')?.value || '';
    const tipoColeccionista = document.getElementById('tipoColeccionista')?.value || 'principiante';
    localStorage.setItem('user_ciudad', ciudad);
    localStorage.setItem('user_telefono', telefono);
    localStorage.setItem('user_tipo_coleccionista', tipoColeccionista);
    mostrarNotificacion('✅ Datos adicionales guardados correctamente', 'success');
  }
  
  const guardarDatosBtn = document.getElementById('guardarDatosAdicionales');
  if (guardarDatosBtn) guardarDatosBtn.onclick = guardarDatosAdicionales;
  
  // ========== SISTEMA DE VALORACIÓN CON ESTRELLAS ==========
  // Permite calificar un vinículo de 1 a 5 estrellas
  function inicializarRatingStars() 
  {
    const ratingStars = document.getElementById('ratingStarsNew');
    if (!ratingStars) return;
    
    const stars = ratingStars.querySelectorAll('span');
    let valorActual = 5;
    
    stars.forEach(star => 
    {
      star.addEventListener('click', function() 
      {
        valorActual = parseInt(this.dataset.valor);
        stars.forEach(s => s.classList.remove('active'));
        for (let i = 0; i < valorActual; i++) stars[i].classList.add('active');
        document.getElementById('calificacionNueva').value = valorActual;
      });
    });
    
    for (let i = 0; i < 5; i++) stars[i].classList.add('active');
  }
  inicializarRatingStars();
  
  // ========== AGREGAR VINILO MANUALMENTE ==========
  // Permite añadir un vinilo a la colección sin usar Discogs
  async function agregarViniloManual() 
  {
    const titulo = document.getElementById('nuevoTitulo')?.value.trim();
    const artista = document.getElementById('nuevoArtista')?.value.trim();
    const anio = parseInt(document.getElementById('nuevoAnio')?.value) || 0;
    const genero = document.getElementById('nuevoGenero')?.value.trim() || 'Sin género';
    const imagenUrl = document.getElementById('nuevaImagen')?.value.trim() || '';
    const estadoVinilo = document.getElementById('estadoVinilo')?.value || 'NUEVO';
    const calificacion = parseInt(document.getElementById('calificacionNueva')?.value) || 5;
    
    if (!titulo || !artista) 
    {
      mostrarNotificacion('❌ El título y el artista son obligatorios', 'error');
      return;
    }
    
    const discoData = { titulo, artista, anio, genero, imagenUrl };
    
    try 
    {
      const response = await fetch(`${API_URL}/discos`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(discoData)
      });
      
      if (response.ok) 
      {
        const discoGuardado = await response.json();
        const discoId = discoGuardado.id;
        const coleccionData = { discoId: discoId, estado: estadoVinilo, calificacion: calificacion };
        
        const coleccionResponse = await fetch(`${API_URL}/discos/${discoId}/agregar`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(coleccionData)
        });
        
        if (coleccionResponse.ok) 
        {
          mostrarNotificacion('✅ Vinilo añadido a tu colección', 'success');
          ['nuevoTitulo', 'nuevoArtista', 'nuevoAnio', 'nuevoGenero', 'nuevaImagen'].forEach(id => 
          { 
            const input = document.getElementById(id); 
            if (input) input.value = ''; 
          });
          cargarColeccion();
          cerrarSidebar();
        } 
        else 
        { 
          mostrarNotificacion('❌ Error al añadir a colección', 'error'); 
        }
      } 
      else 
      { 
        mostrarNotificacion('❌ Error al guardar el disco', 'error'); 
      }
    } 
    catch (error) 
    { 
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error'); 
    }
  }
  
  const agregarBtn = document.getElementById('btnAgregarVinilo');
  if (agregarBtn) agregarBtn.onclick = agregarViniloManual;
  
  // ========== ESTADÍSTICAS DE LA COLECCIÓN ==========
  // Calcula total de vinilos, calificación media, género favorito, década favorita
  function calcularEstadisticas(coleccion) 
  {
    const total = coleccion.length;
    if (total === 0) return null;
    
    const generos = {};
    let sumaCalificaciones = 0;
    const decadas = {};
    
    coleccion.forEach(item => 
    {
      const disco = item.disco;
      const genero = disco.genero || 'Sin género';
      generos[genero] = (generos[genero] || 0) + 1;
      sumaCalificaciones += (item.calificacion || 5);
      
      if (disco.anio && disco.anio > 0) 
      {
        const decada = Math.floor(disco.anio / 10) * 10;
        decadas[decada] = (decadas[decada] || 0) + 1;
      }
    });
    
    let generoFavorito = '', maxGenero = 0;
    for (const [genero, count] of Object.entries(generos)) 
    { 
      if (count > maxGenero) 
      { 
        maxGenero = count; 
        generoFavorito = genero; 
      } 
    }
    
    let decadaFavorita = '', maxDecada = 0;
    for (const [decada, count] of Object.entries(decadas)) 
    { 
      if (count > maxDecada) 
      { 
        maxDecada = count; 
        decadaFavorita = decada; 
      } 
    }
    
    return { 
      total, 
      calificacionMedia: (sumaCalificaciones / total).toFixed(1), 
      generoFavorito, 
      decadaFavorita: decadaFavorita ? `${decadaFavorita}s` : 'N/A', 
      generoCount: maxGenero, 
      decadaCount: maxDecada 
    };
  }
  
  function mostrarEstadisticas(coleccion) 
  {
    const statsContainer = document.getElementById('estadisticasColeccion');
    if (!statsContainer) return;
    
    const stats = calcularEstadisticas(coleccion);
    
    if (!stats) 
    { 
      statsContainer.innerHTML = '<p style="text-align: center;">📊 Añade vinilos para ver tus estadísticas</p>'; 
      return; 
    }
    
    statsContainer.innerHTML = `<div class="estadistica-item">
                                  <span class="valor">${stats.total}</span>
                                  <span class="label">🎵 Total vinilos</span>
                                </div>
                                <div class="estadistica-item">
                                  <span class="valor">${stats.calificacionMedia}⭐</span>
                                  <span class="label">📊 Calificación media</span>
                                </div>
                                <div class="estadistica-item">
                                  <span class="valor">${stats.generoFavorito}</span>
                                  <span class="label">🎸 Género favorito (${stats.generoCount})</span>
                                </div>
                                <div class="estadistica-item">
                                  <span class="valor">${stats.decadaFavorita}</span>
                                  <span class="label">📅 Década favorita (${stats.decadaCount})</span>
                                </div>`;
  }
  
  // ========== MODAL PARA EDITAR VINILO ==========
  let viniloEditando = null;
  
  function crearModal() 
  {
    if (document.getElementById('modalEditar')) return;
    
    const modal = document.createElement('div');
    modal.id = 'modalEditar';
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal-content">
                        <h3>✏️ Editar vinilo</h3>
                        <div class="input-group">
                          <label>📀 Estado</label>
                          <select id="editEstado">
                            <option value="NUEVO">🟢 Nuevo</option>
                            <option value="MUY_BUENO">🟡 Muy bueno</option>
                            <option value="BUENO">🟠 Bueno</option>
                            <option value="REGULAR">🔴 Regular</option>
                          </select>
                        </div>
                        <div class="input-group">
                          <label>⭐ Calificación</label>
                          <div class="rating-stars-edit" id="ratingStarsEdit">
                            <span data-valor="1">☆</span><span data-valor="2">☆</span>
                            <span data-valor="3">☆</span><span data-valor="4">☆</span>
                            <span data-valor="5">☆</span>
                          </div>
                        </div>
                        <div class="modal-buttons">
                          <button id="guardarEdicionBtn" class="btn">💾 Guardar</button>
                          <button id="cancelarEdicionBtn" class="btn btn-secondary">Cancelar</button>
                        </div>
                      </div>`;
    document.body.appendChild(modal);
    
    const starsEdit = document.querySelectorAll('#ratingStarsEdit span');
    starsEdit.forEach(star => 
    {
      star.addEventListener('click', function() 
      {
        const valor = parseInt(this.dataset.valor);
        starsEdit.forEach(s => s.classList.remove('active'));
        for (let i = 0; i < valor; i++) starsEdit[i].classList.add('active');
        let input = document.getElementById('editCalificacion');
        if (!input) 
        { 
          input = document.createElement('input'); 
          input.type = 'hidden'; 
          input.id = 'editCalificacion'; 
          modal.querySelector('.modal-content').appendChild(input); 
        }
        input.value = valor;
      });
    });
    
    document.getElementById('guardarEdicionBtn').onclick = guardarEdicionVinilo;
    document.getElementById('cancelarEdicionBtn').onclick = () => { modal.classList.remove('active'); viniloEditando = null; };
  }
  
  function abrirModalEditar(item) 
  {
    crearModal();
    viniloEditando = item;
    const modal = document.getElementById('modalEditar');
    document.getElementById('editEstado').value = item.estado || 'NUEVO';
    
    const calificacion = item.calificacion || 5;
    const starsEdit = document.querySelectorAll('#ratingStarsEdit span');
    starsEdit.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < calificacion; i++) starsEdit[i].classList.add('active');
    
    let input = document.getElementById('editCalificacion');
    if (!input) 
    { 
      input = document.createElement('input'); 
      input.type = 'hidden'; 
      input.id = 'editCalificacion'; 
      modal.querySelector('.modal-content').appendChild(input); 
    }
    input.value = calificacion;
    modal.classList.add('active');
  }
  
  async function guardarEdicionVinilo() 
  {
    if (!viniloEditando) return;
    
    const nuevoEstado = document.getElementById('editEstado').value;
    const nuevaCalificacion = parseInt(document.getElementById('editCalificacion')?.value || 5);
    
    try 
    {
      const response = await fetch(`${API_URL}/coleccion/${viniloEditando.id}`, 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado, calificacion: nuevaCalificacion })
      });
      
      if (response.ok) 
      {
        mostrarNotificacion('✅ Vinilo actualizado correctamente', 'success');
        document.getElementById('modalEditar').classList.remove('active');
        cargarColeccion();
        viniloEditando = null;
      } 
      else 
      { 
        mostrarNotificacion('❌ Error al actualizar', 'error'); 
      }
    } 
    catch (error) 
    { 
      mostrarNotificacion('❌ Error de conexión', 'error'); 
    }
  }
  
  // ========== ELIMINAR VINILO ==========
  async function eliminarVinilo(coleccionId, titulo) 
  {
    if (confirm(`¿Seguro que quieres eliminar "${titulo}" de tu colección?`)) 
    {
      try 
      {
        const response = await fetch(`${API_URL}/coleccion/${coleccionId}`, 
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) 
        {
          mostrarNotificacion('✅ Vinilo eliminado de tu colección', 'success');
          cargarColeccion();
        } 
        else 
        { 
          mostrarNotificacion('❌ Error al eliminar', 'error'); 
        }
      } 
      catch (error) 
      { 
        mostrarNotificacion('❌ Error de conexión', 'error'); 
      }
    }
  }
  
  // ========== CARGAR COLECCIÓN ==========
  async function cargarColeccion() 
  {
    const miColeccion = document.getElementById('miColeccion');
    if (!miColeccion) return;
    
    miColeccion.innerHTML = '<p style="text-align: center;">🔄 Cargando tu colección...</p>';
    
    try 
    {
      const response = await fetch(`${API_URL}/discos/mi-coleccion`, 
      { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (response.ok) 
      {
        const coleccion = await response.json();
        mostrarEstadisticas(coleccion);
        
        if (coleccion.length === 0) 
        {
          miColeccion.innerHTML = `<div class="coleccion-vacio">
                                    🎧 Aún no tienes nada en tu colección
                                    <br><br>
                                    <button class="btn" onclick="document.getElementById('openSidebarRight').click()" 
                                            style="width: auto; display: inline-block; padding: 8px 20px;">
                                      ➕ Añadir mi primer vinilo
                                    </button>
                                  </div>`;
        } 
        else 
        {
          miColeccion.innerHTML = coleccion.map(item => {
            const disco = item.disco;
            const estadoTexto = { 'NUEVO': '🟢 Nuevo', 'MUY_BUENO': '🟡 Muy bueno', 'BUENO': '🟠 Bueno', 'REGULAR': '🔴 Regular' }[item.estado] || item.estado;
            const estrellas = '⭐'.repeat(item.calificacion || 5);
            return `<div class="vinyl-card-small">
                      <div style="display: flex; gap: 15px; align-items: center; flex-wrap: wrap;">
                        ${disco.imagenUrl ? 
                          `<img src="${disco.imagenUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">` : 
                          '<div style="width: 50px; height: 50px; background: #e0d5c0; border-radius: 5px; display: flex; align-items: center; justify-content: center;">🎵</div>'
                        }
                        <div style="flex: 1;">
                          <strong>${disco.titulo}</strong> - ${disco.artista}<br>
                          <small>📅 ${disco.anio || 'N/A'} | 🎸 ${disco.genero || 'Sin género'}</small><br>
                          <small>💿 ${estadoTexto} | ${estrellas} (${item.calificacion || 5}/5)</small><br>
                          <small>📅 Añadido: ${new Date(item.fechaAdquisicion).toLocaleDateString()}</small>
                        </div>
                        <div>
                          <button class="btn-editar" data-id="${item.id}" data-estado="${item.estado}" data-calificacion="${item.calificacion}">✏️ Editar</button>
                          <button class="btn-eliminar" data-id="${item.id}" data-titulo="${disco.titulo}">🗑️ Eliminar</button>
                        </div>
                      </div>
                    </div>`;
          }).join('');
          
          // Eventos para botones de editar
          document.querySelectorAll('.btn-editar').forEach(btn => 
          {
            btn.addEventListener('click', () => 
            {
              abrirModalEditar({ 
                id: btn.dataset.id, 
                estado: btn.dataset.estado, 
                calificacion: parseInt(btn.dataset.calificacion) 
              });
            });
          });
          
          // Eventos para botones de eliminar
          document.querySelectorAll('.btn-eliminar').forEach(btn => 
          {
            btn.addEventListener('click', () => 
            {
              eliminarVinilo(btn.dataset.id, btn.dataset.titulo);
            });
          });
        }
      } 
      else if (response.status === 401) 
      { 
        window.location.href = 'login.html'; 
      }
      else 
      { 
        miColeccion.innerHTML = '<p style="text-align: center;">❌ Error al cargar tu colección</p>'; 
      }
    } 
    catch (error) 
    { 
      console.error('Error:', error); 
      miColeccion.innerHTML = '<p style="text-align: center;">❌ Error de conexión</p>'; 
    }
  }
  
  cargarDatosAdicionales();
  cargarColeccion();
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => { localStorage.clear(); window.location.href = 'login.html'; };
}

// ============================================
// 🚪 FUNCIONES GLOBALES
// ============================================

window.verPerfil = function() { window.location.href = 'perfil.html'; };
window.cerrarSesion = function() { localStorage.clear(); window.location.href = 'login.html'; };

console.log('🎧 App cargada correctamente');