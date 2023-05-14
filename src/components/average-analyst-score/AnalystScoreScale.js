import React, { useEffect } from "react";
import * as d3 from "d3";
import scoreBoxPath from "./ScoreBoxPath";

const AnalystScoreScale = ({ value, min = 1, max = 3 }) => {
  const svgRef = React.useRef();

  const descOptions = [
    "Strong Buy",
    "Moderate Buy",
    "Hold",
    "Moderate Sell",
    "Strong Sell",
  ];

  const getXAxis = (xRange) => {
    const gaps = 4;
    const interval = (max - min) / gaps;
    const ticks = Array.from(Array(gaps + 1).keys());
    for (let i = 0; i < ticks.length; i++) {
      ticks[i] = min + ticks[i] * interval;
    }

    return d3
      .axisBottom(d3.scaleLinear([min, max], xRange))
      .tickValues(ticks)
      .tickFormat((d, idx) => `${d} ${descOptions[idx]}`);
  };

  const renderSVG = () => {
    const axisHeight = 4;
    const descHeight = 50;
    const firstLabelWidth = 47.25;
    const lastLabelWidth = 47.24;
    const dims = {
      width: 319,
      innerHeight: 42, // size of the score box
      scoreBox: {
        width: 18,
        height: 42,
      },
      margin: {
        top: 1,
        left: firstLabelWidth / 2 + 8.5,
        right: lastLabelWidth / 2 + 10,
        bottom: axisHeight + descHeight + 8.5,
      },
    };

    dims.height = dims.innerHeight + dims.margin.bottom + dims.margin.top;
    dims.innerWidth = dims.width - (dims.margin.left + dims.margin.right);

    const xDomain = [min, max];
    const xRange = [0, dims.innerWidth];
    const xScale = d3.scaleLinear(xDomain, xRange);

    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", [0, 0, dims.width, dims.height]);

    const base = svg
      .append("g")
      .attr("id", "base")
      .attr("transform", `translate(${dims.margin.left}, ${dims.margin.top})`);

    // Add axis
    const xAxis = getXAxis(xRange).tickSizeOuter(0);

    base
      .append("g")
      .attr("id", "analyst-score-chart")
      .attr("transform", `translate(0, ${dims.innerHeight})`)
      .attr("width", dims.innerWidth)
      .call(xAxis)
      .call((g) => {
        g.selectAll(".domain").attr("stroke-width", "1.5px");

        g.selectAll(".tick text")
          .attr("y", "4px")
          .call((t) => {
            t.each(function (d) {
              // for each one
              var self = d3.select(this);
              var arr = self.text().split(" "); // get the text and split it
              self.text(""); // clear it out
              for (const s of arr) {
                self
                  .append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy", "16px")
                  .text(s);
              }
            });
          });
      });

    // Add scroll
    const pos = xScale(value) - dims.scoreBox.width;
    var scoreBox = base
      .append("g")
      .attr("id", "scoreBox")
      .attr("transform", `translate(${pos}, 0)`)
      .attr("width", "36")
      .attr("height", "36");

    scoreBox
      .append("path")
      .attr("fill-rule", "evenodd")
      .attr("clip-rule", "evenodd")
      .attr("fill", "#5160E8")
      .attr("d", scoreBoxPath);

    scoreBox
      .append("text")
      .attr("x", "18") // horizontal center pos
      .attr("y", "20")
      .text(() => value);
  };

  useEffect(() => {
    renderSVG();
  });

  return <svg ref={svgRef} />;
};

export default AnalystScoreScale;
