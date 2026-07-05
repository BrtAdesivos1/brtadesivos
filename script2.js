/* ---- 🔒 BLINDAGEM DE SEGURANÇA ORIGINAL ---- */

// Bloqueia o clique direito e o clique longo no celular
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// Bloqueia os atalhos de teclado Ctrl+S (Salvar) e Ctrl+U (Ver código fonte)
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && (event.key === 's' || event.key === 'S' || event.key === 'u' || event.key === 'U')) {
    event.preventDefault();
  }
});


/* ---- ⚙️ CONFIGURAÇÃO E VARIÁVEIS DO SISTEMA ---- */
const NUMERO_WHATSAPP = "5598987261116";

const btnIrEndereco = document.getElementById('btn-ir-endereco');
const btnVoltarEndereco = document.getElementById('btn-voltar-endereco');

const secaoResumo = document.getElementById('secao-resumo');
const secaoEndereco = document.getElementById('secao-endereco');
const secaoPagamento = document.getElementById('secao-pagamento');

const stepEndereco = document.getElementById('step-endereco');
const stepPagamento = document.getElementById('step-pagamento');

let dadosPedido = {
  nomeProduto: "", // Vai guardar o texto formatado para o WhatsApp
  qtd: 0,
  subtotal: 0,
  desconto: 0,
  frete: 28.00,
  totalGeral: 0
};


// ─── CÁLCULOS (Adesivo + Frete - Desconto) ───
function executarCalculos() {
  const valorComFrete = dadosPedido.subtotal + dadosPedido.frete;
  dadosPedido.desconto = valorComFrete * 0.14;
  dadosPedido.totalGeral = valorComFrete - dadosPedido.desconto;
  
  document.getElementById('qtd-total-itens').innerText = dadosPedido.qtd;
  document.getElementById('valor-subtotal').innerText = `R$ ${dadosPedido.subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('valor-desconto').innerText = `- R$ ${dadosPedido.desconto.toFixed(2).replace('.', ',')}`;
  document.getElementById('valor-total-geral').innerText = `R$ ${dadosPedido.totalGeral.toFixed(2).replace('.', ',')}`;
  
  // Na revisão final, injeta os itens formatados
  document.getElementById('revisao-nome-produto').innerHTML = dadosPedido.nomeProduto;
  document.getElementById('revisao-qtd-produto').innerText = `${dadosPedido.qtd}x`;
  document.getElementById('revisao-total-geral').innerText = `R$ ${dadosPedido.totalGeral.toFixed(2).replace('.', ',')}`;
}


// ─── CARREGAR DO CARRINHO (SEM COR E SEM TAMANHO) ───
function carregarDadosDoCarrinho() {
  const carrinhoSalvo = localStorage.getItem('carrinho_brota_tchuca');
  const containerLista = document.querySelector('.lista-produtos-resumo');
  
  containerLista.innerHTML = "";
  
  if (carrinhoSalvo) {
    const itens = JSON.parse(carrinhoSalvo);
    if (itens && itens.length > 0) {
      let somaSubtotal = 0;
      let somaQtd = 0;
      let detalhesProdutosZap = [];
      
      itens.forEach(item => {
        const precoItem = parseFloat(item.preco || item.price || 0);
        const qtdItem = parseInt(item.quantidade || item.quantity || 1);
        let nomeItem = item.nome || item.name || "Adesivo";
        
        // Se o nome contiver parênteses antigos com tamanhos, limpa para manter o padrão visual limpo
        if (nomeItem.includes('(')) {
          nomeItem = nomeItem.split('(')[0].trim();
        }
        
        somaSubtotal += (precoItem * qtdItem);
        somaQtd += qtdItem;
        
        // Mensagem limpa apenas com Nome e Quantidade para o WhatsApp
        detalhesProdutosZap.push(`• *${nomeItem}* (${qtdItem}x)`);
        
        // Card visual limpo para a Etapa 1 e Etapa de Pagamento (Sem cor e sem tamanho)
        const cardHTML = `
          <div class="produto-resumo-card" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; background: #fff; padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee; width: 100%;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <span class="produto-resumo-nome" style="font-weight: 700; color: #333; font-size: 0.85rem;">${nomeItem}</span>
              <span class="produto-resumo-qtd" style="font-weight: 800; color: #000; font-size: 0.85rem;">${qtdItem}x</span>
            </div>
          </div>
        `;
        containerLista.innerHTML += cardHTML;
      });
      
      dadosPedido.subtotal = somaSubtotal;
      dadosPedido.qtd = somaQtd;
      dadosPedido.nomeProduto = detalhesProdutosZap.join("\n").replace(/\n/g, "<br>");
    }
  } else {
    containerLista.innerHTML = `<p style="text-align:center; font-size:0.9rem; color:#777;">Nenhum produto no carrinho.</p>`;
  }
  executarCalculos();
}


/* ---- 🔒 TRAVAS DE SEGURANÇA E VALIDAÇÕES NOS INPUTS ---- */
document.getElementById('cep').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 5) {
    v = v.substring(0, 5) + '-' + v.substring(5, 8);
  }
  e.target.value = v;
});

document.getElementById('cidade').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[0-9]/g, '');
});

document.getElementById('estado').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[0-9]/g, '').toUpperCase();
});

document.getElementById('telefone').addEventListener('input', (e) => {
  let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
  e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});


/* ---- 🧭 NAVEGAÇÃO ENTRE ETAPAS ---- */

// Avançar: Resumo -> Endereço
btnIrEndereco.addEventListener('click', () => {
  secaoResumo.classList.remove('ativa');
  secaoEndereco.classList.add('ativa');
  stepEndereco.classList.add('ativa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Voltar: Pagamento -> Endereço (Preserva os inputs preenchidos)
if (btnVoltarEndereco) {
  btnVoltarEndereco.addEventListener('click', () => {
    secaoPagamento.classList.remove('ativa');
    stepPagamento.classList.remove('ativa');
    secaoEndereco.classList.add('ativa');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Avançar: Endereço -> Pagamento
document.getElementById('form-endereco').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const cep = document.getElementById('cep').value;
  const rua = document.getElementById('rua').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const complemento = document.getElementById('complemento').value;
  const cidade = document.getElementById('cidade').value;
  const estado = document.getElementById('estado').value;
  const telefone = document.getElementById('telefone').value;
  
  if (cep.length < 9) {
    alert("Por favor, digite um CEP válido com 8 números.");
    return;
  }
  
  const enderecoFormatado = `${rua}, Nº ${numero}${complemento ? ' ('+complemento+')' : ''} - Bairro: ${bairro} - ${cidade}/${estado.toUpperCase()} - CEP: ${cep}`;
  
  document.getElementById('revisao-endereco-completo').innerText = enderecoFormatado;
  document.getElementById('revisao-telefone-contato').innerText = telefone;
  
  secaoEndereco.classList.remove('ativa');
  secaoPagamento.classList.add('ativa');
  stepPagamento.classList.add('ativa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---- 📲 DISPARO PARA O WHATSAPP ---- */
document.getElementById('btn-enviar-whatsapp').addEventListener('click', () => {
  const enderecoCompleto = document.getElementById('revisao-endereco-completo').innerText;
  const telefoneContato = document.getElementById('revisao-telefone-contato').innerText;
  
  // Transforma o padrão HTML de volta para texto limpo que o WhatsApp entende (sem cor/tamanho)
  let textoProdutosZap = dadosPedido.nomeProduto.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "");
  
  let textoMensagem = `🚀 *NOVO PEDIDO - BRT ADESIVOS*\n\n`;
  textoMensagem += `📦 *ITENS COMPRADOS:* \n${textoProdutosZap}\n\n`;
  textoMensagem += `📍 *ENDEREÇO DE ENTREGA:* \n${enderecoCompleto}\n\n`;
  textoMensagem += `📞 *TELEFONE DE CONTATO:* ${telefoneContato}\n\n`;
  textoMensagem += `─── FINANCEIRO ───\n`;
  textoMensagem += `💰 *Subtotal Adesivos:* R$ ${dadosPedido.subtotal.toFixed(2).replace('.', ',')}\n`;
  textoMensagem += `🚚 *Frete Fixo:* R$ ${dadosPedido.frete.toFixed(2).replace('.', ',')}\n`;
  textoMensagem += `📉 *Desconto (14% aplicado):* - R$ ${dadosPedido.desconto.toFixed(2).replace('.', ',')}\n`;
  textoMensagem += `⭐ *TOTAL REAL A PAGAR:* R$ ${dadosPedido.totalGeral.toFixed(2).replace('.', ',')}\n\n`;
  textoMensagem += `_Aguardo as chaves Pix para pagamento!_`;
  
  window.open(`https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${encodeURIComponent(textoMensagem)}`, '_blank');
});

// Inicialização
window.addEventListener('DOMContentLoaded', carregarDadosDoCarrinho);

// ———— FIM ————
