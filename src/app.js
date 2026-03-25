const body = d3.select("body");

const avisoJavascript = d3.select("#aviso-javascript").style("display", "none");

// Estrelas no fundo da página
const background = body
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .style("position", "fixed")
  .style("top", 0)
  .style("left", 0)
  .style("z-index", -1);

for (let i = 0; i < 200; i++) {
  const estrela = background
    .append("circle")
    .attr("cx", Math.random() * window.innerWidth)
    .attr("cy", Math.random() * window.innerHeight)
    .attr("r", Math.random() * 1.5 + 0.5) // raio entre 0.5 e 2
    .attr("fill", "white");

  if (Math.random() < 0.6) {
    estrela.attr("class", "brilhante");
  }
}

d3.selectAll(".brilhante")
    .each(function() {
        piscar(d3.select(this));
    })

// Bandeira

body
  .style("background-color", "#001a33")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .style("height", "100vh")
  .style("margin", "0");

const svg = body.append("svg").attr("width", 600).attr("height", 400);

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
