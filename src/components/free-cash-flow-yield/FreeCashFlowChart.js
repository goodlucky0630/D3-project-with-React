import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const FreeCashFlowChart = ({
  title = "Cash Per Share",
  data,
  subGroupNames,
  year,
  max = 25,
  min = 0,
  yTicks = 6,
  decimalSymbol = "%",
}) => {
  const svgRef = useRef();

  const renderSVG = () => {
    const dims = {
      width: 311,
      height: 160.5,
      margin: {
        top: 9.5,
        right: 15,
        bottom: 52, // bottom = height-top-innerHeight
        // bottom: 128.5, // bottom = height-top-innerHeight
        left: 47, // left = width-right-innerWidth
      },
      nudge: {
        xScaleLeft: -13,
        xScaleRight: 6,
        xAxisLabelY: -2.5,
        footerX: -4,
        footerY: 10.5,
      },
    };
    dims.innerWidth = dims.width - dims.margin.left - dims.margin.right;
    dims.innerHeight = dims.height - dims.margin.top - dims.margin.bottom;

    // dims.innerHeight = 99;
    // dims.innerWidth = 250;

    // const width = svgRef.current.clientWidth;
    // const marginTop = 30;
    // const marginBottom = 60;
    // const marginLeft = 50;
    // const marginRight = 10;

    // const marginBottomForDesc = 40;

    // const innerWidth = width - marginLeft - marginRight;
    // const innerHeight = Math.floor(innerWidth * 0.4);
    // const height = innerHeight + marginBottom + marginTop + marginBottomForDesc;

    const facetGroups = d3.map(data, (d) => d.group);

    const percents = d3.map(data, (d) => ({
      group: d.group,
      value: d.percent,
    }));

    const ratios = d3.map(data, (d) => ({
      group: d.group,
      value: d.ratio,
    }));

    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", [0, 0, dims.width, dims.height]);

    const base = svg
      .append("g")
      .attr("transform", `translate(${dims.margin.left}, ${dims.margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(facetGroups)
      .range([dims.nudge.xScaleLeft, dims.innerWidth + dims.nudge.xScaleRight])
      .padding([0.4]);

    base
      .append("g")
      .attr("id", "free-cash-flow-yield-x-axis")
      .attr("transform", `translate(0,${dims.innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((g) => {
        g.selectAll("path.domain").remove();
        g.selectAll(".tick text")
          .attr("transform", `translate(0, ${dims.nudge.xAxisLabelY})`)
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .call((t) => {
            t.each(function (d) {
              // for each one
              const self = d3.select(this);
              const facetId = self.text();

              self.text(""); // clear it out

              self
                .append("tspan") // insert two tspans
                .attr("x", 0)
                .attr("dy", "16px")
                .text(facetId);

              self
                .append("tspan") // insert two tspans
                .attr("x", 0)
                .attr("dy", "16px")
                .text(year);

              let sub2Value = 0;
              for (const obj of ratios) {
                if (obj.group === facetId) {
                  sub2Value = `$${obj.value}`;
                  break;
                }
              }

              self
                .append("tspan") // insert two tspans
                .attr("x", 0)
                .attr("dy", "16px")
                .attr("fill", "#FC61FF")
                .text(sub2Value);
            });
          });
      });

    // Add Y axis
    const percentsMax = d3.max(percents, (d) => Number(d.value));
    const percentsMin = d3.min(percents, (d) => Number(d.value));
    // const period = (percentsMax - percentsMin) / yTicks;
    // console.log("PERIOD: ", period); // todo - needs tinkering
    if (percentsMax <= 0) {
      max = 0;
    } else {
      max = d3.max([percentsMax, max]);
    }
    // max = percentsMax + period;

    if (percentsMin >= 0) {
      min = 0;
    } else {
      min = 5 * Math.floor(percentsMin / 5);
    }

    const yScale = d3
      .scaleLinear()
      .domain([min, max])
      .range([dims.innerHeight, 0]);

    const ruler = base.append("g").attr("id", "ruler-lines");

    base
      .append("g")
      .attr("id", "free-cash-flow-yield-y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(yTicks)
          .tickFormat((d) => d3.format("d")(d))
      )
      .call((g) => {
        g.selectAll("path.domain").remove();
        g.selectAll(".tick line").remove();
        g.selectAll(".tick text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .call((t) => {
            t.each(function (d) {
              const self = d3.select(this);
              const dig = Number(d);
              const sign = dig < 0 ? "-" : "";
              const str = `${sign}${d3.format("d")(Math.abs(dig))}${
                dig === 0 ? "" : decimalSymbol
              }`;
              self.text(str);
            });
          });

        g.selectAll(".tick").call((t) => {
          t.each(function (d) {
            const self = d3.select(this);
            const str = self.attr("transform");
            const arr = str.split(/[(,)]+/);
            ruler
              .append("line")
              .attr("stroke", "#393939")
              .attr("stroke-width", "1")
              .attr("x1", 0)
              .attr("y1", arr[2])
              .attr("x2", dims.innerWidth)
              .attr("y2", arr[2]);
          });
        });
      });

    const colorArr = ["#2E9EDD", "#FC61FF"]; // color palette = one color per subgroup

    base
      .append("g")
      .attr("id", "bars")
      .selectAll("g")
      .data(percents)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.group))
      .attr("y", (d) => (d.value >= 0 ? yScale(d.value) : yScale(0)))
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        if (d.value >= 0) {
          return dims.innerHeight - yScale(d.value) - (yScale(min) - yScale(0));
        } else {
          return yScale(d.value) - yScale(0);
        }
      })
      .attr("fill", colorArr[0]);

    // Add description
    base
      .append("g")
      .attr("id", "footer")
      .attr(
        "transform",
        `translate(${dims.nudge.footerX}, ${
          dims.innerHeight + dims.margin.bottom + dims.nudge.footerY
        } )`
      )
      .call((g) => {
        for (let i = 0; i < subGroupNames.length; i++) {
          const desc1 = g
            .append("g")
            .attr("transform", `translate(0,${i * 21})`);
          desc1
            .append("rect")
            .attr("transform", `translate(0,1.5)`)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", colorArr[i]);

          desc1
            .append("text")
            .attr("font-size", 14)
            .attr("font-family", "Arial")
            .attr("fill", "currentColor")
            .attr("x", 20)
            .attr("y", 13)
            .text(subGroupNames[i]);
        }
      });
  };

  useEffect(() => {
    renderSVG();
  });

  return <svg ref={svgRef} />;
};

export default FreeCashFlowChart;
