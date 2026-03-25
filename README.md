# atividade-ux-d3

## Alunos

- Marco Ruas Sales Peixoto
- Richard Dias Alves

## Visão geral

Este projeto usa `D3.js` para desenhar e animar uma versão interativa da bandeira do Brasil em SVG. A aplicação também inclui um fundo estrelado com zoom, seleção de partes da bandeira e animações de transição.

## Recursos do D3.js usados no projeto

### `d3.select()` e `d3.selectAll()`

São usados para selecionar elementos do DOM e do SVG.

- `d3.select("body")` seleciona o `body` principal da página.
- `d3.select("#aviso-javascript")` oculta o aviso inicial.
- `selectAll("circle")` é usado para criar e atualizar as estrelas do fundo.

## `selection.append()`

É usado para criar elementos SVG dinamicamente.

- `append("svg")` cria os SVGs do fundo e da bandeira.
- `append("rect")`, `append("circle")`, `append("polygon")`, `append("text")` criam as formas da bandeira.
- `append("defs")` e `append("clipPath")` criam áreas de recorte para manter o conteúdo preso dentro de cada parte.

## `selection.attr()` e `selection.style()`

São usados para definir atributos SVG e estilos visuais.

- `attr("width")`, `attr("height")`, `attr("fill")`, `attr("cx")`, `attr("cy")`, `attr("points")`
- `style("background-color")`, `style("cursor")`, `style("position")`

Esses métodos controlam tamanho, posição, cor, cursor e comportamento visual dos elementos.

## `selection.data()`, `enter()` e `d3.range()`

Esses recursos são usados para gerar o conjunto de estrelas do fundo.

- `d3.range(200)` cria 200 posições base.
- `data(dadosEstrelas)` associa os dados aos círculos.
- `enter().append("circle")` cria um círculo para cada estrela.

Isso mostra o uso do D3 no padrão orientado a dados.

## `d3.zoom()`

O projeto usa `d3.zoom()` para aplicar zoom no fundo estrelado com o scroll do mouse.

- `scaleExtent([0.5, 8])` limita o nível de zoom.
- `filter((event) => event.type === "wheel")` faz o zoom responder apenas ao scroll.
- `.on("zoom", ...)` atualiza `patternTransform` do pattern SVG.

Na prática, isso permite ampliar e reduzir o fundo sem interferir no arraste da bandeira.

## `d3.drag()`

O `d3.drag()` é usado para capturar o gesto de arrastar.

- Quando o usuário arrasta uma área normal, a bandeira inteira muda de posição.
- Quando o usuário arrasta uma parte selecionada, apenas os elementos internos daquela parte se deslocam.

Os eventos usados são:

- `.on("start", ...)`
- `.on("drag", ...)`
- `.on("end", ...)`

## `selection.on()`

O método `.on()` é um dos principais recursos usados no projeto para eventos de interação.

Exemplos:

- `.on("click", ...)` para selecionar uma parte da bandeira.
- `.on("mousemove", ...)` para atrair as estrelas do fundo ao mouse.
- `.on("mouseleave", ...)` para restaurar as estrelas à posição original.
- `.on("zoom", ...)` dentro do `d3.zoom()`.
- `.on("start")`, `.on("drag")`, `.on("end")` dentro do `d3.drag()`.
- `.on("end", ...)` nas transições da função `piscar()`.

Ou seja, `on()` é o recurso que conecta o comportamento visual às ações do usuário e ao fim das animações.

## `transition()`, `duration()`, `ease()` e `interrupt()`

As animações do projeto usam transições nativas do D3.

- `transition()` inicia animações suaves.
- `duration()` controla o tempo da animação.
- `ease()` define a curva do movimento.
- `interrupt()` interrompe animações anteriores antes de iniciar novas.

Esses métodos aparecem em dois pontos principais:

- no brilho das estrelas do fundo;
- no retorno elástico do conteúdo interno da parte selecionada.

## `d3.easeElasticOut()` e `d3.easeCubicOut()`

Foram usadas funções de easing para deixar os movimentos mais naturais.

- `d3.easeElasticOut()` cria um retorno com efeito elástico.
- `d3.easeCubicOut()` suaviza o deslocamento das estrelas atraídas pelo mouse.

## `d3.quadtree()`

O fundo estrelado usa `d3.quadtree()` para encontrar rapidamente quais estrelas estão perto do cursor.

- `.x((d) => d.cx)` e `.y((d) => d.cy)` definem como localizar cada estrela.
- `.addAll(dadosEstrelas)` insere todas as estrelas na estrutura.
- `visit(...)` percorre apenas áreas relevantes da árvore.

Isso melhora a eficiência da interação com muitas estrelas na tela.

## Estrutura SVG com grupos aninhados

O projeto usa grupos SVG com `append("g")` para organizar a bandeira de forma hierárquica:

- verde
- amarelo dentro do verde
- azul dentro do amarelo
- faixa dentro do azul
- texto dentro da faixa

Essa estrutura permite que cada parte controle apenas o conteúdo interno dela.

## Função de animação contínua

No arquivo `src/script.js`, a função `piscar()` usa transições encadeadas com `.on("end", ...)` para repetir a animação de brilho das estrelas indefinidamente.
