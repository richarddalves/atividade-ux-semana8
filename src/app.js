const body = d3.select("body");

const avisoJavascript = d3.select("#aviso-javascript").style("display", "none");

// Dataset de estrelas
const dadosEstrelas = d3.range(200).map(() => ({
  cx: Math.random() * window.innerWidth,
  cy: Math.random() * window.innerHeight,
  r: Math.random() * 1.5 + 0.5, // raio entre 0.5 e 2
  brilhante: Math.random() < 0.6,
}));

// Estrelas no fundo da página
const background = body
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .style("position", "fixed")
  .style("top", 0)
  .style("left", 0)
  .style("z-index", -1);

// Pattern SVG - tile infinito: o zoom atualiza patternTransform em vez de escalar
// um grupo, então nunca aparecem bordas ou espaços vazios
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

// Rect que preenche o background com o pattern - cobre qualquer resolução
background
  .append("rect")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("fill", "url(#estrelas-pattern)");

// Animar estrelas brilhantes (piscar vem de script.js)
padraoEstrelas.selectAll(".brilhante").each(function () {
  piscar(d3.select(this));
});

// Zoom no fundo estrelado - só responde a scroll (wheel), sem conflito com o drag da bandeira
// patternTransform desloca/escala o tile, que repete infinitamente nas bordas
const zoom = d3
  .zoom()
  .scaleExtent([0.5, 8])
  .filter((event) => event.type === "wheel")
  .on("zoom", (event) => {
    padraoEstrelas.attr("patternTransform", event.transform);
  });

d3.select("body").call(zoom);

// Bandeira

body
  .style("background-color", "#001a33")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("height", "100vh")
  .style("margin", "0");

const svg = body.append("svg").attr("width", 600).attr("height", 400);

// Atração das estrelas ao mouse via quadtree
const RAIO_ATRACAO = 130;
const FORCA_ATRACAO = 60;

const qtree = d3
  .quadtree()
  .x((d) => d.cx)
  .y((d) => d.cy)
  .addAll(dadosEstrelas);

function atrairEstrelas(mx, my) {
  // Coletar quais estrelas estão dentro do raio usando o quadtree
  const proximas = new Set();
  qtree.visit((node, x1, y1, x2, y2) => {
    // Poda: bounding box não toca o círculo de atração → ignorar sub-árvore
    if (
      x1 > mx + RAIO_ATRACAO ||
      x2 < mx - RAIO_ATRACAO ||
      y1 > my + RAIO_ATRACAO ||
      y2 < my - RAIO_ATRACAO
    )
      return true;
    if (!node.length) {
      // nó folha
      const d = node.data;
      const dist = Math.hypot(d.cx - mx, d.cy - my);
      if (dist < RAIO_ATRACAO && dist > 0) proximas.add(d);
    }
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

// Ativa atração via body
//background tem z-index:-1 e não recebe eventos de mouse
body
  .on("mousemove", (event) => {
    // Se o mouse estiver sobre a bandeira (ou filhos dela), restaura
    if (svg.node().contains(event.target)) {
      restaurarEstrelas();
    } else {
      atrairEstrelas(event.clientX, event.clientY);
    }
  })
  .on("mouseleave", restaurarEstrelas);

// Drag na bandeira
let offsetX = 0,
  offsetY = 0;

svg.style("cursor", "grab").call(
  d3
    .drag()
    .on("start", function () {
      d3.select(this).style("cursor", "grabbing");
    })
    .on("drag", function (event) {
      offsetX += event.dx;
      offsetY += event.dy;
      d3.select(this).style(
        "transform",
        `translate(${offsetX}px, ${offsetY}px)`,
      );
    })
    .on("end", function () {
      d3.select(this).style("cursor", "grab");
    }),
);

svg
  .append("rect")
  .attr("width", 600)
  .attr("height", 400)
  .attr("fill", "#009C3B");

svg
  .append("polygon")
  .attr("points", "300,50 550,200 300,350 50,200")
  .attr("fill", "#FFDF00");

svg
  .append("circle")
  .attr("cx", 300)
  .attr("cy", 200)
  .attr("r", 100)
  .attr("fill", "#002776");

svg
  .append("rect")
  .attr("x", 200)
  .attr("y", 187)
  .attr("width", 200)
  .attr("height", 25)
  .attr("fill", "white");

// svg.append("text")
//     .attr("x", 250)
//     .attr("y", 203)
//     .attr("font-size", "14px")
//     .attr("fill", "black")
//     .text("Ordem e Progresso");

svg
  .append("text")
  .attr("x", 300)
  .attr("y", 200)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("font-size", "14px")
  .attr("fill", "black")
  .text("Ordem e Progresso");