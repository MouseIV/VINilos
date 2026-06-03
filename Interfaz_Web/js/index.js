// ============================================
// 🏠 INDEX - LÓGICA DE LA PÁGINA PRINCIPAL
// ============================================

if (window.location.pathname.includes('index.html') || 
    window.location.pathname === '/' || 
    window.location.pathname === '/index.html') {
  
  setTimeout(() => {
    mostrarNotificacionPorCodigo('FINETUNING_BIENVENIDA');
  }, 1500);
  
  const miCuentaBtn = document.getElementById('miCuentaBtn');
  
  if (miCuentaBtn) {
    miCuentaBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const tokenExpirado = payload.exp * 1000 < Date.now();
          
          if (!tokenExpirado) {
            window.location.href = 'perfil.html';
          } else {
            localStorage.clear();
            mostrarNotificacionPorCodigo('SESION_EXPIRADA');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
          }
        } catch (e) {
          localStorage.clear();
          window.location.href = 'login.html';
        }
      } else {
        window.location.href = 'login.html';
      }
    });
  }
  
  const vinilosDestacados = [
    {
      titulo: "Abbey Road",
      artista: "The Beatles",
      anio: 1969,
      genero: "Rock",
      imagenUrl: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
    },
    {
      titulo: "Thriller",
      artista: "Michael Jackson",
      anio: 1982,
      genero: "Pop",
      imagenUrl: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"
    },
    {
      titulo: "Dark Side of the Moon",
      artista: "Pink Floyd",
      anio: 1973,
      genero: "Rock Progresivo",
      imagenUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
    },
    {
      titulo: "Back in Black",
      artista: "AC/DC",
      anio: 1980,
      genero: "Hard Rock",
      imagenUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Acdc_backinblack_cover.jpg"
    }
  ];

  const grid = document.getElementById('destacadosGrid');
  if (grid) {
    grid.innerHTML = vinilosDestacados.map(vinilo => `
      <div class="preview-card" onclick="window.location.href='dashboard.html?buscar=${encodeURIComponent(vinilo.artista)}'">
        <div class="preview-card-image">
          <img src="${vinilo.imagenUrl}" alt="${vinilo.titulo}" onerror="this.src='https://picsum.photos/200/200'">
        </div>
        <div class="preview-card-info">
          <h3>${vinilo.titulo}</h3>
          <p>🎤 ${vinilo.artista}</p>
          <p>📅 ${vinilo.anio}</p>
          <p>🎸 ${vinilo.genero}</p>
        </div>
      </div>
    `).join('');
  }
}