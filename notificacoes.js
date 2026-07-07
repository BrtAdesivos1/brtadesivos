/* ─── PAINEL DE CONTROLE DE NOTIFICAÇÕES DA HOME ─── */

// ⚠️ REGRA OPERACIONAL: Sempre que mudar o aviso, mude o número da versão abaixo! (Ex: 'v1', 'v2', 'v3'...)
const VERSAO_NOTIFICACAO = 'v6'; 

// 📝 DIGITE AQUI A SUA NOVA MENSAGEM:
const MENSAGEM_PRODUTO = "⚠️ Em breve: os valores dos adesivos e do frete serão atualizados."

document.addEventListener("DOMContentLoaded", () => {
    const toast = document.getElementById("notificacao-flutuante");
    const textoContainer = document.getElementById("texto-notificacao");
    
    if (!toast || !textoContainer) return;

    // Confere se o cliente já viu ESSA versão da notificação neste celular
    const jaViuNotificacao = localStorage.getItem(`notificacao_vista_${VERSAO_NOTIFICACAO}`);

    if (!jaViuNotificacao) {
        // Alimenta o texto do HTML com a mensagem que você digitou acima
        textoContainer.innerText = MENSAGEM_PRODUTO;

        // Aguarda 1 segundo após a página carregar para mandar o alerta descer suavemente
        setTimeout(() => {
            toast.classList.add("mostrar");
            
            // Grava na memória do navegador que esta versão específica já foi vista
            localStorage.setItem(`notificacao_vista_${VERSAO_NOTIFICACAO}`, 'true');
        }, 1000);

        // Conta 5 segundos (tempo perfeito para leitura no celular) e faz ela subir e sumir
        setTimeout(() => {
            toast.classList.remove("mostrar");
        }, 9000); // 1s de espera + 7s de exibição
    }
});
