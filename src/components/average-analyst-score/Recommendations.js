import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Recommendations = ({ data, max = 5 }) => {
  const svgRef = useRef();
  const colorOptions = ["#00C25A", "#007A39", "#636363", "#7A0021", "#C20033"];
  const getColor = (idx) => colorOptions[idx];

  max = d3.max(data, (d) => d.value);
  const renderSVG = () => {
    const dims = {
      width: 200,
      innerHeight: 100,
      margin: {
        top: 6,
        left: 98,
        right: 31,
        bottom: 6,
      },
      nudge: {
        xAxisLabelNudgeX: 5,
      }
    };

    dims.height = dims.innerHeight + dims.margin.top + dims.margin.bottom;
    dims.innerWidth = dims.width / 2 - dims.margin.right;

    // X scale
    const xDomain = [0, max];
    const xRange = [0, dims.innerWidth];
    const xScale = d3.scaleLinear(xDomain, xRange);

    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", [0, 0, dims.width, dims.height])
      .append("g")
      .attr("transform", `translate(${dims.margin.left}, ${dims.margin.top})`);

    // Add Y axis
    const yScale = d3
      .scaleBand()
      .range([0, dims.innerHeight])
      .domain(data.map(d => d.label));    // .padding(.1);

    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .attr("transform", `translate(${dims.nudge.xAxisLabelNudgeX},0)`)
      .call((g) => {
        g.select("path.domain").remove();
        g.selectAll(".tick line").remove();
        g.selectAll(".tick text")
          .attr("font-size", 15)
          .attr("font-family", "Arial");
      });

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("g")
      .call((g) => {
        g.append("rect")
          .attr("x", xScale(0))
          .attr("y", (d) => yScale(d.label))
          .attr("width", (d) => xScale(d.value))
          .attr("height", yScale.bandwidth())
          .attr("fill", (d, i) => getColor(i));

        g.append("text")
          .attr("x", (d) => xScale(d.value) + 3)
          .attr("y", (d) => yScale(d.label) + yScale.bandwidth() / 2)
          .attr("text-anchor", "start") // Align text centered horizontaly
          .attr("dominant-baseline", "central")
          .attr("font-size", 17)
          .attr("font-family", "Arial")
          .attr("fill", (d, i) => getColor(i))
          .text((d) => d.value);
      });
  };

  useEffect(() => {
    renderSVG();
  });

  return <svg ref={svgRef} />;
};

export default Recommendations;
