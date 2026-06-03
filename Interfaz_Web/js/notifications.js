// ============================================
// 🔔 NOTIFICACIONES PERSONALIZADAS (POPUPS)
// ============================================
// Tipos: success (verde), error (rojo), info (marrón)
// Todos los mensajes están centralizados aquí
// ============================================

// Almacenar mensajes ya mostrados en esta sesión
let mensajesMostrados = new Set();

// Diccionario de mensajes por código
const MENSAJES = {
  // ========== ÉXITOS ==========
  REGISTRO_EXITOSO: { texto: '✅ Registro exitoso. Redirigiendo al inicio de sesión...', tipo: 'success' },
  LOGIN_EXITOSO: { texto: '✅ ¡Bienvenido! Redirigiendo al dashboard...', tipo: 'success' },
  CERRAR_SESION: { texto: '👋 Sesión cerrada correctamente', tipo: 'success' },
  TIPO_USUARIO_CAMBIADO: { texto: '✅ Tipo de usuario actualizado correctamente', tipo: 'success' },
  DATOS_GUARDADOS: { texto: '✅ Datos guardados correctamente', tipo: 'success' },
  VINILO_IMPORTADO: { texto: '✅ Disco importado a tu colección', tipo: 'success' },
  VINILO_ANADIDO: { texto: '✅ Vinilo añadido a tu colección', tipo: 'success' },
  VINILO_ACTUALIZADO: { texto: '✅ Vinilo actualizado correctamente', tipo: 'success' },
  VINILO_ELIMINADO: { texto: '✅ Vinilo eliminado de tu colección', tipo: 'success' },
  RECUPERACION_ENVIADA: { texto: '📧 Si el email existe, recibirás un código de recuperación.', tipo: 'success' },
  
  // ========== ERRORES DE VALIDACIÓN ==========
  EMAIL_INVALIDO: { texto: '❌ Por favor, introduce un correo electrónico válido', tipo: 'error' },
  NOMBRE_OBLIGATORIO: { texto: '❌ El nombre es obligatorio', tipo: 'error' },
  USUARIO_OBLIGATORIO: { texto: '❌ El nombre de usuario es obligatorio', tipo: 'error' },
  PASSWORD_CORTA: { texto: '❌ La contraseña debe tener al menos 10 caracteres', tipo: 'error' },
  PASSWORD_OBLIGATORIA: { texto: '❌ La contraseña es obligatoria', tipo: 'error' },
  BUSCAR_VACIO: { texto: '⚠️ Escribe un artista o título para buscar', tipo: 'info' },
  TITULO_ARTISTA_OBLIGATORIOS: { texto: '❌ El título y el artista son obligatorios', tipo: 'error' },
  
  // ========== ERRORES DEL SERVIDOR ==========
  REGISTRO_FALLIDO: { texto: '❌ Error en el registro. Intenta con otro email o usuario.', tipo: 'error' },
  LOGIN_FALLIDO: { texto: '❌ Email o contraseña incorrectos. Verifica tus datos.', tipo: 'error' },
  IMPORTAR_FALLIDO: { texto: '❌ Error al importar el disco a tu colección', tipo: 'error' },
  VINILO_ANADIR_FALLIDO: { texto: '❌ Error al añadir el vinilo a tu colección', tipo: 'error' },
  VINILO_ACTUALIZAR_FALLIDO: { texto: '❌ Error al actualizar el vinilo', tipo: 'error' },
  VINILO_ELIMINAR_FALLIDO: { texto: '❌ Error al eliminar el vinilo', tipo: 'error' },
  COLECCION_CARGAR_FALLIDO: { texto: '❌ Error al cargar tu colección', tipo: 'error' },
  BUSQUEDA_FALLIDA: { texto: '❌ Error al realizar la búsqueda', tipo: 'error' },
  GENERO_BUSQUEDA_FALLIDA: { texto: '❌ Error al buscar por género', tipo: 'error' },
  
  // ========== ERRORES DE CONEXIÓN ==========
  ERROR_CONEXION: { texto: '❌ Error de conexión. No se pudo conectar al servidor.', tipo: 'error' },
  ERROR_CONEXION_IMPORTAR: { texto: '❌ Error de conexión al importar', tipo: 'error' },
  ERROR_CONEXION_BUSCAR: { texto: '❌ Error de conexión al buscar', tipo: 'error' },
  ERROR_CONEXION_GENERO: { texto: '❌ Error de conexión al buscar por género', tipo: 'error' },
  ERROR_CONEXION_DESTACADOS: { texto: '❌ Error de conexión al cargar destacados', tipo: 'error' },
  ERROR_CONEXION_COLECCION: { texto: '❌ Error de conexión al cargar tu colección', tipo: 'error' },
  
  // ========== MENSAJES INFORMATIVOS ==========
  FINETUNING_BIENVENIDA: { texto: '🎧 VinylMarket está en fase de finetuning. ¡Gracias por tu paciencia!', tipo: 'info', unico: true },
  FINETUNING_LIMITE: { texto: '⏳ La página está en fase de ajuste (finetuning). Reintentando...', tipo: 'info', unico: true },
  FINETUNING_SIN_RESULTADOS: { texto: '🔍 No se encontraron resultados. La página está en fase de mejora.', tipo: 'info', unico: true },
  FINETUNING_CATALOGO: { texto: '🎧 Estamos ampliando nuestro catálogo. ¡Pronto más vinilos!', tipo: 'info', unico: true },
  FINETUNING_GENERO_VACIO: { texto: '🎸 No encontramos discos de este género aún. VinylMarket está en fase de crecimiento.', tipo: 'info', unico: true },
  FINETUNING_POCOS_RESULTADOS: { texto: '🎧 Estamos en fase de finetuning. Pronto más variedad.', tipo: 'info', unico: true },
  FINETUNING_ERROR_SERVIDOR: { texto: '⚠️ VinylMarket está en fase de finetuning. Estamos mejorando nuestro catálogo.', tipo: 'info', unico: true },
  FINETUNING_FUNCION: { texto: '⚠️ Esta función está en fase de ajuste. Disculpa las molestias.', tipo: 'info', unico: true },
  FINETUNING_VUELVE_PRONTO: { texto: '⚠️ VinylMarket está en finetuning. ¡Vuelve pronto!', tipo: 'info', unico: true },
  
  // ========== BÚSQUEDA ==========
  BUSCANDO: { texto: '🔄 Buscando...', tipo: 'info' },
  BUSCANDO_GENERO: (genero) => ({ texto: `🔍 Buscando discos de ${genero}...`, tipo: 'info' }),
  RESULTADOS_ENCONTRADOS: (cantidad) => ({ texto: `✅ Encontrados ${cantidad} resultados`, tipo: 'success' }),
  DISCOS_ENCONTRADOS_GENERO: (cantidad, genero) => ({ texto: `✅ Encontrados ${cantidad} discos de ${genero}`, tipo: 'success' }),
  PROCESANDO_REGISTRO: { texto: '🔄 Procesando registro...', tipo: 'info' },
  INICIANDO_SESION: { texto: '🔄 Iniciando sesión...', tipo: 'info' },
  CARGANDO_COLECCION: { texto: '🔄 Cargando tu colección...', tipo: 'info' },
  ANADIENDO_VINILO: { texto: '🔄 Añadiendo vinilo a tu colección...', tipo: 'info' },
  ACTUALIZANDO_VINILO: { texto: '🔄 Actualizando vinilo...', tipo: 'info' },
  ELIMINANDO_VINILO: { texto: '🔄 Eliminando vinilo...', tipo: 'info' },
  
  // ========== SESIÓN ==========
  SESION_EXPIRADA: { texto: '⚠️ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', tipo: 'info' },
  
  // ========== PRÓXIMAMENTE ==========
  PROXIMAMENTE_SOLICITADOS: { texto: '🎧 Próximamente: Los vinilos más solicitados por la comunidad', tipo: 'info' },
  PROXIMAMENTE_OFERTAS: { texto: '💸 Próximamente: Las mejores ofertas y descuentos', tipo: 'info' },
  PROXIMAMENTE_TOP_VENTAS: { texto: '📈 Próximamente: Los vinilos más vendidos del mes', tipo: 'info' },
  PROXIMAMENTE_PUBLICAR: { texto: '➕ Próximamente: Publica tus propios vinilos a la venta', tipo: 'info' },
  PUBLICAR_SOLO_VENDEDOR: { texto: '🔒 Debes ser vendedor para publicar vinilos. Cambia tu tipo de usuario en el perfil.', tipo: 'error' },
};

// Función principal de notificaciones
function mostrarNotificacion(mensaje, tipo = 'info', unico = true) {
  console.log(`[NOTIFICACIÓN] ${tipo}: ${mensaje}`);
  
  if (unico && mensajesMostrados.has(mensaje)) {
    console.log(`[NOTIFICACIÓN] Mensaje ya mostrado, ignorando: ${mensaje}`);
    return;
  }
  
  if (unico) {
    mensajesMostrados.add(mensaje);
  }
  
  const notificacionesExistentes = document.querySelectorAll('.toast-notification');
  notificacionesExistentes.forEach(notif => {
    if (notif.parentNode) notif.parentNode.removeChild(notif);
  });
  
  const toast = document.createElement('div');
  toast.className = `toast-notification ${tipo}`;
  toast.innerText = mensaje;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 500);
  }, 3000);
}

// Función para mostrar notificaciones por código (recomendada)
function mostrarNotificacionPorCodigo(codigo, parametro = null) {
  let mensajeConfig = MENSAJES[codigo];
  
  if (!mensajeConfig) {
    console.error(`Código de notificación no encontrado: ${codigo}`);
    mostrarNotificacion(`⚠️ Error desconocido: ${codigo}`, 'error');
    return;
  }
  
  let texto = mensajeConfig.texto;
  const tipo = mensajeConfig.tipo;
  const unico = mensajeConfig.unico || false;
  
  if (typeof texto === 'function') {
    texto = texto(parametro);
  }
  
  mostrarNotificacion(texto, tipo, unico);
}

// Función para limpiar el historial de mensajes
function limpiarHistorialNotificaciones() {
  mensajesMostrados.clear();
  console.log('[NOTIFICACIÓN] Historial de mensajes únicos limpiado');
}