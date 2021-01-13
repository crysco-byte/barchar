import * as d3 from "d3";
import "./App.css";

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    render(res);
  });

const render = (data) => {
  let tooltip = d3
    .select("body")
    .append("div")
    .style("opacity", 0)
    .attr("id", "tooltip")
    .attr("data-date", "null")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");
  const mouseOver = () => tooltip.style("opacity", 1);

  const mouseMove = (d) => {
    const date = d.srcElement["__data__"][0];
    const value = d.srcElement["__data__"][1];
    tooltip
      .html(
        `
    date: ${date}\n
    value: ${value}\n
    `
      )
      .style("position", "absolute")
      .style("left", d3.pointer(d)[0] + "px")
      .style("top", d3.pointer(d)[1] + "px")
      .attr("data-date", date);
  };

  const mouseLeave = () => tooltip.style("opacity", 0);

  const margin = 90,
    width = 900,
    height = 900;

  const svg = d3
    .select("body")
    .append("svg")
    .attr("viewBox", [0, 0, 1500, 1200]);

  const values = data.data.map((d) => d[1]);
  const years = data.data.map((d) => {
    let date = new Date(0);
    date.setFullYear(d[0].slice(0, 4));
    return date.getFullYear();
  });

  const xScale = d3
    .scaleTime()
    .domain([d3.min(years), d3.max(years)])
    .range([margin, width - margin]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(values)])
    .range([height - margin, margin]);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0).tickFormat(d3.format("d")));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(yScale));
  console.log(data.data[0][1]);

  svg
    .append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(d[0].slice(0, 4)))
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => yScale(0) - yScale(d[1]))
    .attr("width", 9)
    .on("mousemove", (d) => mouseMove(d))
    .on("mouseleave", mouseLeave)
    .on("mouseover", mouseOver);
};
function App() {
  return (
    <div className="App">
      <h1 id="title">US GDP</h1>
      <h2>United States GDP 1947-1015</h2>
    </div>
  );
}

export default App;
