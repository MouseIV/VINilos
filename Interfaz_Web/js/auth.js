// ============================================
// 🔐 AUTENTICACIÓN (REGISTRO, LOGIN, RECUPERACIÓN)
// ============================================

// ========== FUNCIÓN PARA VALIDAR EMAIL ==========
function validarFormatoEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ========== REGISTRO ==========
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nombre = document.getElementById('nombre').value;
    const username = document.getElementById('username').value;
    
    if (!validarFormatoEmail(email)) {
      mostrarNotificacionPorCodigo('EMAIL_INVALIDO');
      return;
    }
    
    if (nombre.trim() === '') {
      mostrarNotificacionPorCodigo('NOMBRE_OBLIGATORIO');
      return;
    }
    
    if (username.trim() === '') {
      mostrarNotificacionPorCodigo('USUARIO_OBLIGATORIO');
      return;
    }
    
    if (password.length < 10) {
      mostrarNotificacionPorCodigo('PASSWORD_CORTA');
      return;
    }
    
    const userData = {
      nombre: nombre,
      username: username,
      email: email,
      password: password
    };
    
    mostrarNotificacionPorCodigo('PROCESANDO_REGISTRO');
    
    try {
      const response = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        mostrarNotificacionPorCodigo('REGISTRO_EXITOSO');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } else {
        mostrarNotificacionPorCodigo('REGISTRO_FALLIDO');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      mostrarNotificacionPorCodigo('ERROR_CONEXION');
    }
  });
}

// ========== LOGIN ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validarFormatoEmail(email)) {
      mostrarNotificacionPorCodigo('EMAIL_INVALIDO');
      return;
    }
    
    if (password.trim() === '') {
      mostrarNotificacionPorCodigo('PASSWORD_OBLIGATORIA');
      return;
    }
    
    mostrarNotificacionPorCodigo('INICIANDO_SESION');
    
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
        
        mostrarNotificacionPorCodigo('LOGIN_EXITOSO');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        mostrarNotificacionPorCodigo('LOGIN_FALLIDO');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      mostrarNotificacionPorCodigo('ERROR_CONEXION');
    }
  });
}

// ========== RECUPERACIÓN DE CONTRASEÑA ==========
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!validarFormatoEmail(email)) {
      mostrarNotificacionPorCodigo('EMAIL_INVALIDO');
      return;
    }
    
    mostrarNotificacionPorCodigo('RECUPERACION_ENVIADA');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  });
}