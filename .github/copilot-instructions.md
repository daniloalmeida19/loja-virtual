<!-- Copilot instructions for loja-virtual - concise, actionable guidance -->
# Copilot / AI Agent Instructions

Este repositório é uma loja virtual estática simples construída com HTML, CSS e JavaScript cliente. O objetivo destas instruções é ajudar agentes AI a ser imediatamente produtivos neste código base.

Principais pontos
- O projeto é puramente front-end estático — não há backend, bundlers ou tarefas de build.
- O comportamento do carrinho é gerido por `localStorage` via `carrinho.js`.
- Páginas principais: `index.html`, `carrinho.html`, `roupas.html`, `sapatos.html`, `contato.html`.
- Estilos globais estão em `estilo.css` e imagens locais em `roupas/`.

Arquitetura e fluxo de dados (rápido)
- Ao clicar em um botão “Adicionar ao Carrinho” (classe `.add-to-cart-btn`) o script `carrinho.js` extrai atributos `data-*` do elemento pai `.produto` e atualiza o `localStorage` na chave `carrinho`.
- O contador do cabeçalho (`#contador-carrinho`) é atualizado por `atualizarIconeCarrinho()` em `carrinho.js`.
- A página `carrinho.html` tem `id="pagina-carrinho"`; quando presente, `exibirCarrinho()` renderiza `#itens-carrinho` e `#total-carrinho` a partir do `localStorage`.

Padrões e convenções do projeto
- Produtos usam atributos `data-id`, `data-nome` e `data-preco` no nó `article.produto` — preserve esses nomes ao gerar novos produtos.
- Evite mudar os IDs/nomes dos elementos usados pelo JavaScript (`#contador-carrinho`, `#itens-carrinho`, `#total-carrinho`, `pagina-carrinho`).
- Imagens locais ficam em `roupas/` (nomes com espaços); mantenha referências relativas como `roupas/vestido-de-verao.jpg`.

Tarefas comuns e exemplos rápidos
- Para adicionar um novo produto em `index.html` ou `roupas.html` copie um `article.produto` e inclua `data-id`, `data-nome` e `data-preco`. Exemplo mínimo:

```html
<article class="produto" data-id="07" data-nome="Nova Peça" data-preco="89.90">
  <img src="roupas/nova-peca.jpg" alt="Nova Peça">
  <h3>Nova Peça</h3>
  <p class="preco">R$ 89,90</p>
  <button class="add-to-cart-btn">Adicionar ao Carrinho</button>
</article>
```

- Para depurar o contador do carrinho, abra o console do navegador e leia `localStorage.getItem('carrinho')`.

Limitações e coisas a não fazer
- Não há rotas dinâmicas nem servidor — não tente implementar chamadas fetch para endpoints inexistentes.
- Não remova `localStorage` sem atualizar `carrinho.js` — mudanças de armazenamento devem ser acompanhadas de migração no script.

Arquivos-chave para referência
- `carrinho.js` — lógica do carrinho, atualização do contador e renderização do carrinho.
- `index.html`, `carrinho.html`, `roupas.html`, `sapatos.html` — padrões de markup e exemplos de produtos.
- `estilo.css` — estilos compartilhados.

Comportamento esperado nas mudanças
- Ao alterar nomes de atributos `data-*` ou ids usados no DOM, atualize `carrinho.js` de forma consistente.
- Ao adicionar novos assets em `roupas/`, prefira nomes sem caracteres especiais para portabilidade (ex: `nova-peca.jpg`).

Quando pedir revisão
- Peça revisão se a mudança alterar o armazenamento (`localStorage`), ids/seletores DOM principais, ou o formato dos itens do carrinho (`{id,nome,preco,imagem,quantidade}`).

Feedback
- Se algo importante do fluxo não estiver documentado aqui, peça ao mantenedor exemplos concretos de uso antes de implementar mudanças maiores.
