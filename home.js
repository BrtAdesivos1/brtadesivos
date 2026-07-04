/* ---- 🔒 BLINDAGEM 🔒 ---- */
// Bloqueia o clique direito e o clique longo no celular na Home
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// Bloqueia o atalho de teclado Ctrl+S (Salvar) e Ctrl+U (Ver código fonte) na Home
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && (event.key === 's' || event.key === 'S' || event.key === 'u' || event.key === 'U')) {
    event.preventDefault();
  }
});


/* ---- 🚚 CARROSSEL DE FRASES 🚚 ---- */
const frasesContainer = document.querySelector('.carrossel-frases');
const totalFrases = document.querySelectorAll('.frase-item').length;
let indiceAtual = 0;

function moverCarrossel() {
  indiceAtual++;
  
  // Se passar da última frase, volta para a primeira
  if (indiceAtual >= totalFrases) {
    indiceAtual = 0;
  }
  
  // Faz o cálculo matemático para mover o bloco de frases para a esquerda
  const deslocamento = indiceAtual * -100;
  if (frasesContainer) {
    frasesContainer.style.transform = `translateX(${deslocamento}%)`;
  }
}

// Executa a função de mover a cada 8 segundos
setInterval(moverCarrossel, 8000);


/* ---- 🍔 LÓGICA DO MENU LATERAL 🍔 ---- */
const menuLateral = document.getElementById('menu-lateral');
const botaoMenu = document.querySelector('.icone-menu'); // As três barrinhas do topo
const botaoFechar = document.getElementById('botao-fechar-menu'); // O "X" do menu

// Abre o menu de forma suave e congela o fundo
if (botaoMenu && menuLateral) {
  botaoMenu.addEventListener('click', () => {
    menuLateral.classList.add('ativo');
    document.body.classList.add('travar-scroll'); // Congela o fundo
  });
}

// Fecha o menu de forma suave e libera o fundo
if (botaoFechar && menuLateral) {
  botaoFechar.addEventListener('click', () => {
    menuLateral.classList.remove('ativo');
    document.body.classList.remove('travar-scroll'); // Destrava o fundo
  });
}


/* ---- 🛒 LÓGICA DO MENU DO CARRINHO 🛒 ---- */
const menuCarrinho = document.getElementById('menu-carrinho');
const botaoCarrinho = document.querySelector('.icone-cesta');
const botaoFecharCarrinho = document.getElementById('botao-fechar-carrinho');
const btnFinalizar = document.querySelector('.btn-finalizar-carrinho');

// Elementos adicionados para controlar o estado do carrinho interno
const listaItensCarrinho = document.getElementById('itens-carrinho-lista');
const msgCarrinhoVazio = document.getElementById('carrinho-vazio-msg');
const valorTotalExibido = document.getElementById('valor-total-exibido');

// Tenta carregar os itens salvos no localStorage. Se não houver nada, começa vazio [].
let produtosNoCarrinho = JSON.parse(localStorage.getItem('carrinho_brota_tchuca')) || [];

// Abre o carrinho e congela o fundo
if (botaoCarrinho && menuCarrinho) {
  botaoCarrinho.addEventListener('click', () => {
    menuCarrinho.classList.add('ativo');
    document.body.classList.add('travar-scroll'); // Congela o fundo
  });
}

// Fecha o carrinho e libera o fundo
if (botaoFecharCarrinho && menuCarrinho) {
  botaoFecharCarrinho.addEventListener('click', () => {
    menuCarrinho.classList.remove('ativo');
    document.body.classList.remove('travar-scroll'); // Destrava o fundo
  });
}

// Função para atualizar os elementos visuais e a conta do carrinho
function renderizarCarrinho() {
  if (!listaItensCarrinho) return;
  listaItensCarrinho.innerHTML = '';
  
  // Toda vez que o carrinho renderizar, nós salvamos o estado atual dele no localStorage
  localStorage.setItem('carrinho_brota_tchuca', JSON.stringify(produtosNoCarrinho));
  
  if (produtosNoCarrinho.length === 0) {
    if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'block';
    if (valorTotalExibido) valorTotalExibido.textContent = 'R$ 0,00';
  } else {
    if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'none';
    let totalAcumulado = 0;
    let htmlAcumulado = ''; // Variável para acumular o HTML e evitar múltiplas alterações no DOM

    produtosNoCarrinho.forEach(item => {
      totalAcumulado += item.preco * item.quantidade;
      
      // Envolver o item.id em aspas simples '${item.id}' para IDs de texto funcionarem!
      htmlAcumulado += `
        <div class="carrinho-item-linha">
          <img src="${item.foto}" class="carrinho-item-img" alt="${item.nome}">
          <div class="carrinho-item-infos">
            <span class="carrinho-item-titulo">${item.nome}</span>
            <span class="carrinho-item-subtotal">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
            <div class="carrinho-item-acoes">
              <span class="carrinho-item-qtd-txt">Qtd: ${item.quantidade}</span>
              <button class="btn-excluir-do-carrinho" onclick="removerItemDoCarrinho('${item.id}')">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    // textContent atualizado de uma vez só
    listaItensCarrinho.innerHTML = htmlAcumulado;
    if (valorTotalExibido) valorTotalExibido.textContent = `R$ ${totalAcumulado.toFixed(2).replace('.', ',')}`;
  }
}

// FUNÇÃO GLOBAL PARA ADICIONAR PRODUTOS DA VITRINE AO CARRINHO
window.adicionarItemAoCarrinho = function(id, nome, preco, foto) {
  const produtoExistente = produtosNoCarrinho.find(prod => String(prod.id) === String(id));

  if (produtoExistente) {
    produtoExistente.quantidade += 1;
  } else {
    produtosNoCarrinho.push({
      id: String(id),
      nome: nome,
      preco: parseFloat(preco),
      foto: foto,
      quantidade: 1
    });
  }

  renderizarCarrinho();

  // Abre a gaveta do carrinho para feedback visual do usuário
  if (menuCarrinho) {
    menuCarrinho.classList.add('ativo');
    document.body.classList.add('travar-scroll');
  }
};

// FUNÇÃO PARA ACEITAR QUALQUER TIPO DE ID (TEXTO OU NÚMERO) AO REMOVER
window.removerItemDoCarrinho = function(id) {
  produtosNoCarrinho = produtosNoCarrinho.filter(prod => String(prod.id) !== String(id));
  renderizarCarrinho();
};

// Ação do botão Finalizar Compra baseada se o array possui itens ou não
if (btnFinalizar) {
  btnFinalizar.addEventListener('click', () => {
    if (produtosNoCarrinho.length === 0) {
      alert('Ops! Seu carrinho está vazio. Adicione pelo menos um produto para poder finalizar a sua compra! 🛒📦');
    } else {
      window.location.href = 'index2.html';
    }
  });
}


/* ---- 🎛️ LÓGICA DA GAVETA DE FILTROS E ALEATORIEDADE 🎛️ ---- */
const btnAbrirFiltro = document.getElementById('btn-abrir-filtro');
const btnFecharFiltro = document.getElementById('botao-fechar-filter'); 
const gavetaFiltro = document.getElementById('gaveta-filter') || document.getElementById('gaveta-filtro');
const overlayFiltro = document.getElementById('overlay-filtro');
const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro');

// Captura os elementos reais da vitrine para realizar as manipulações
const containerVitrine = document.querySelector('.container-vitrine');
const todosOsProdutosFiltro = document.querySelectorAll('.container-vitrine .produto-card');

// Salva a ordem padrão (HTML) original assim que a página carrega
const ordemOriginalProdutos = Array.from(todosOsProdutosFiltro);

// Função auxiliar matemática para embaralhar arrays (Algoritmo Fisher-Yates)
function misturarProdutos(array) {
  let resultado = [...array];
  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

// Função para abrir os filtros e congelar o fundo
if (btnAbrirFiltro && gavetaFiltro && overlayFiltro) {
  btnAbrirFiltro.addEventListener('click', () => {
    gavetaFiltro.classList.add('ativo');
    overlayFiltro.classList.add('ativo');
    document.body.classList.add('travar-scroll'); 
  });
}

// Função para fechar os filtros e liberar o fundo
function fecharFiltros() {
  if (gavetaFiltro && overlayFiltro) {
    gavetaFiltro.classList.remove('ativo');
    overlayFiltro.classList.remove('ativo');
    document.body.classList.remove('travar-scroll'); 
  }
}

const fecharFiltroBtn = btnFecharFiltro || document.getElementById('botao-fechar-filtro');
if (fecharFiltroBtn) {
  fecharFiltroBtn.addEventListener('click', fecharFiltros);
}
if (overlayFiltro) {
  overlayFiltro.addEventListener('click', fecharFiltros);
}

// Lógica de ordenação (Aleatório, Menor e Maior Preço)
if (btnAplicarFiltro) {
  btnAplicarFiltro.addEventListener('click', () => {
    const ordenacaoSelecionada = document.querySelector('input[name="ordenacao"]:checked')?.value;
    
    if (containerVitrine) {
      let arrayProdutos = Array.from(todosOsProdutosFiltro);

      // Garante que todos voltem a ficar visíveis caso a busca tenha ocultado algo anteriormente
      arrayProdutos.forEach(card => card.style.display = 'flex');

      if (ordenacaoSelecionada === 'menor-preco') {
        // Ordena do menor para o maior preço matematicamente baseado no data-preco
        arrayProdutos.sort((cardA, cardB) => {
          return parseFloat(cardA.getAttribute('data-preco') || 0) - parseFloat(cardB.getAttribute('data-preco') || 0);
        });
      } else if (ordenacaoSelecionada === 'maior-preco') {
        // Ordena do maior para o menor preço matematicamente baseado no data-preco
        arrayProdutos.sort((cardA, cardB) => {
          return parseFloat(cardB.getAttribute('data-preco') || 0) - parseFloat(cardA.getAttribute('data-preco') || 0);
        });
      } else {
        // Se for 'aleatorio' (ou a opção padrão marcada no HTML), mistura os itens na hora!
        arrayProdutos = misturarProdutos(arrayProdutos);
      }

      // Reinjeta fisicamente a nova ordem dos cards no container do site
      arrayProdutos.forEach(card => {
        containerVitrine.appendChild(card);
      });
      
      // Oculta o aviso de erro por segurança já que todos os produtos estarão ativos
      const avisoSemResultadosFiltro = document.getElementById('busca-sem-resultados');
      if (avisoSemResultadosFiltro) avisoSemResultadosFiltro.classList.remove('visivel');
    }

    fecharFiltros();
  });
}


/* ---- 🔍 LÓGICA DO CAMPO DE BUSCA (FILTRANDO VITRINE EM TEMPO REAL) 🔍 ---- */
const inputBusca = document.getElementById('input-busca');
const btnLimparBusca = document.getElementById('btn-limpar-busca');
const erroBusca = document.getElementById('erro-busca');
const avisoSemResultados = document.getElementById('busca-sem-resultados');
const todosOsProdutos = document.querySelectorAll('.container-vitrine .produto-card');

if (inputBusca && btnLimparBusca && erroBusca) {
  
  function filtrarProdutosDaVitrine() {
    const termoBuscado = inputBusca.value.toLowerCase().trim();
    let contadorProdutosVisiveis = 0;

    todosOsProdutos.forEach(card => {
      const nomeProduto = card.getAttribute('data-nome')?.toLowerCase() || "";
      
      if (nomeProduto.includes(termoBuscado)) {
        card.style.display = 'flex'; 
        contadorProdutosVisiveis++;
      } else {
        card.style.display = 'none'; 
      }
    });

    if (contadorProdutosVisiveis === 0 && termoBuscado.length > 0) {
      if (avisoSemResultados) {
        avisoSemResultados.classList.add('visivel');
      }
    } else {
      if (avisoSemResultados) {
        avisoSemResultados.classList.remove('visivel');
      }
    }
  }
  
  inputBusca.addEventListener('input', (event) => {
    const valor = event.target.value;
    
    if (valor.length > 0) {
      btnLimparBusca.style.display = 'block';
      erroBusca.style.display = 'none'; 
      inputBusca.style.borderColor = '#2ECC71'; 
    } else {
      btnLimparBusca.style.display = 'none';
      inputBusca.style.borderColor = '#2ECC71';
    }
    
    filtrarProdutosDaVitrine();
  });
  
  btnLimparBusca.addEventListener('click', () => {
    inputBusca.value = '';
    btnLimparBusca.style.display = 'none';
    erroBusca.style.display = 'none';
    inputBusca.style.borderColor = '#E0E0E0'; 
    
    filtrarProdutosDaVitrine();
    inputBusca.focus();
  });
  
  inputBusca.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      
      const valorFinal = inputBusca.value.trim();
      
      if (valorFinal === "") {
        erroBusca.style.display = 'block';
        inputBusca.style.borderColor = '#B11F1F';
      } else {
        erroBusca.style.display = 'none';
        inputBusca.style.borderColor = '#2ECC71';
      }
    }
  });
}


/* ---- 🔝 BOTÃO VOLTAR AO TOPO 🔝 ---- */
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


/* ---- ⚡ INICIALIZAÇÃO DA PÁGINA COM ALEATORIEDADE INTELIGENTE ⚡ ---- */
if (containerVitrine && todosOsProdutosFiltro.length > 0) {
  // Joga uma moeda virtual (50% de chance de dar true)
  const deveEmbaralhar = Math.random() < 0.5;

  if (deveEmbaralhar) {
    // Se cair nos 50%, mistura tudo de forma aleatória
    const produtosMisturados = misturarProdutos(Array.from(todosOsProdutosFiltro));
    produtosMisturados.forEach(card => containerVitrine.appendChild(card));
  }
  // Caso contrário, mantém a ordem original padrão vinda do arquivo HTML
}

// Inicializa os elementos e dados salvos no carrinho
renderizarCarrinho();
