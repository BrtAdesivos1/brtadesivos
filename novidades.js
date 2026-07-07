/* ---- 🔒 BLINDAGEM DE SEGURANÇA GLOBAL ---- */
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && (event.key === 's' || event.key === 'S' || event.key === 'u' || event.key === 'U')) {
    event.preventDefault();
  }
});


/* ---- 🚚 CARROSSEL DE FRASES INDEPENDENTE ---- */
const frasesContainer = document.querySelector('.carrossel-frases');
const totalFrases = 4; 
let indiceAtual = 0;

function moverCarrossel() {
  indiceAtual++;
  if (indiceAtual >= totalFrases) {
    indiceAtual = 0;
  }
  const deslocamento = indiceAtual * -100;
  if (frasesContainer) {
    frasesContainer.style.transform = `translateX(${deslocamento}%)`;
  }
}
setInterval(moverCarrossel, 8000);


/* ---- 🍔 LÓGICA DO MENU LATERAL ---- */
const menuLateral = document.getElementById('menu-lateral');
const botaoMenu = document.querySelector('.icone-menu');
const botaoFechar = document.getElementById('botao-fechar-menu');

if (botaoMenu && menuLateral) {
  botaoMenu.addEventListener('click', () => {
    menuLateral.classList.add('ativo');
    document.body.classList.add('travar-scroll');
  });
}

if (botaoFechar && menuLateral) {
  botaoFechar.addEventListener('click', () => {
    menuLateral.classList.remove('ativo');
    document.body.classList.remove('travar-scroll');
  });
}


/* ==========================================================================
   🔔 PAINEL DE ATUALIZAÇÕES (MURAL PERMANENTE)
   ========================================================================== */

// Cadastre suas novidades aqui! As mais recentes ficam no topo.
const LISTA_DE_NOVIDADES = [
    {
        tipo: 'lancamento',
        tagTexto: 'NOVIDADE 🎉',
        data: '07 de Julho, 2026',
        titulo: 'Agora Estamos No Google!',
        descricao: 'Nossa página já pode ser encontrada nas pesquisas do Google. Basta pesquisar por Brota Tchuca Oficial ou brtadesivos para encontrar nosso perfil de forma rápida e acessar todas as nossas novidades.'
    },
    {
        tipo: 'aviso',
        tagTexto: 'AVISO IMPORTANTE ⚠️',
        data: '07 de Julho, 2026',
        titulo: 'Atualização de Valores',
        descricao: 'Com a mudança de gráfica, os valores dos adesivos e do frete passarão por uma atualização. Continuaremos realizando envios para todo o Brasil, mantendo a mesma qualidade e compromisso de sempre. Os preços terão um pequeno reajuste para acompanhar essa mudança, mas seguiremos oferecendo o melhor custo-benefício para nossos clientes.'
    }
];

// Injeta automaticamente os cards na linha do tempo assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    const containerTimeline = document.querySelector('.linha-do-tempo');
    if (!containerTimeline) return;

    containerTimeline.innerHTML = ''; // Limpa qualquer conteúdo estático do HTML

    LISTA_DE_NOVIDADES.forEach(novidade => {
        const cardHTML = `
            <div class="card-novidade">
                <div class="tag-notificacao tag-${novidade.tipo}">${novidade.tagTexto}</div>
                <span class="data-notificacao">${novidade.data}</span>
                <h3 class="titulo-notificacao">${novidade.titulo}</h3>
                <p class="texto-notificacao">${novidade.descricao}</p>
            </div>
        `;
        containerTimeline.innerHTML += cardHTML;
    });
});