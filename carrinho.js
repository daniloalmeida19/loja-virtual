// Espera o documento HTML ser completamente carregado para executar o script

const CHAVE_CARRINHO = 'carrinho';

document.addEventListener('DOMContentLoaded', () => {
    // Adiciona um 'ouvinte' de clique para todos os botões "Adicionar ao Carrinho"
    const botoesAdicionar = document.querySelectorAll('.add-to-cart-btn');
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', adicionarAoCarrinho);
    });

    // Se estivermos na página do carrinho, exibe os itens
    if (document.body.id === 'pagina-carrinho') {
        exibirCarrinho();
    }

    // Adiciona ouvintes de eventos para os botões dentro do carrinho
    const containerCarrinho = document.getElementById('itens-carrinho');
    if (containerCarrinho) {
        containerCarrinho.addEventListener('click', (evento) => {
            if (evento.target.classList.contains('btn-remover')) {
                const id = evento.target.dataset.id;
                removerItemDoCarrinho(id);
            }
        });
    }

    // Atualiza o contador do ícone do carrinho em todas as páginas
    atualizarIconeCarrinho();
});

/**
 * Função chamada quando o botão "Adicionar ao Carrinho" é clicado.
 */
function adicionarAoCarrinho(evento) {
    const botao = evento.target;
    const produto = botao.closest('.produto'); // Encontra o 'card' do produto pai

    // Pega as informações do produto a partir dos atributos 'data-*'
    const id = produto.dataset.id;
    const nome = produto.dataset.nome;
    const preco = parseFloat(produto.dataset.preco);
    const imagem = produto.querySelector('img').src;

    // Pega o carrinho atual
    let carrinho = getCarrinho();

    // Verifica se o item já existe no carrinho para não duplicar
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        // Se existe, apenas aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se não existe, adiciona o novo item
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }

    // Salva o carrinho atualizado de volta no localStorage
    salvarCarrinho(carrinho);

    alert(`"${nome}" foi adicionado ao carrinho!`);
    atualizarIconeCarrinho();
}

/**
 * Remove um item específico do carrinho.
 * @param {string} id - O ID do produto a ser removido.
 */
function removerItemDoCarrinho(id) {
    let carrinho = getCarrinho();
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho(carrinho);
    exibirCarrinho(); // Re-renderiza o carrinho
    atualizarIconeCarrinho(); // Atualiza o ícone
}

/**
 * Pega o carrinho do localStorage.
 * @returns {Array} O array de itens do carrinho.
 */
function getCarrinho() {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
}

/**
 * Salva o carrinho no localStorage.
 * @param {Array} carrinho - O array de itens do carrinho.
 */
function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

/**
 * Atualiza o número no ícone do carrinho no cabeçalho.
 */
function atualizarIconeCarrinho() {
    const carrinho = getCarrinho();
    // Soma a quantidade de todos os itens no carrinho
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

    const contadorCarrinho = document.getElementById('contador-carrinho');
    if (contadorCarrinho) {
        contadorCarrinho.textContent = totalItens;
        // Mostra o contador apenas se houver itens
        contadorCarrinho.style.display = totalItens > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Exibe os itens do carrinho na página carrinho.html.
 */
function exibirCarrinho() {
    const carrinho = getCarrinho();
    const containerCarrinho = document.getElementById('itens-carrinho');
    const totalCarrinhoEl = document.getElementById('total-carrinho');

    containerCarrinho.innerHTML = ''; // Limpa a lista antes de adicionar os itens
    let total = 0;

    if (carrinho.length === 0) {
        containerCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const itemCarrinho = document.createElement('div');
            itemCarrinho.className = 'item-carrinho';
            itemCarrinho.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="info">
                    <h4>${item.nome}</h4>
                    <p>Preço: R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
                <div class="acoes">
                    <p class="subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
                    <button class="btn-remover" data-id="${item.id}">Remover</button>
                </div>
            `;
            containerCarrinho.appendChild(itemCarrinho);
            total += item.preco * item.quantidade;
        });
    }

    totalCarrinhoEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/**
 * Limpa todos os itens do carrinho.
 */
function limparCarrinho() {
    if (confirm('Você tem certeza que deseja limpar o carrinho?')) {
        localStorage.removeItem(CHAVE_CARRINHO);
        exibirCarrinho(); // Atualiza a exibição (que agora estará vazia)
        atualizarIconeCarrinho(); // Zera o contador no cabeçalho
    }
}

/**
 * Gera uma mensagem com os itens do carrinho e redireciona para o WhatsApp.
 */
function finalizarCompraWhatsApp() {
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const numeroTelefone = "5511999999999"; // <-- COLOQUE SEU NÚMERO DE WHATSAPP AQUI (com código do país e DDD)

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `*Produto:* ${item.nome}\n`;
        mensagem += `*Quantidade:* ${item.quantidade}\n`;
        mensagem += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
        total += subtotal;
    });

    mensagem += `*Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*`;

    window.open(`https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
}