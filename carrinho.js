// Espera o documento HTML ser completamente carregado para executar o script
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

    // Pega o carrinho atual do localStorage ou cria um array vazio
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se o item já existe no carrinho
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        // Se existe, apenas aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se não existe, adiciona o novo item
        carrinho.push({ id, nome, preco, imagem, quantidade: 1 });
    }

    // Salva o carrinho atualizado de volta no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    alert(`"${nome}" foi adicionado ao carrinho!`);
    atualizarIconeCarrinho();
}

/**
 * Atualiza o número no ícone do carrinho no cabeçalho.
 */
function atualizarIconeCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
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
                <p class="subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</p>
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
        localStorage.removeItem('carrinho');
        exibirCarrinho(); // Atualiza a exibição (que agora estará vazia)
        atualizarIconeCarrinho(); // Zera o contador no cabeçalho
    }
}