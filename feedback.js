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


/* ---- ⭐ LÓGICA DE SELEÇÃO DE ESTRELAS ---- */
const estrelas = document.querySelectorAll('.estrela-btn');
let notaSelecionada = 5;

atualizarEstrelas(notaSelecionada);

estrelas.forEach(estrela => {
    estrela.addEventListener('click', () => {
        notaSelecionada = parseInt(estrela.getAttribute('data-valor'));
        atualizarEstrelas(notaSelecionada);
    });
});

function atualizarEstrelas(valor) {
    estrelas.forEach(est => {
        const valorEstrela = parseInt(est.getAttribute('data-valor'));
        if (valorEstrela <= valor) {
            est.classList.add('ativa');
        } else {
            est.classList.remove('ativa');
        }
    });
}


/* ---- 📝 TRATAMENTO DE DADOS E ENVIO EXCLUSIVO PARA WHATSAPP ---- */
const formDepoimento = document.getElementById('form-depoimento');
const btnEnviar = document.getElementById('btn-enviar');
const textoBtn = btnEnviar ? btnEnviar.querySelector('.texto-btn') : null;
const loaderBtn = document.getElementById('loader-btn');
const msgSucesso = document.getElementById('msg-sucesso');

function formatarNomeOculto(nomeCompleto) {
    const partes = nomeCompleto.trim().split(/\s+/);
    if (partes.length > 1) {
        const primeiroNome = partes[0];
        const inicialSobrenome = partes[1].charAt(0).toUpperCase();
        return `${primeiroNome} ${inicialSobrenome}.`;
    }
    return partes[0];
}

// Função inteligente que confere e desentorta a ordem de Cidade e Estado
function formatarCidadeEstado(entrada) {
    // 100% dos Estados Brasileiros revisados e mapeados
    const estadosDicionario = {
        'acre': 'AC', 'alagoas': 'AL', 'amapa': 'AP', 'amapá': 'AP', 'amazonas': 'AM', 'bahia': 'BA',
        'ceara': 'CE', 'ceará': 'CE', 'distrito federal': 'DF', 'espirito santo': 'ES', 'espírito santo': 'ES',
        'goias': 'GO', 'goiás': 'GO', 'maranhao': 'MA', 'maranhão': 'MA', 'mato grosso': 'MT',
        'mato grosso do sul': 'MS', 'minas gerais': 'MG', 'para': 'PA', 'pará': 'PA', 'paraiba': 'PB',
        'paraíba': 'PB', 'parana': 'PR', 'paraná': 'PR', 'pernambuco': 'PE', 'piaui': 'PI', 'piauí': 'PI',
        'rio de janeiro': 'RJ', 'rio grande do norte': 'RN', 'rio grande do sul': 'RS', 'rondonia': 'RO',
        'rondônia': 'RO', 'roraima': 'RR', 'santa catarina': 'SC', 'sao paulo': 'SP', 'são paulo': 'SP',
        'sergipe': 'SE', 'tocantins': 'TO'
    };

    // Remove espaços extras nas pontas
    let textoOriginal = entrada.trim();
    let textoMinusculo = textoOriginal.toLowerCase();

    // 1️⃣ CASO SEJA INVERTIDO: O usuário digitou o Nome do Estado COMPLETO primeiro (Ex: Maranhão Santa Inês)
    for (let estadoNome in estadosDicionario) {
        if (textoMinusculo.startsWith(estadoNome)) {
            let cidade = textoOriginal.substring(estadoNome.length).trim();
            // Limpa traços, vírgulas ou barras que sobem no começo da cidade
            cidade = cidade.replace(/^[\s,\-\/]+/, '');
            if (cidade) {
                return `${cidade} - ${estadosDicionario[estadoNome]}`;
            }
        }
    }

    // 2️⃣ CASO SEJA INVERTIDO POR SIGLA: O usuário digitou a SIGLA primeiro (Ex: MA Santa Inês ou MA - Santa Inês)
    let palavras = textoOriginal.split(/\s+/);
    if (palavras.length > 1) {
        let primeiraPalavraLimpa = palavras[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
        // Verifica se a primeira palavra isolada bate com alguma sigla real
        if (Object.values(estadosDicionario).includes(primeiraPalavraLimpa) && primeiraPalavraLimpa.length === 2) {
            let cidade = textoOriginal.substring(palavras[0].length).trim();
            cidade = cidade.replace(/^[\s,\-\/]+/, '');
            if (cidade) {
                return `${cidade} - ${primeiraPalavraLimpa}`;
            }
        }
    }

    // 3️⃣ CASO PADRÃO: O usuário digitou normal com separador (Ex: Santa Inês - Maranhão ou Santa Inês / MA)
    let partes = textoOriginal.split(/[-,\/]/);
    if (partes.length > 1) {
        let cidade = partes[0].trim();
        let estadoStr = partes[1].trim().toLowerCase();
        if (estadosDicionario[estadoStr]) return `${cidade} - ${estadosDicionario[estadoStr]}`;
        
        let siglaLimpa = partes[1].trim().toUpperCase().replace(/[^A-Z]/g, '');
        if (siglaLimpa.length === 2) return `${cidade} - ${siglaLimpa}`;
        return `${cidade} - ${partes[1].trim()}`;
    }

    // 4️⃣ CASO PADRÃO COMPLETO DIRETO: O usuário digitou a cidade e o estado no fim sem pontuar (Ex: Santa Inês Maranhão)
    for (let estadoNome in estadosDicionario) {
        if (textoMinusculo.endsWith(estadoNome)) {
            let indiceCortar = textoMinusculo.lastIndexOf(estadoNome);
            let cidade = textoOriginal.substring(0, indiceCortar).trim().replace(/[\s,\-]+$/, '');
            if (cidade) {
                return `${cidade} - ${estadosDicionario[estadoNome]}`;
            }
        }
    }

    // Se o script não reconhecer nenhum padrão bizarro, ele apenas limpa os cantos e envia
    return textoOriginal;
}

if (formDepoimento) {
    formDepoimento.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const campoNome = document.getElementById('nome-usuario').value;
        const campoCidade = document.getElementById('cidade-usuario').value;
        const texto = document.getElementById('texto-usuario').value;
        
        const nomeTratado = formatarNomeOculto(campoNome);
        const localizacaoTratada = formatarCidadeEstado(campoCidade);
        
        if (textoBtn) textoBtn.style.display = 'none';
        if (loaderBtn) loaderBtn.style.display = 'block';
        btnEnviar.disabled = true;
        
        setTimeout(() => {
            if (msgSucesso) msgSucesso.style.display = 'flex';
            
            let estrelasTextoWhats = '';
            for (let i = 0; i < notaSelecionada; i++) {
                estrelasTextoWhats += '⭐';
            }
            
            const quebraLinha = '%0A';
            const numeroWhats = '5598987261116';
            const mensagemWhats = `✨ *NOVO FEEDBACK DE CLIENTE* ✨${quebraLinha}${quebraLinha}` +
                                  `👤 *Nome:* ${nomeTratado}${quebraLinha}` +
                                  `📍 *Localização:* ${localizacaoTratada}${quebraLinha}` +
                                  `⭐ *Avaliação:* ${estrelasTextoWhats} (${notaSelecionada}/5)${quebraLinha}${quebraLinha}` +
                                  `💬 *Comentário:*${quebraLinha}"${texto}"`;
            
            window.open(`https://wa.me/${numeroWhats}?text=${mensagemWhats}`, '_blank');

            setTimeout(() => {
                if (msgSucesso) msgSucesso.style.display = 'none';
                if (textoBtn) textoBtn.style.display = 'block';
                if (loaderBtn) loaderBtn.style.display = 'none';
                btnEnviar.disabled = false;
                
                formDepoimento.reset();
                notaSelecionada = 5;
                atualizarEstrelas(5);
            }, 2500);

        }, 2500);
    });
}

/* ---- 🌊 SISTEMA PREMIUM DE ROLAGEM AMORTECIDA (LENIS) ---- */
// Inicializa o controle de rolagem suave
const lenis = new Lenis({
  duration: 1.2,     // Tempo que dura o deslize (quanto maior, mais suave e longo)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de frenagem suave
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWaveform: true,
  syncTouch: true // Garante o efeito elástico e amortecido também na tela do celular
});

// Mantém a rolagem rodando junto com as animações do navegador
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);