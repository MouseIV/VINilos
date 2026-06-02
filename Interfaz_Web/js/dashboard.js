// ============================================
// 🎧 DASHBOARD - TIENDA PRINCIPAL
// ============================================

if (window.location.pathname.includes('dashboard.html')) {
  
  // ========== AVISO DE PÁGINA EN DESARROLLO ==========
  setTimeout(() => {
    mostrarNotificacionPorCodigo('FINETUNING_BIENVENIDA');
  }, 1500);
  
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  const profileInfo = document.getElementById('profileInfo');
  const logoutBtn = document.getElementById('logoutBtn');
  const miColeccionBtn = document.getElementById('miColeccionBtn');
  const userTypeSelector = document.getElementById('userTypeSelector');
  const userTypeSelect = document.getElementById('userTypeSelect');
  const buyerSection = document.querySelector('.buyer-section');
  const sellerSection = document.querySelector('.seller-section');
  
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

  if (token && usuario && profileInfo) {
    const tipoUsuario = usuario.tipo || 'comprador';
    profileInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p><p>${usuario.email}</p>`;
    
    if (userTypeSelector) {
      userTypeSelector.style.display = 'block';
      if (userTypeSelect) userTypeSelect.value = tipoUsuario;
    }
    if (miColeccionBtn) miColeccionBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    actualizarSeccionesPorTipo(tipoUsuario);
  } else if (profileInfo) {
    profileInfo.innerHTML = `<p>Inicia sesión para ver tu perfil</p>
                             <button class="btn" onclick="window.location.href='login.html'">Iniciar sesión</button>
                             <button class="btn btn-secondary" onclick="window.location.href='register.html'">Registrarse</button>`;
    if (userTypeSelector) userTypeSelector.style.display = 'none';
    if (miColeccionBtn) miColeccionBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
  
  if (userTypeSelect) {
    userTypeSelect.onchange = function(e) {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        actualizarSeccionesPorTipo(nuevoTipo);
        mostrarNotificacionPorCodigo('TIPO_USUARIO_CAMBIADO');
      }
    };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => { 
      localStorage.clear(); 
      mostrarNotificacionPorCodigo('CERRAR_SESION');
      setTimeout(() => { window.location.href = 'login.html'; }, 500);
    };
  }
  
  const vinilosLista = [
    'Dark Side of the Moon - Pink Floyd', 
    'Thriller - Michael Jackson', 
    'Abbey Road - The Beatles', 
    'Back in Black - AC/DC'
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
  
  const featuredGrid = document.getElementById('featuredGrid');
  
  async function cargarDestacados() {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '<div class="vinyl-card">Cargando destacados...</div>';
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=beatles%20OR%20pink%20floyd%20OR%20michael%20jackson&type=release&per_page=10`);
      
      if (response.status === 429) {
        featuredGrid.innerHTML = '<div class="vinyl-card">⏳ Límite de peticiones. Reintentando...</div>';
        mostrarNotificacionPorCodigo('FINETUNING_LIMITE');
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
        
        const scrollLeft = document.getElementById('scrollLeft');
        const scrollRight = document.getElementById('scrollRight');
        
        if (scrollLeft && scrollRight) {
          const newScrollLeft = scrollLeft.cloneNode(true);
          const newScrollRight = scrollRight.cloneNode(true);
          scrollLeft.parentNode.replaceChild(newScrollLeft, scrollLeft);
          scrollRight.parentNode.replaceChild(newScrollRight, scrollRight);
          
          newScrollLeft.onclick = () => { featuredGrid.scrollBy({ left: -280, behavior: 'smooth' }); };
          newScrollRight.onclick = () => { featuredGrid.scrollBy({ left: 280, behavior: 'smooth' }); };
        }
      } else {
        featuredGrid.innerHTML = '<div class="vinyl-card">Error al cargar destacados</div>';
        mostrarNotificacionPorCodigo('ERROR_CONEXION_DESTACADOS');
      }
    } catch (error) {
      console.error('Error cargando destacados:', error);
      featuredGrid.innerHTML = '<div class="vinyl-card">Error de conexión</div>';
      mostrarNotificacionPorCodigo('ERROR_CONEXION_DESTACADOS');
    }
  }

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
  
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarSidebars(); });

  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

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

  function actualizarGeneros(discos) {
    if (!discos || discos.length === 0) return;
    
    discos.forEach(disco => {
      if (disco.genero && disco.genero !== 'Sin género') {
        const generos = disco.genero.split(/[,/]/).map(g => g.trim());
        generos.forEach(g => { if (g && g !== 'Sin género' && g !== '') generosDisponibles.add(g); });
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
        mostrarNotificacionPorCodigo('BUSCANDO_GENERO', genero);
        buscarPorGenero(genero);
        const generosContenido = document.getElementById('generosList');
        if (generosContenido) {
          generosContenido.classList.add('collapsed');
          const icon = document.getElementById('generosIcon');
          if (icon) icon.innerHTML = '▶';
        }
      });
    });
  }

  async function buscarPorGenero(genero) {
    if (!genero) return;
    
    vinylGrid.innerHTML = '<p>🔄 Cargando discos por género...</p>';
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(genero)}&type=release&per_page=30`);
      
      if (response.status === 429) {
        vinylGrid.innerHTML = '<p>⏳ Límite de peticiones. Reintentando...</p>';
        mostrarNotificacionPorCodigo('FINETUNING_LIMITE');
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
          vinylGrid.innerHTML = `<p>🎧 No se encontraron discos de "${genero}".</p>
                                  <p style="font-size: 14px; margin-top: 10px;">🎧 VinylMarket está en fase de finetuning. Pronto habrá más variedad de géneros.</p>`;
          mostrarNotificacionPorCodigo('FINETUNING_GENERO_VACIO');
          return;
        }
        
        if (discos.length > 15) {
          discos = discos.sort(() => 0.5 - Math.random()).slice(0, 15);
        }
        
        mostrarVinilos(discos);
        mostrarNotificacionPorCodigo('DISCOS_ENCONTRADOS_GENERO', discos.length, genero);
        actualizarGeneros(discos);
        
        if (discos.length < 3) {
          mostrarNotificacionPorCodigo('FINETUNING_POCOS_RESULTADOS');
        }
      } else if (response.status === 500) {
        vinylGrid.innerHTML = '<p>⚠️ Estamos mejorando nuestro catálogo. Pronto habrá más discos por género.</p>';
        mostrarNotificacionPorCodigo('FINETUNING_ERROR_SERVIDOR');
      } else {
        vinylGrid.innerHTML = '<p>❌ Error al buscar por género. La página está en desarrollo.</p>';
        mostrarNotificacionPorCodigo('GENERO_BUSQUEDA_FALLIDA');
      }
    } catch (error) {
      console.error(error);
      vinylGrid.innerHTML = '<p>❌ Error de conexión. VinylMarket está en fase de mejora.</p>';
      mostrarNotificacionPorCodigo('ERROR_CONEXION_GENERO');
    }
  }

  function inicializarBotonesSidebar() {
    const btnMasSolicitados = document.getElementById('btnMasSolicitados');
    const btnGrandesOfertas = document.getElementById('btnGrandesOfertas');
    const btnTopVentas = document.getElementById('btnTopVentas');
    const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion');
    
    if (btnMasSolicitados) {
      btnMasSolicitados.addEventListener('click', () => {
        mostrarNotificacionPorCodigo('PROXIMAMENTE_SOLICITADOS');
      });
    }
    
    if (btnGrandesOfertas) {
      btnGrandesOfertas.addEventListener('click', () => {
        mostrarNotificacionPorCodigo('PROXIMAMENTE_OFERTAS');
      });
    }
    
    if (btnTopVentas) {
      btnTopVentas.addEventListener('click', () => {
        mostrarNotificacionPorCodigo('PROXIMAMENTE_TOP_VENTAS');
      });
    }
    
    if (btnNuevaPublicacion) {
      btnNuevaPublicacion.addEventListener('click', () => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const tipo = usuario?.tipo || 'comprador';
        
        if (tipo === 'comprador') {
          mostrarNotificacionPorCodigo('PUBLICAR_SOLO_VENDEDOR');
        } else {
          mostrarNotificacionPorCodigo('PROXIMAMENTE_PUBLICAR');
        }
      });
    }
  }

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
              mostrarNotificacionPorCodigo('VINILO_IMPORTADO');
            } else {
              mostrarNotificacionPorCodigo('IMPORTAR_FALLIDO');
            }
          } catch (error) {
            mostrarNotificacionPorCodigo('ERROR_CONEXION_IMPORTAR');
          }
        };
      });
    }
    
    actualizarGeneros(discos);
  }

  async function cargarVinilosAleatorios() {
    if (!vinylGrid) return;
    
    const ahora = Date.now();
    if (discosEnCache && (ahora - ultimaPeticion) < 30000) {
      mostrarVinilos(discosEnCache);
      return;
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando vinilos destacados...</p>';
    
    try {
      const artistasSeleccionados = [...artistasPopulares]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const query = artistasSeleccionados.join(' ');
      
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}&type=release&per_page=50`);
      
      if (response.status === 429) {
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Reintentando...</p>';
        mostrarNotificacionPorCodigo('FINETUNING_LIMITE');
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
          vinylGrid.innerHTML = '<p>🎧 Próximamente más vinilos. La página está en fase de finetuning.</p>';
          mostrarNotificacionPorCodigo('FINETUNING_CATALOGO');
          setTimeout(() => cargarVinilosAleatorios(), 3000);
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
        mostrarVinilos(discosFinal);
        
        if (discosFinal.length < 5) {
          mostrarNotificacionPorCodigo('FINETUNING_CATALOGO');
        }
      } else {
        if (discosEnCache) {
          mostrarVinilos(discosEnCache);
        } else {
          vinylGrid.innerHTML = '<p>⚠️ Esta página está en fase de ajuste. Vuelve pronto para más contenido.</p>';
          mostrarNotificacionPorCodigo('FINETUNING_VUELVE_PRONTO');
        }
      }
    } catch (error) {
      console.error(error);
      if (discosEnCache) {
        mostrarVinilos(discosEnCache);
      } else {
        vinylGrid.innerHTML = '<p>⚠️ VinylMarket está en fase de ajuste. Disculpa las molestias.</p>';
        mostrarNotificacionPorCodigo('FINETUNING_VUELVE_PRONTO');
      }
    }
  }

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  async function buscarVinilos(query) {
    if (!query.trim()) {
      mostrarNotificacionPorCodigo('BUSCAR_VACIO');
      return;
    }
    
    vinylGrid.innerHTML = '<p>🔄 Cargando...</p>';
    mostrarNotificacionPorCodigo('BUSCANDO');
    
    try {
      const response = await fetch(`${API_URL}/discos/buscar?q=${encodeURIComponent(query)}`);
      
      if (response.status === 429) {
        vinylGrid.innerHTML = '<p>⏳ Demasiadas peticiones. Espera unos segundos...</p>';
        mostrarNotificacionPorCodigo('FINETUNING_LIMITE');
        setTimeout(() => buscarVinilos(query), 3000);
        return;
      }
      
      if (response.ok) {
        const discos = await response.json();
        if (discos.length === 0) {
          vinylGrid.innerHTML = '<p>🎧 No se encontraron vinilos para tu búsqueda.</p>';
          mostrarNotificacionPorCodigo('FINETUNING_SIN_RESULTADOS');
        } else {
          mostrarNotificacionPorCodigo('RESULTADOS_ENCONTRADOS', discos.length);
          mostrarVinilos(discos);
        }
      } else {
        vinylGrid.innerHTML = '<p>❌ Error al buscar. La página está en fase de desarrollo.</p>';
        mostrarNotificacionPorCodigo('BUSQUEDA_FALLIDA');
      }
    } catch(e) {
      console.error(e);
      vinylGrid.innerHTML = '<p>❌ Error de conexión. La página está en fase de desarrollo.</p>';
      mostrarNotificacionPorCodigo('ERROR_CONEXION_BUSCAR');
    }
  }
  
  if (searchBtn) {
    searchBtn.onclick = () => buscarVinilos(searchInput.value);
  }
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') buscarVinilos(searchInput.value);
    });
  }

  const buscarQuery = getParameterByName('buscar');
  if (buscarQuery) {
    setTimeout(() => {
      if (searchInput) {
        searchInput.value = decodeURIComponent(buscarQuery);
        buscarVinilos(decodeURIComponent(buscarQuery));
      }
    }, 500);
  }

  const toggleGeneros = document.getElementById('toggleGeneros');
  const generosList = document.getElementById('generosList');
  const generosIcon = document.getElementById('generosIcon');
  
  if (toggleGeneros && generosList) {
    toggleGeneros.addEventListener('click', function() {
      generosList.classList.toggle('collapsed');
      if (generosList.classList.contains('collapsed')) {
        if (generosIcon) generosIcon.innerHTML = '▶';
      } else {
        if (generosIcon) generosIcon.innerHTML = '▼';
      }
    });
  }

  cargarVinilosAleatorios();
  cargarDestacados();
  inicializarBotonesSidebar();
}