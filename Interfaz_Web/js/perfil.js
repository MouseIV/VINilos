// ============================================
// 👤 PERFIL / COLECCIÓN PERSONAL
// ============================================

if (window.location.pathname.includes('perfil.html')) {
  
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const userId = usuario?.id;
  
  // ========== MOSTRAR INFORMACIÓN BÁSICA DEL PERFIL ==========
  const perfilInfo = document.getElementById('perfilInfo');
  const sidebarProfileInfo = document.getElementById('sidebarProfileInfo');
  
  function actualizarInfoPerfil(usuarioData) {
    const tipoTexto = usuarioData.tipo === 'comprador' ? '🟡 Comprador' : usuarioData.tipo === 'vendedor' ? '🔵 Vendedor' : '🟢 Comprador y Vendedor';
    const nombreCompleto = usuarioData.apellido ? `${usuarioData.nombre} ${usuarioData.apellido}` : usuarioData.nombre;
    
    let telefonoCompleto = 'No especificado';
    if (usuarioData.prefijo && usuarioData.telefono) {
      telefonoCompleto = `${usuarioData.prefijo} ${usuarioData.telefono}`;
    } else if (usuarioData.telefono) {
      telefonoCompleto = usuarioData.telefono;
    }
    
    const perfilHtml = `
      <p><strong>👤 Nombre:</strong> ${nombreCompleto || usuarioData.username}</p>
      <p><strong>📧 Email:</strong> ${usuarioData.email}</p>
      <p><strong>📍 Ciudad:</strong> ${usuarioData.ciudad || 'No especificada'}</p>
      <p><strong>📞 Teléfono:</strong> ${telefonoCompleto}</p>
      <p><strong>🎭 Tipo:</strong> ${tipoTexto}</p>
      <p><strong>🎯 Coleccionista:</strong> ${usuarioData.tipoColeccionista || 'Principiante'}</p>
    `;
    
    if (perfilInfo) perfilInfo.innerHTML = perfilHtml;
    if (sidebarProfileInfo) sidebarProfileInfo.innerHTML = perfilHtml;
  }
  
  if (usuario) {
    actualizarInfoPerfil(usuario);
  }
  
  // ========== FUNCIÓN PARA CARGAR DATOS COMPLETOS DEL USUARIO ==========
  async function cargarDatosCompletosUsuario() {
    if (!token || !userId) {
      console.error('No hay token o userId');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const datosUsuario = await response.json();
        console.log('Datos del usuario cargados:', datosUsuario);
        
        let prefijo = datosUsuario.prefijo || '+34';
        let telefono = datosUsuario.telefono || '';
        
        if (prefijo && prefijo.length > 3) prefijo = prefijo.substring(0, 3);
        if (telefono) telefono = telefono.replace(/\D/g, '').substring(0, 9);
        
        const usuarioActualizado = { ...usuario, ...datosUsuario, prefijo, telefono };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        
        actualizarInfoPerfil(usuarioActualizado);
        
        const apellidoInput = document.getElementById('apellido');
        const ciudadInput = document.getElementById('ciudad');
        const prefijoInput = document.getElementById('prefijo');
        const telefonoInput = document.getElementById('telefono');
        const direccionInput = document.getElementById('direccion');
        const cpInput = document.getElementById('codigoPostal');
        const tipoSelect = document.getElementById('tipoColeccionista');
        
        if (apellidoInput) apellidoInput.value = datosUsuario.apellido || '';
        if (ciudadInput) ciudadInput.value = datosUsuario.ciudad || '';
        if (prefijoInput) prefijoInput.value = prefijo;
        if (telefonoInput) telefonoInput.value = telefono;
        if (direccionInput) direccionInput.value = datosUsuario.direccion || '';
        if (cpInput) cpInput.value = datosUsuario.codigoPostal || '';
        if (tipoSelect) tipoSelect.value = datosUsuario.tipoColeccionista || 'principiante';
        
        localStorage.setItem('user_apellido', datosUsuario.apellido || '');
        localStorage.setItem('user_ciudad', datosUsuario.ciudad || '');
        localStorage.setItem('user_prefijo', prefijo);
        localStorage.setItem('user_telefono', telefono);
        localStorage.setItem('user_direccion', datosUsuario.direccion || '');
        localStorage.setItem('user_codigoPostal', datosUsuario.codigoPostal || '');
        localStorage.setItem('user_tipo_coleccionista', datosUsuario.tipoColeccionista || 'principiante');
        
        return datosUsuario;
      } else if (response.status === 404) {
        console.log('Usuario no encontrado en backend, usando datos locales');
        cargarDatosDesdeLocalStorage();
      } else {
        console.error('Error al cargar usuario:', response.status);
        cargarDatosDesdeLocalStorage();
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      cargarDatosDesdeLocalStorage();
    }
  }
  
  function cargarDatosDesdeLocalStorage() {
    let prefijo = localStorage.getItem('user_prefijo') || '+34';
    let telefono = localStorage.getItem('user_telefono') || '';
    
    if (prefijo && prefijo.length > 3) prefijo = prefijo.substring(0, 3);
    if (telefono) telefono = telefono.replace(/\D/g, '').substring(0, 9);
    
    const apellidoInput = document.getElementById('apellido');
    const ciudadInput = document.getElementById('ciudad');
    const prefijoInput = document.getElementById('prefijo');
    const telefonoInput = document.getElementById('telefono');
    const direccionInput = document.getElementById('direccion');
    const cpInput = document.getElementById('codigoPostal');
    const tipoSelect = document.getElementById('tipoColeccionista');
    
    if (apellidoInput) apellidoInput.value = localStorage.getItem('user_apellido') || '';
    if (ciudadInput) ciudadInput.value = localStorage.getItem('user_ciudad') || '';
    if (prefijoInput) prefijoInput.value = prefijo;
    if (telefonoInput) telefonoInput.value = telefono;
    if (direccionInput) direccionInput.value = localStorage.getItem('user_direccion') || '';
    if (cpInput) {
      let cp = localStorage.getItem('user_codigoPostal') || '';
      cp = cp.replace(/\D/g, '').substring(0, 5);
      cpInput.value = cp;
    }
    if (tipoSelect) tipoSelect.value = localStorage.getItem('user_tipo_coleccionista') || 'principiante';
  }
  
  // ========== GUARDAR DATOS DEL CLIENTE ==========
  async function guardarDatosCliente() {
    let prefijo = document.getElementById('prefijo')?.value || '+34';
    if (prefijo && prefijo.length > 3) {
      mostrarNotificacion('❌ El prefijo debe tener máximo 3 caracteres (ej: +34)', 'error');
      return;
    }
    
    let telefono = document.getElementById('telefono')?.value || '';
    telefono = telefono.replace(/\D/g, '');
    if (telefono && telefono.length !== 9) {
      mostrarNotificacion('❌ El número de teléfono debe tener exactamente 9 dígitos (ej: 123456789)', 'error');
      return;
    }
    
    let codigoPostal = document.getElementById('codigoPostal')?.value || '';
    codigoPostal = codigoPostal.replace(/\D/g, '');
    if (codigoPostal && codigoPostal.length !== 5) {
      mostrarNotificacion('❌ El código postal debe tener exactamente 5 dígitos (ej: 12345)', 'error');
      return;
    }
    
    const datosCliente = {
      apellido: document.getElementById('apellido')?.value || '',
      ciudad: document.getElementById('ciudad')?.value || '',
      prefijo: prefijo,
      telefono: telefono,
      direccion: document.getElementById('direccion')?.value || '',
      codigoPostal: codigoPostal,
      tipoColeccionista: document.getElementById('tipoColeccionista')?.value || 'principiante'
    };
    
    console.log('Guardando datos:', datosCliente);
    
    try {
      const response = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosCliente)
      });
      
      if (response.ok) {
        const usuarioActualizado = await response.json();
        
        const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || '{}');
        usuarioStorage.apellido = datosCliente.apellido;
        usuarioStorage.ciudad = datosCliente.ciudad;
        usuarioStorage.prefijo = datosCliente.prefijo;
        usuarioStorage.telefono = datosCliente.telefono;
        usuarioStorage.direccion = datosCliente.direccion;
        usuarioStorage.codigoPostal = datosCliente.codigoPostal;
        usuarioStorage.tipoColeccionista = datosCliente.tipoColeccionista;
        localStorage.setItem('usuario', JSON.stringify(usuarioStorage));
        
        localStorage.setItem('user_apellido', datosCliente.apellido);
        localStorage.setItem('user_ciudad', datosCliente.ciudad);
        localStorage.setItem('user_prefijo', datosCliente.prefijo);
        localStorage.setItem('user_telefono', datosCliente.telefono);
        localStorage.setItem('user_direccion', datosCliente.direccion);
        localStorage.setItem('user_codigoPostal', datosCliente.codigoPostal);
        localStorage.setItem('user_tipo_coleccionista', datosCliente.tipoColeccionista);
        
        actualizarInfoPerfil(usuarioStorage);
        
        mostrarNotificacion('✅ Datos guardados correctamente', 'success');
      } else {
        const error = await response.text();
        console.error('Error del servidor:', error);
        mostrarNotificacion('❌ Error al guardar los datos', 'error');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      mostrarNotificacion('❌ Error de conexión al guardar', 'error');
    }
  }
  
  // ========== SIDEBAR DERECHO ==========
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
  if (userTypeSelect && usuario) {
    userTypeSelect.value = usuario.tipo || 'comprador';
    userTypeSelect.onchange = async function(e) {
      const nuevoTipo = e.target.value;
      try {
        const response = await fetch(`${API_URL}/usuarios/${userId}/tipo`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ tipo: nuevoTipo })
        });
        
        if (response.ok) {
          const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
          usuarioActual.tipo = nuevoTipo;
          localStorage.setItem('usuario', JSON.stringify(usuarioActual));
          mostrarNotificacion(`✅ Tipo de usuario cambiado a: ${nuevoTipo === 'comprador' ? 'Comprador' : nuevoTipo === 'vendedor' ? 'Vendedor' : 'Comprador y Vendedor'}`, 'success');
          actualizarInfoPerfil(usuarioActual);
        } else {
          mostrarNotificacion('❌ Error al actualizar el tipo de usuario', 'error');
        }
      } catch (error) {
        console.error(error);
        mostrarNotificacion('❌ Error de conexión', 'error');
      }
    };
  }
  
  // ========== VALORACIÓN CON ESTRELLAS ==========
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
        const calificacionInput = document.getElementById('calificacionNueva');
        if (calificacionInput) calificacionInput.value = valorActual;
      });
    });
    
    for (let i = 0; i < 5; i++) stars[i].classList.add('active');
  }
  inicializarRatingStars();
  
  // ========== AGREGAR VINILO MANUALMENTE ==========
  async function agregarViniloManual() {
    const titulo = document.getElementById('nuevoTitulo')?.value.trim();
    const artista = document.getElementById('nuevoArtista')?.value.trim();
    const anio = parseInt(document.getElementById('nuevoAnio')?.value) || 0;
    const genero = document.getElementById('nuevoGenero')?.value.trim() || 'Sin género';
    const imagenUrl = document.getElementById('nuevaImagen')?.value.trim() || '';
    const estadoVinilo = document.getElementById('estadoVinilo')?.value || 'NUEVO';
    const calificacion = parseInt(document.getElementById('calificacionNueva')?.value) || 5;
    
    if (!titulo || !artista) {
      mostrarNotificacion('❌ El título y el artista son obligatorios', 'error');
      return;
    }
    
    mostrarNotificacion('🔄 Añadiendo vinilo a tu colección...', 'info');
    
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
          mostrarNotificacion('✅ Vinilo añadido a tu colección', 'success');
          const inputs = ['nuevoTitulo', 'nuevoArtista', 'nuevoAnio', 'nuevoGenero', 'nuevaImagen'];
          inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
          });
          cargarColeccion();
          cerrarSidebar();
        } else {
          const error = await coleccionResponse.text();
          mostrarNotificacion('❌ Error al añadir a colección: ' + error, 'error');
        }
      } else {
        const error = await response.text();
        mostrarNotificacion('❌ Error al guardar el disco: ' + error, 'error');
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('❌ Error de conexión: ' + error.message, 'error');
    }
  }
  
  const agregarBtn = document.getElementById('btnAgregarVinilo');
  if (agregarBtn) agregarBtn.onclick = agregarViniloManual;
  
  // ========== ESTADÍSTICAS ==========
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
  
  // ========== DESPLEGABLE DE ESTADÍSTICAS (RECOGIDO POR DEFECTO) ==========
  const toggleEstadisticas = document.getElementById('toggleEstadisticas');
  const estadisticasContenido = document.getElementById('estadisticasContenido');
  const estadisticasIcon = document.getElementById('estadisticasIcon');
  
  if (toggleEstadisticas && estadisticasContenido) {
    estadisticasContenido.classList.add('collapsed');
    if (estadisticasIcon) estadisticasIcon.innerHTML = '▶';
    
    toggleEstadisticas.addEventListener('click', function() {
      estadisticasContenido.classList.toggle('collapsed');
      if (estadisticasContenido.classList.contains('collapsed')) {
        if (estadisticasIcon) estadisticasIcon.innerHTML = '▶';
      } else {
        if (estadisticasIcon) estadisticasIcon.innerHTML = '▼';
      }
    });
  }
  
  // ========== DESPLEGABLE DE INFORMACIÓN ADICIONAL (RECOGIDO POR DEFECTO) ==========
  const toggleDatosCliente = document.getElementById('toggleDatosCliente');
  const datosClienteContenido = document.getElementById('datosClienteContenido');
  const datosClienteIcon = document.getElementById('datosClienteIcon');
  
  if (toggleDatosCliente && datosClienteContenido) {
    datosClienteContenido.classList.add('collapsed');
    if (datosClienteIcon) datosClienteIcon.innerHTML = '▶';
    
    toggleDatosCliente.addEventListener('click', function() {
      datosClienteContenido.classList.toggle('collapsed');
      if (datosClienteContenido.classList.contains('collapsed')) {
        if (datosClienteIcon) datosClienteIcon.innerHTML = '▶';
      } else {
        if (datosClienteIcon) datosClienteIcon.innerHTML = '▼';
      }
    });
  }
  
  // ========== BOTONES DE DATOS ADICIONALES ==========
  const guardarDatosBtn = document.getElementById('guardarDatosClienteBtn');
  const cargarDatosBtn = document.getElementById('cargarDatosClienteBtn');
  
  if (guardarDatosBtn) guardarDatosBtn.onclick = guardarDatosCliente;
  if (cargarDatosBtn) cargarDatosBtn.onclick = cargarDatosCompletosUsuario;
  
  // ========== MODAL PARA EDITAR ==========
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
    document.getElementById('cancelarEdicionBtn').onclick = () => { 
      modal.classList.remove('active'); 
      viniloEditando = null; 
    };
  }
  
  function abrirModalEditar(item) {
    crearModal();
    viniloEditando = item;
    const modal = document.getElementById('modalEditar');
    const editEstado = document.getElementById('editEstado');
    if (editEstado) editEstado.value = item.estado || 'NUEVO';
    
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
    
    const nuevoEstado = document.getElementById('editEstado')?.value || 'NUEVO';
    const nuevaCalificacion = parseInt(document.getElementById('editCalificacion')?.value || 5);
    
    mostrarNotificacion('🔄 Actualizando vinilo...', 'info');
    
    try {
      const response = await fetch(`${API_URL}/coleccion/${viniloEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado, calificacion: nuevaCalificacion })
      });
      
      if (response.ok) {
        mostrarNotificacion('✅ Vinilo actualizado correctamente', 'success');
        const modal = document.getElementById('modalEditar');
        if (modal) modal.classList.remove('active');
        cargarColeccion();
        viniloEditando = null;
      } else {
        const error = await response.text();
        mostrarNotificacion('❌ Error al actualizar: ' + error, 'error');
      }
    } catch (error) {
      console.error(error);
      mostrarNotificacion('❌ Error de conexión', 'error');
    }
  }
  
  // ========== ELIMINAR VINILO ==========
  async function eliminarVinilo(coleccionId, titulo) {
    if (confirm(`¿Seguro que quieres eliminar "${titulo}" de tu colección?`)) {
      mostrarNotificacion('🔄 Eliminando vinilo...', 'info');
      try {
        const response = await fetch(`${API_URL}/coleccion/${coleccionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          mostrarNotificacion('✅ Vinilo eliminado de tu colección', 'success');
          cargarColeccion();
        } else {
          const error = await response.text();
          mostrarNotificacion('❌ Error al eliminar: ' + error, 'error');
        }
      } catch (error) {
        console.error(error);
        mostrarNotificacion('❌ Error de conexión', 'error');
      }
    }
  }
  
  // ========== CARGAR COLECCIÓN ==========
  async function cargarColeccion() {
    const miColeccion = document.getElementById('miColeccion');
    if (!miColeccion) return;
    
    miColeccion.innerHTML = '<p style="text-align: center;">🔄 Cargando tu colección...</p>';
    
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
            const estadoTexto = { 
              'NUEVO': '🟢 Nuevo', 
              'MUY_BUENO': '🟡 Muy bueno', 
              'BUENO': '🟠 Bueno', 
              'REGULAR': '🔴 Regular' 
            }[item.estado] || item.estado;
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
        mostrarNotificacion('⚠️ Tu sesión ha expirado. Redirigiendo al login...', 'info');
        localStorage.clear();
        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
      } else {
        miColeccion.innerHTML = '<p style="text-align: center;">❌ Error al cargar tu colección</p>';
        mostrarNotificacion('❌ Error al cargar tu colección', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      miColeccion.innerHTML = '<p style="text-align: center;">❌ Error de conexión</p>';
      mostrarNotificacion('❌ Error de conexión al cargar tu colección', 'error');
    }
  }
  
  // ========== CERRAR SESIÓN ==========
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = function(e) {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      mostrarNotificacion('👋 Sesión cerrada correctamente', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    };
  }
  
  // ========== INICIALIZAR TODO ==========
  cargarDatosCompletosUsuario();
  cargarColeccion();
}