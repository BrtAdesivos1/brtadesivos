/* ---- 🔒 BLINDAGEM SOBRE 🔒 ---- */
// Bloqueia clique direito e clique longo
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// Bloqueia atalhos Ctrl+S e Ctrl+U
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && (event.key === 's' || event.key === 'S' || event.key === 'u' || event.key === 'U')) {
    event.preventDefault();
  }
});

// Seleção de elementos do Menu Lateral
const menuLateral = document.getElementById('menu-lateral');
const btnAbrirMenu = document.getElementById('botao-abrir-menu');
const btnFecharMenu = document.getElementById('botao-fechar-menu');
const body = document.body;

// Abrir Menu Lateral
btnAbrirMenu.addEventListener('click', () => {
  menuLateral.classList.add('ativo');
  body.classList.add('travar-scroll');
});

// Fechar Menu Lateral
btnFecharMenu.addEventListener('click', () => {
  menuLateral.classList.remove('ativo');
  body.classList.remove('travar-scroll');
});