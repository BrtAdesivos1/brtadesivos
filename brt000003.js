/* ---- 🔒 BLINDAGEM DO PRODUTO ---- */
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


/* ---- 🛒 LÓGICA DO MENU DO CARRINHO (SINCRONIZADO) ---- */
const menuCarrinho = document.getElementById('menu-carrinho');
const botaoCarrinho = document.querySelector('.icone-cesta');
const botaoFecharCarrinho = document.getElementById('botao-fechar-carrinho');
const btnFinalizar = document.querySelector('.btn-finalizar-carrinho');

const listaItensCarrinho = document.getElementById('itens-carrinho-lista');
const msgCarrinhoVazio = document.getElementById('carrinho-vazio-msg');
const valorTotalExibido = document.getElementById('valor-total-exibido');

// Variável global para armazenar o preço do tamanho que está selecionado no momento (Padrão: 0.00)
let precoTamanhoAtual = 8.00;

// Lê a mesma chave de armazenamento para puxar as compras feitas na Home!
let produtosNoCarrinho = JSON.parse(localStorage.getItem('carrinho_brota_tchuca')) || [];

if (botaoCarrinho && menuCarrinho) {
  botaoCarrinho.addEventListener('click', () => {
    menuCarrinho.classList.add('ativo');
    document.body.classList.add('travar-scroll');
  });
}

if (botaoFecharCarrinho && menuCarrinho) {
  botaoFecharCarrinho.addEventListener('click', () => {
    menuCarrinho.classList.remove('ativo');
    document.body.classList.remove('travar-scroll');
  });
}

// Função de renderização rápida otimizada por texto acumulado
function renderizarCarrinho() {
  // Caso seu HTML use id diferente do container dinâmico criado anteriormente, garantimos a compatibilidade:
  const containerAlvo = listaItensCarrinho || document.querySelector('.conteudo-menu-carrinho');
  const exibicaoTotal = valorTotalExibido || document.querySelector('.valor-total');
  
  if (!containerAlvo) return;
  
  containerAlvo.innerHTML = '';
  localStorage.setItem('carrinho_brota_tchuca', JSON.stringify(produtosNoCarrinho));
  
  if (produtosNoCarrinho.length === 0) {
    if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'block';
    else {
      containerAlvo.innerHTML = `
        <div class="carrinho-vazio">
            <i class="fas fa-shopping-basket"></i>
            <p>Seu carrinho está vazio</p>
        </div>`;
    }
    if (exibicaoTotal) exibicaoTotal.textContent = 'R$ 0,00';
  } else {
    if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'none';
    let totalAcumulado = 0;
    let htmlAcumulado = '';
    
    produtosNoCarrinho.forEach(item => {
      totalAcumulado += item.preco * item.quantidade;
      
      htmlAcumulado += `
        <div class="carrinho-item-linha">
          <img src="${item.foto}" class="carrinho-item-img" alt="${item.nome}">
          <div class="carrinho-item-infos">
            <span class="carrinho-item-titulo">${item.nome}</span>
            <span class="carrinho-item-subtotal">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            <div class="carrinho-item-acoes">
              <span class="carrinho-item-qtd-txt">Qtd: ${item.quantidade}</span>
              <button class="btn-excluir-do-carrinho" onclick="removerItemDoCarrinho('${item.id}')">
                Remover
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    containerAlvo.innerHTML = htmlAcumulado;
    if (exibicaoTotal) exibicaoTotal.textContent = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;
  }
}

window.removerItemDoCarrinho = function(id) {
  // Convertido para string para evitar conflitos de ID gerados por texto
  produtosNoCarrinho = produtosNoCarrinho.filter(prod => String(prod.id) !== String(id));
  renderizarCarrinho();
};

if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    if (produtosNoCarrinho.length === 0) {
      alert('Ops! Seu carrinho está vazio. Adicione pelo menos um produto para poder finalizar a sua compra! 🛒📦');
    } else {
      // Deixado com o '#' conforme solicitado para criarmos a página depois!
      window.location.href = 'index2.html';
    }
  });
}


/* ---- 🔝 BOTÃO VOLTAR AO TOPO DO PRODUTO ---- */
const botaoTopo = document.getElementById('btn-topo');

if (botaoTopo) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      botaoTopo.classList.add('visivel');
    } else {
      botaoTopo.classList.remove('visivel');
    }
  });
  
  botaoTopo.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* ---- 📏 CONTROLE DE TAMANHOS, QUANTIDADE E COMPRA ---- */

// Função para alternar entre os tamanhos, preço e texto do cabeçalho
function mudarTamanho(botaoClicado, novoPreco, textoTamanho) {
  // 1. Remove a seleção de todos os botões
  const botoes = document.querySelectorAll('.btn-tamanho');
  botoes.forEach(btn => btn.classList.remove('selecionado'));
  
  // 2. Destaca o botão clicado
  botaoClicado.classList.add('selecionado');
  
  // 3. Converte a string "6,50" ou "18,00" para número real e atualiza a variável global
  precoTamanhoAtual = parseFloat(novoPreco.replace(',', '.'));
  
  // 4. Atualiza o preço na tela
  document.getElementById('valor-produto').innerText = 'R$ ' + novoPreco;
  
  // 5. Atualiza o texto na frente da palavra "Tamanho:"
  document.getElementById('tamanho-selecionado').innerText = textoTamanho;
}

// Função para aumentar ou diminuir a quantidade pelas setas/botões
function alterarQuantidade(valor) {
  const inputQtd = document.getElementById('quantidade');
  let qtdAtual = parseInt(inputQtd.value) || 1;
  
  qtdAtual += valor;
  
  if (qtdAtual < 1) {
    qtdAtual = 1;
  }
  
  inputQtd.value = qtdAtual;
}

// Função para validar o número se o usuário digitar diretamente no campo
function validarQuantidade() {
  const inputQtd = document.getElementById('quantidade');
  let qtdAtual = parseInt(inputQtd.value);
  
  if (isNaN(qtdAtual) || qtdAtual < 1) {
    inputQtd.value = 1;
  }
}

// Função para exibir o Pop-up Toast ao clicar em Comprar e adicionar ao LocalStorage
function mostrarToast() {
  // Captura as informações dinâmicas do produto atual
  const tituloBase = document.querySelector('.titulo-produto').innerText;
  const tamanhoEscolhido = document.getElementById('tamanho-selecionado').innerText;
  const inputQtd = document.getElementById('quantidade'); // Elemento do input capturado
  const quantidadeDigitada = parseInt(inputQtd.value) || 1;
  const imagemSrc = document.querySelector('.imagem-produto-quadrada').src;
  
  // Cria um nome único contendo o tamanho para separar itens no carrinho
  const nomeCompletoProduto = `${tituloBase} (${tamanhoEscolhido})`;
  const idUnico = nomeCompletoProduto; // Usa a string como ID único de controle
  
  // Verifica se o item com esse tamanho exato já está no carrinho
  const itemExistente = produtosNoCarrinho.find(item => item.id === idUnico);
  
  if (itemExistente) {
    itemExistente.quantidade += quantidadeDigitada;
  } else {
    produtosNoCarrinho.push({
      id: idUnico,
      nome: nomeCompletoProduto,
      preco: precoTamanhoAtual,
      quantidade: quantidadeDigitada,
      foto: imagemSrc
    });
  }
  
  // Renderiza novamente e salva a nova lista no localStorage
  renderizarCarrinho();
  
  // Voltando a quantidade do seletor para 1 após a inserção no carrinho
  inputQtd.value = 1;
  
  // Executa o efeito visual do Toast subindo na tela
  const toast = document.getElementById('toast-sucesso');
  if (toast) {
    toast.classList.add('mostrar');
    setTimeout(() => {
      toast.classList.remove('mostrar');
    }, 2500);
  }
}

function mudarCor(botao) {
  document.querySelectorAll('.btn-cor-bloco').forEach(btn => {
    btn.classList.remove('selecionado');
  });
  botao.classList.add('selecionado');
}

// Inicializa a renderização com os dados do localstorage ao abrir a página
renderizarCarrinho();