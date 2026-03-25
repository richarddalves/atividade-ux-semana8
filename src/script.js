function piscar(estrela) {
  estrela
    .transition()
    .duration(1500)
    .attr("opacity", 0.2)
    .on("end", function () {
      d3.select(this)
        .transition()
        .duration(1500)
        .attr("opacity", 1)
        .on("end", function () {
          piscar(d3.select(this));
        });
    });
}
