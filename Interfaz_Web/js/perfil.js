// ============================================
// 👤 PERFIL / COLECCIÓN PERSONAL
// ============================================

if (window.location.pathname.includes('perfil.html')) {
  
  setTimeout(() => {
    mostrarNotificacionPorCodigo('FINETUNING_BIENVENIDA');
  }, 1500);
  
  const token = localStorage.getItem('token');
  
  function isTokenExpiradoLocal() {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  }
  
  if (!token || isTokenExpiradoLocal()) {
    localStorage.clear();
    mostrarNotificacionPorCodigo('SESION_EXPIRADA');
    setTimeout(() => { window.location.href = 'login.html'; }, 2000);
  }
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  const perfilInfo = document.getElementById('perfilInfo');
  if (perfilInfo && usuario) {
    const tipoTexto = usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    perfilInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p>
                            <p>📧 ${usuario.email}</p>
                            <p>🎭 ${tipoTexto}</p>`;
  }
  
  const sidebarProfileInfo = document.getElementById('sidebarProfileInfo');
  if (sidebarProfileInfo && usuario) {
    const tipoTexto = usuario.tipo === 'comprador' ? '🟡 Comprador' : usuario.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    sidebarProfileInfo.innerHTML = `<p><strong>${usuario.nombre || usuario.username}</strong></p>
                                    <p>📧 ${usuario.email}</p>
                                    <p>🎭 ${tipoTexto}</p>`;
  }
  
  const sidebarRight = document.getElementById('sidebarRight');
  const overlay = document.getElementById('sidebarOverlay');
  const openRight = document.getElementById('openSidebarRight');
  const closeRight = document.getElementById('closeSidebarRight');
  const body = document.body;
  
  function cerrarSidebar() {
    if (sidebarRight) sidebarRight.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    body.classList.remove('sidebar-right-open');
  }
  
  function abrirSidebar() {
    cerrarSidebar();
    if (sidebarRight) sidebarRight.classList.add('active');
    if (overlay) overlay.classList.add('active');
    body.classList.add('sidebar-right-open');
  }
  
  if (openRight) openRight.onclick = abrirSidebar;
  if (closeRight) closeRight.onclick = cerrarSidebar;
  if (overlay) overlay.onclick = cerrarSidebar;
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarSidebar(); });
  
  const userTypeSelect = document.getElementById('userTypeSelect');
  if (userTypeSelect) {
    userTypeSelect.value = usuario?.tipo || 'comprador';
    userTypeSelect.onchange = function(e) {
      const nuevoTipo = e.target.value;
      const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
      if (usuarioActual) {
        usuarioActual.tipo = nuevoTipo;
        localStorage.setItem('usuario', JSON.stringify(usuarioActual));
        mostrarNotificacionPorCodigo('TIPO_USUARIO_CAMBIADO');
        const tipoTexto = nuevoTipo === 'comprador' ? '🟡 Comprador' : nuevoTipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
        if (perfilInfo) perfilInfo.innerHTML = `<p><strong>${usuarioActual.nombre || usuarioActual.username}</strong></p><p>📧 ${usuarioActual.email}</p><p>🎭 ${tipoTexto}</p>`;
        if (sidebarProfileInfo) sidebarProfileInfo.innerHTML = `<p><strong>${usuarioActual.nombre || usuarioActual.username}</strong></p><p>📧 ${usuarioActual.email}</p><p>🎭 ${tipoTexto}</p>`;
      }
    };
  }
  
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
    mostrarNotificacionPorCodigo('DATOS_GUARDADOS');
  }
  
  const guardarDatosBtn = document.getElementById('guardarDatosAdicionales');
  if (guardarDatosBtn) guardarDatosBtn.onclick = guardarDatosAdicionales;
  
  function inicializarRatingStars() {
    const ratingStars = document.getElementById('ratingStarsNew');
    if (!ratingStars) return;
    
    const stars = ratingStars.querySelectorAll('span');
    let valorActual = 5;
    
    stars.forEach(star => {
      star.addEventListener('click', function() {
        valorActual = parseInt(this.dataset.valor);
        stars.forEach(s => s.classList.remove('active'));
        for (let i = 0; i < valorActual; i++) stars[i].classList.add('active');
        document.getElementById('calificacionNueva').value = valorActual;
      });
    });
    
    for (let i = 0; i < 5; i++) stars[i].classList.add('active');
  }
  inicializarRatingStars();
  
  async function agregarViniloManual() {
    const titulo = document.getElementById('nuevoTitulo')?.value.trim();
    const artista = document.getElementById('nuevoArtista')?.value.trim();
    const anio = parseInt(document.getElementById('nuevoAnio')?.value) || 0;
    const genero = document.getElementById('nuevoGenero')?.value.trim() || 'Sin género';
    const imagenUrl = document.getElementById('nuevaImagen')?.value.trim() || '';
    const estadoVinilo = document.getElementById('estadoVinilo')?.value || 'NUEVO';
    const calificacion = parseInt(document.getElementById('calificacionNueva')?.value) || 5;
    
    if (!titulo || !artista) {
      mostrarNotificacionPorCodigo('TITULO_ARTISTA_OBLIGATORIOS');
      return;
    }
    
    mostrarNotificacionPorCodigo('ANADIENDO_VINILO');
    
    const discoData = { titulo, artista, anio, genero, imagenUrl };
    
    try {
      const response = await fetch(`${API_URL}/discos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(discoData)
      });
      
      if (response.ok) {
        const discoGuardado = await response.json();
        const discoId = discoGuardado.id;
        const coleccionData = { discoId: discoId, estado: estadoVinilo, calificacion: calificacion };
        
        const coleccionResponse = await fetch(`${API_URL}/discos/${discoId}/agregar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(coleccionData)
        });
        
        if (coleccionResponse.ok) {
          mostrarNotificacionPorCodigo('VINILO_ANADIDO');
          ['nuevoTitulo', 'nuevoArtista', 'nuevoAnio', 'nuevoGenero', 'nuevaImagen'].forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
          });
          cargarColeccion();
          cerrarSidebar();
        } else {
          mostrarNotificacionPorCodigo('VINILO_ANADIR_FALLIDO');
        }
      } else {
        mostrarNotificacionPorCodigo('VINILO_ANADIR_FALLIDO');
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacionPorCodigo('ERROR_CONEXION');
    }
  }
  
  const agregarBtn = document.getElementById('btnAgregarVinilo');
  if (agregarBtn) agregarBtn.onclick = agregarViniloManual;
  
  function calcularEstadisticas(coleccion) {
    const total = coleccion.length;
    if (total === 0) return null;
    
    const generos = {};
    let sumaCalificaciones = 0;
    const decadas = {};
    
    coleccion.forEach(item => {
      const disco = item.disco;
      const genero = disco.genero || 'Sin género';
      generos[genero] = (generos[genero] || 0) + 1;
      sumaCalificaciones += (item.calificacion || 5);
      
      if (disco.anio && disco.anio > 0) {
        const decada = Math.floor(disco.anio / 10) * 10;
        decadas[decada] = (decadas[decada] || 0) + 1;
      }
    });
    
    let generoFavorito = '', maxGenero = 0;
    for (const [genero, count] of Object.entries(generos)) {
      if (count > maxGenero) {
        maxGenero = count;
        generoFavorito = genero;
      }
    }
    
    let decadaFavorita = '', maxDecada = 0;
    for (const [decada, count] of Object.entries(decadas)) {
      if (count > maxDecada) {
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
  
  function mostrarEstadisticas(coleccion) {
    const statsContainer = document.getElementById('estadisticasColeccion');
    if (!statsContainer) return;
    
    const stats = calcularEstadisticas(coleccion);
    
    if (!stats) {
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
  
  const toggleEstadisticas = document.getElementById('toggleEstadisticas');
  const estadisticasContenido = document.getElementById('estadisticasContenido');
  const estadisticasIcon = document.getElementById('estadisticasIcon');
  
  if (toggleEstadisticas && estadisticasContenido) {
    toggleEstadisticas.addEventListener('click', function() {
      estadisticasContenido.classList.toggle('collapsed');
      if (estadisticasContenido.classList.contains('collapsed')) {
        if (estadisticasIcon) estadisticasIcon.innerHTML = '▶';
      } else {
        if (estadisticasIcon) estadisticasIcon.innerHTML = '▼';
      }
    });
  }
  
  let viniloEditando = null;
  
  function crearModal() {
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
    starsEdit.forEach(star => {
      star.addEventListener('click', function() {
        const valor = parseInt(this.dataset.valor);
        starsEdit.forEach(s => s.classList.remove('active'));
        for (let i = 0; i < valor; i++) starsEdit[i].classList.add('active');
        let input = document.getElementById('editCalificacion');
        if (!input) {
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
  
  function abrirModalEditar(item) {
    crearModal();
    viniloEditando = item;
    const modal = document.getElementById('modalEditar');
    document.getElementById('editEstado').value = item.estado || 'NUEVO';
    
    const calificacion = item.calificacion || 5;
    const starsEdit = document.querySelectorAll('#ratingStarsEdit span');
    starsEdit.forEach(s => s.classList.remove('active'));
    for (let i = 0; i < calificacion; i++) starsEdit[i].classList.add('active');
    
    let input = document.getElementById('editCalificacion');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.id = 'editCalificacion';
      modal.querySelector('.modal-content').appendChild(input);
    }
    input.value = calificacion;
    modal.classList.add('active');
  }
  
  async function guardarEdicionVinilo() {
    if (!viniloEditando) return;
    
    const nuevoEstado = document.getElementById('editEstado').value;
    const nuevaCalificacion = parseInt(document.getElementById('editCalificacion')?.value || 5);
    
    mostrarNotificacionPorCodigo('ACTUALIZANDO_VINILO');
    
    try {
      const response = await fetch(`${API_URL}/coleccion/${viniloEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado, calificacion: nuevaCalificacion })
      });
      
      if (response.ok) {
        mostrarNotificacionPorCodigo('VINILO_ACTUALIZADO');
        document.getElementById('modalEditar').classList.remove('active');
        cargarColeccion();
        viniloEditando = null;
      } else {
        mostrarNotificacionPorCodigo('VINILO_ACTUALIZAR_FALLIDO');
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacionPorCodigo('ERROR_CONEXION');
    }
  }
  
  async function eliminarVinilo(coleccionId, titulo) {
    if (confirm(`¿Seguro que quieres eliminar "${titulo}" de tu colección?`)) {
      mostrarNotificacionPorCodigo('ELIMINANDO_VINILO');
      try {
        const response = await fetch(`${API_URL}/coleccion/${coleccionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          mostrarNotificacionPorCodigo('VINILO_ELIMINADO');
          cargarColeccion();
        } else {
          mostrarNotificacionPorCodigo('VINILO_ELIMINAR_FALLIDO');
        }
      } catch (error) {
        console.error(error);
        mostrarNotificacionPorCodigo('ERROR_CONEXION');
      }
    }
  }
  
  async function cargarColeccion() {
    const miColeccion = document.getElementById('miColeccion');
    if (!miColeccion) return;
    
    miColeccion.innerHTML = '<p style="text-align: center;">🔄 Cargando tu colección...</p>';
    mostrarNotificacionPorCodigo('CARGANDO_COLECCION');
    
    try {
      const response = await fetch(`${API_URL}/discos/mi-coleccion`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const coleccion = await response.json();
        mostrarEstadisticas(coleccion);
        
        if (coleccion.length === 0) {
          miColeccion.innerHTML = `<div class="coleccion-vacio">
                                    🎧 Aún no tienes nada en tu colección
                                    <br><br>
                                    <button class="btn" onclick="document.getElementById('openSidebarRight').click()" 
                                            style="width: auto; display: inline-block; padding: 8px 20px;">
                                      ➕ Añadir mi primer vinilo
                                    </button>
                                  </div>`;
        } else {
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
          
          document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', () => {
              abrirModalEditar({
                id: btn.dataset.id,
                estado: btn.dataset.estado,
                calificacion: parseInt(btn.dataset.calificacion)
              });
            });
          });
          
          document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', () => {
              eliminarVinilo(btn.dataset.id, btn.dataset.titulo);
            });
          });
        }
      } else if (response.status === 401) {
        mostrarNotificacionPorCodigo('SESION_EXPIRADA');
        localStorage.clear();
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
      } else {
        miColeccion.innerHTML = '<p style="text-align: center;">❌ Error al cargar tu colección</p>';
        mostrarNotificacionPorCodigo('COLECCION_CARGAR_FALLIDO');
      }
    } catch (error) {
      console.error('Error:', error);
      miColeccion.innerHTML = '<p style="text-align: center;">❌ Error de conexión</p>';
      mostrarNotificacionPorCodigo('ERROR_CONEXION_COLECCION');
    }
  }
  
  cargarDatosAdicionales();
  cargarColeccion();
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      mostrarNotificacionPorCodigo('CERRAR_SESION');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    };
  }
}