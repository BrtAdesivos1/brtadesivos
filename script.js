// Bloqueia o clique direito e o clique longo no celular
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// Bloqueia o atalho de teclado Ctrl+S (Salvar) e Ctrl+U (Ver código fonte)
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && (event.key === 's' || event.key === 'S' || event.key === 'u' || event.key === 'U')) {
    event.preventDefault();
  }
});

// Efeito de sumir suave ao clicar em COMEÇAR
document.getElementById('btn-comecar').addEventListener('click', function(event) {
  event.preventDefault(); // Impede o navegador de mudar de página na hora
  
  const linkDestino = this.getAttribute('href'); // Pega o "home.html"
  const telaInicial = document.querySelector('.tela-inicial');
  
  telaInicial.classList.add('sumir'); // Adiciona a classe que faz tudo sumir suave
  
  // Espera a animação de 0.6 segundos terminar para trocar de página
  setTimeout(function() {
    window.location.href = linkDestino;
  }, 600);
});