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

const grupoEstrelas = background.append("g");

grupoEstrelas
  .selectAll("circle")
  .data(dadosEstrelas)
  .enter()
  .append("circle")
  .attr("class", (d) => (d.brilhante ? "estrela brilhante" : "estrela"))
  .attr("cx", (d) => d.cx)
  .attr("cy", (d) => d.cy)
  .attr("r", (d) => d.r)
  .attr("fill", "white");

// Animar estrelas brilhantes (piscar vem de script.js)
grupoEstrelas.selectAll(".brilhante").each(function () {
  piscar(d3.select(this));
});

// Zoom no fundo estrelado — só responde a scroll (wheel), sem conflito com o drag da bandeira
const zoom = d3
  .zoom()
  .scaleExtent([0.5, 8])
  .filter((event) => event.type === "wheel")
  .on("zoom", (event) => {
    grupoEstrelas.attr("transform", event.transform);
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
