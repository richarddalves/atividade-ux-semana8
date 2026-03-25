const body = d3.select("body");

const avisoJavascript = d3.select("#aviso-javascript").style("display", "none");

const dadosEstrelas = d3.range(200).map(() => ({
  cx: Math.random() * window.innerWidth,
  cy: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.5,
  brilhante: Math.random() < 0.6,
}));

const background = body
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .style("position", "fixed")
  .style("top", 0)
  .style("left", 0)
  .style("z-index", -1);

const PW = window.innerWidth;
const PH = window.innerHeight;

const padraoEstrelas = background
  .append("defs")
  .append("pattern")
  .attr("id", "estrelas-pattern")
  .attr("width", PW)
  .attr("height", PH)
  .attr("patternUnits", "userSpaceOnUse");

padraoEstrelas
  .selectAll("circle")
  .data(dadosEstrelas)
  .enter()
  .append("circle")
  .attr("class", (d) => (d.brilhante ? "estrela brilhante" : "estrela"))
  .attr("cx", (d) => d.cx)
  .attr("cy", (d) => d.cy)
  .attr("r", (d) => d.r)
  .attr("fill", "white");

background
  .append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "url(#estrelas-pattern)");

padraoEstrelas.selectAll(".brilhante").each(function () {
  piscar(d3.select(this));
});

const zoom = d3
  .zoom()
  .scaleExtent([0.5, 8])
  .filter((event) => event.type === "wheel")
  .on("zoom", (event) => {
    padraoEstrelas.attr("patternTransform", event.transform);
  });

d3.select("body").call(zoom);

body
  .style("background-color", "#001a33")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("height", "100vh")
  .style("margin", "0");

const svg = body
  .append("svg")
  .attr("width", 600)
  .attr("height", 400)
  .style("cursor", "grab");

const defs = svg.append("defs");
const palco = svg.append("g");
const bandeira = palco.append("g");

let offsetX = 0;
let offsetY = 0;
let balancoX = 0;
let balancoY = 0;
let selecaoAtual = null;

function atualizarPosicaoBandeira() {
  palco.attr("transform", `translate(${offsetX}, ${offsetY})`);
}

function aplicarBalancoSelecao() {
  if (!selecaoAtual) return;

  selecaoAtual.conteudo.attr(
    "transform",
    `translate(${balancoX}, ${balancoY})`,
  );
}

function restaurarBalanco() {
  if (!selecaoAtual) return;

  balancoX = 0;
  balancoY = 0;
  selecaoAtual.conteudo
    .interrupt()
    .transition()
    .duration(500)
    .ease(d3.easeElasticOut.amplitude(1).period(0.35))
    .attr("transform", "translate(0, 0)");
}

function atualizarDestaque() {
  pecas.forEach((peca) => {
    const ativa = selecaoAtual && selecaoAtual.nome === peca.nome;

    peca.forma
      .interrupt()
      .transition()
      .duration(180)
      .attr("stroke", ativa ? "#ffffff" : "none")
      .attr("stroke-width", ativa ? 4 : 0)
      .attr("filter", ativa ? "brightness(1.1)" : null);
  });
}

function selecionarPeca(peca) {
  if (selecaoAtual && selecaoAtual.nome !== peca.nome) {
    selecaoAtual.conteudo.interrupt().attr("transform", "translate(0, 0)");
  }

  selecaoAtual = peca;
  balancoX = 0;
  balancoY = 0;
  atualizarDestaque();
}

const verde = bandeira.append("g").attr("data-parte", "verde");
const verdeForma = verde
  .append("rect")
  .attr("width", 600)
  .attr("height", 400)
  .attr("fill", "#009C3B");
const verdeConteudo = verde.append("g");

defs
  .append("clipPath")
  .attr("id", "clip-verde")
  .append("rect")
  .attr("width", 600)
  .attr("height", 400);

verdeConteudo.attr("clip-path", "url(#clip-verde)");

const amarelo = verdeConteudo.append("g").attr("data-parte", "amarelo");
const amareloForma = amarelo
  .append("polygon")
  .attr("points", "300,50 550,200 300,350 50,200")
  .attr("fill", "#FFDF00");
const amareloConteudo = amarelo.append("g");

defs
  .append("clipPath")
  .attr("id", "clip-amarelo")
  .append("polygon")
  .attr("points", "300,50 550,200 300,350 50,200");

amareloConteudo.attr("clip-path", "url(#clip-amarelo)");

const azul = amareloConteudo.append("g").attr("data-parte", "azul");
const azulForma = azul
  .append("circle")
  .attr("cx", 300)
  .attr("cy", 200)
  .attr("r", 100)
  .attr("fill", "#002776");
const azulConteudo = azul.append("g");

defs
  .append("clipPath")
  .attr("id", "clip-azul")
  .append("circle")
  .attr("cx", 300)
  .attr("cy", 200)
  .attr("r", 100);

azulConteudo.attr("clip-path", "url(#clip-azul)");

const faixa = azulConteudo.append("g").attr("data-parte", "faixa");
const faixaForma = faixa
  .append("rect")
  .attr("x", 200)
  .attr("y", 187)
  .attr("width", 200)
  .attr("height", 25)
  .attr("fill", "white");
const faixaConteudo = faixa.append("g");

defs
  .append("clipPath")
  .attr("id", "clip-faixa")
  .append("rect")
  .attr("x", 200)
  .attr("y", 187)
  .attr("width", 200)
  .attr("height", 25);

faixaConteudo.attr("clip-path", "url(#clip-faixa)");

faixaConteudo
  .append("text")
  .attr("x", 300)
  .attr("y", 200)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("font-size", "14px")
  .attr("fill", "black")
  .text("Ordem e Progresso");

const pecas = [
  { nome: "verde", grupo: verde, forma: verdeForma, conteudo: verdeConteudo },
  {
    nome: "amarelo",
    grupo: amarelo,
    forma: amareloForma,
    conteudo: amareloConteudo,
  },
  { nome: "azul", grupo: azul, forma: azulForma, conteudo: azulConteudo },
  { nome: "faixa", grupo: faixa, forma: faixaForma, conteudo: faixaConteudo },
];

pecas.forEach((peca) => {
  peca.forma
    .style("cursor", "pointer")
    .on("click", function (event) {
      event.stopPropagation();
      selecionarPeca(peca);
    });
});

svg.on("click", (event) => {
  if (event.target === svg.node()) {
    selecaoAtual = null;
    atualizarDestaque();
  }
});

const RAIO_ATRACAO = 130;
const FORCA_ATRACAO = 60;

const qtree = d3
  .quadtree()
  .x((d) => d.cx)
  .y((d) => d.cy)
  .addAll(dadosEstrelas);

function atrairEstrelas(mx, my) {
  const proximas = new Set();

  qtree.visit((node, x1, y1, x2, y2) => {
    if (
      x1 > mx + RAIO_ATRACAO ||
      x2 < mx - RAIO_ATRACAO ||
      y1 > my + RAIO_ATRACAO ||
      y2 < my - RAIO_ATRACAO
    ) {
      return true;
    }

    if (!node.length) {
      const d = node.data;
      const dist = Math.hypot(d.cx - mx, d.cy - my);
      if (dist < RAIO_ATRACAO && dist > 0) proximas.add(d);
    }

    return false;
  });

  padraoEstrelas.selectAll("circle").each(function (d) {
    if (proximas.has(d)) {
      const dx = d.cx - mx;
      const dy = d.cy - my;
      const dist = Math.hypot(dx, dy);
      const fator = (1 - dist / RAIO_ATRACAO) * FORCA_ATRACAO;

      d3.select(this)
        .transition("atracao")
        .duration(250)
        .ease(d3.easeCubicOut)
        .attr("cx", d.cx - (dx / dist) * fator)
        .attr("cy", d.cy - (dy / dist) * fator);
    } else {
      d3.select(this)
        .transition("atracao")
        .duration(500)
        .ease(d3.easeCubicOut)
        .attr("cx", d.cx)
        .attr("cy", d.cy);
    }
  });
}

function restaurarEstrelas() {
  padraoEstrelas
    .selectAll("circle")
    .transition("atracao")
    .duration(700)
    .ease(d3.easeCubicOut)
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy);
}

body
  .on("mousemove", (event) => {
    if (svg.node().contains(event.target)) {
      restaurarEstrelas();
    } else {
      atrairEstrelas(event.clientX, event.clientY);
    }
  })
  .on("mouseleave", restaurarEstrelas);

svg.call(
  d3
    .drag()
    .on("start", function (event) {
      const alvo = event.sourceEvent.target;
      const arrastandoSelecao =
        selecaoAtual && selecaoAtual.grupo.node().contains(alvo);

      this.__arrastandoSelecao = arrastandoSelecao;
      svg.style("cursor", arrastandoSelecao ? "move" : "grabbing");

      if (arrastandoSelecao) {
        selecaoAtual.conteudo.interrupt();
      }
    })
    .on("drag", function (event) {
      if (this.__arrastandoSelecao && selecaoAtual) {
        balancoX = Math.max(-35, Math.min(35, balancoX + event.dx * 0.8));
        balancoY = Math.max(-20, Math.min(20, balancoY + event.dy * 0.45));
        aplicarBalancoSelecao();
        return;
      }

      offsetX += event.dx;
      offsetY += event.dy;
      atualizarPosicaoBandeira();
    })
    .on("end", function () {
      svg.style("cursor", "grab");

      if (this.__arrastandoSelecao) {
        restaurarBalanco();
      }

      this.__arrastandoSelecao = false;
    }),
);

atualizarPosicaoBandeira();
