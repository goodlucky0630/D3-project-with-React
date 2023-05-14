import React, { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./index.css";
const CashFlowPlot = ({
  title = "Income & Cash Flow",
  data,
  year,
  annual,
  onChangeAnnual,
  decimalSymbol = "B",
  currency = "$",
  yTicks = 6,
}) => {
  const svgRef = useRef();

  const renderSVG = useCallback(() => {
    const dims = {
      width: 319,
      height: 138,
      description: {
        height: 59,
        margin: {
          top: 3,
          bottom: 6,
        },
      },
      margin: {
        top: 5, // todo - adjust to match figma
        left: 57,
        right: 16, // [ ] todo - double check
        bottom: 28, // enough space for bottom desc
      },
      nudge: {
        xAxisLabelY: -2,
        yAxisLabelY: 1,
        xScaleLeft: -6,
      },
      controls: {
        xOffset: 110,
      },
    };
    dims.innerWidth = dims.width - dims.margin.left - dims.margin.right;
    dims.innerHeight = dims.height - dims.margin.top - dims.margin.bottom;

    const fillTypes = Object.keys(data[0]).slice(1); // [Income, Expenses, Cash Flow]
    const facetGroups = d3.map(data, (d) => d.group); // [2023, 2022, 2021, 2020] OR [Q1, Q2, Q3, Q4]

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
      .range([dims.nudge.xScaleLeft, dims.innerWidth])
      .padding([0.18]);

    base
      .append("g")
      .attr("id", "cashflow-x-axis")
      .attr("transform", `translate(0,${dims.innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((g) => {
        g.selectAll("path.domain").remove();
        g.selectAll(".tick text")
          .attr("transform", `translate(0, ${dims.nudge.xAxisLabelY})`)
          .attr("font-size", 15)
          .attr("font-family", "Arial")
          .call((t) => {
            t.each(function (d) {
              // for each one
              const self = d3.select(this);
              const groupId = self.text();

              self.text(""); // clear it out

              if (annual) {
                self
                  .append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy", "16px")
                  .text("FY");
              }

              self
                .append("tspan") // insert two tspans
                .attr("x", 0)
                .attr("dy", "16px")
                .text(groupId);

              if (!annual) {
                self
                  .append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy", "16px")
                  .text(year);
              }
            });
          });
      });

    // Add Y axis
    let minY, maxY;
    const maxArr = [];
    const minArr = [];
    for (const subg of fillTypes) {
      const max = d3.max(data, (d) => Number(d[subg]));
      maxArr.push(max);

      const min = d3.min(data, (d) => Number(d[subg]));
      minArr.push(min);
    }

    let _maxY = d3.max(maxArr);
    let minY0 = d3.min(minArr);

    const period = (_maxY - minY0) / yTicks;
    _maxY += period;
    let _minY;
    if (Math.floor(minY0) % 2 === 0) {
      _minY = Math.floor(minY0);
    } else {
      _minY = Math.floor(minY0) - 1;
    }

    minY = _minY;
    maxY = _maxY;

    if (minY > 0) {
      minY = 0;
    }

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([dims.innerHeight, 0]);

    const ruler = base.append("g").attr("id", "ruler");

    base
      .append("g")
      .attr("id", "cashflow-y-axis")
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
          .attr("transform", `translate(0, ${dims.nudge.yAxisLabelY})`)
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .call((t) => {
            t.each(function (d) {
              const self = d3.select(this);
              const dig = Number(d);
              const sign = dig < 0 ? "-" : "";
              const str =
                sign + currency + d3.format("d")(Math.abs(dig)) + decimalSymbol;
              if (dig === 0) {
                self.text("0");
              } else {
                self.text(str);
              }
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

    const fillScale = d3
      .scaleBand()
      .domain(fillTypes)
      .range([0, xScale.bandwidth()]);

    const colorArr = ["#7656D0", "#2E9EDD", "#92C2DD"];
    // color palette = one color per subgroup

    const color = d3.scaleOrdinal().domain(fillTypes).range(colorArr);

    // Show the bars
    base
      .append("g")
      .attr("id", "cashflow-bars")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${xScale(d.group)}, 0)`)
      .selectAll("rect")
      .data((d) => fillTypes.map((key) => ({ key, value: d[key] })))
      .enter()
      .append("rect")
      .attr("x", (d) => fillScale(d.key))
      .attr("y", (d) => (d.value >= 0 ? yScale(d.value) : yScale(0)))
      .attr("width", fillScale.bandwidth())
      .attr("height", function (d) {
        if (d.value >= 0) {
          return (
            dims.innerHeight - yScale(d.value) - (yScale(minY) - yScale(0))
          );
        } else {
          return yScale(d.value) - yScale(0);
        }
      })
      .attr("fill", (d) => color(d.key));

    // add group for description and controls
    const footer = base
      .append("g")
      .attr("id", "cashflow-footer")
      .attr(
        "transform",
        `translate(
          ${-dims.margin.left / 2 + 4},
          ${
            dims.innerHeight + dims.margin.bottom + dims.description.margin.top
          })`
      ); // todo - find nicer way of including description margin top

    // Add description
    footer.append("g").call((g) => {
      for (let i = 0; i < fillTypes.length; i++) {
        const desc1 = g
          .append("g")
          .attr("transform", `translate(20,${i * 21})`);
        desc1
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", colorArr[i])
          .attr("y", 18);

        desc1
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 30)
          .text(fillTypes[i]);
      }
    });

    footer
      .append("g")
      .attr(
        "transform",
        `translate(0, ${
          dims.description.height + dims.description.margin.bottom
        })`
      )
      .call((g) => {
        const desc1 = g
          .append("g")
          .attr("transform", `translate(20,0)`)
          .attr("class", "control_svg")
          .on("click", () => onChangeAnnual(true));

        desc1
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 30)
          .text("Annual");

        const desc2 = g
          .append("g")
          .attr("transform", `translate(${dims.controls.xOffset},0)`)
          .attr("class", "control_svg")
          .on("click", () => onChangeAnnual(false));

        desc2
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 30)
          .text("Quarterly");

        if (!annual) {
          desc1
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 25)
            .attr("r", 5)
            .attr("stroke-width", 3)
            .attr("stroke", "#D9D9D9")
            .attr("fill", "#d9d9d9");
          desc2
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 25)
            .attr("r", 5)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3);
        } else {
          desc1
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 25)
            .attr("r", 5)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3);
          desc2
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 25)
            .attr("r", 5)
            .attr("stroke-width", 3)
            .attr("stroke", "#D9D9D9")
            .attr("fill", "#d9d9d9");
        }
      });
  }, [annual, currency, data, decimalSymbol, onChangeAnnual, yTicks, year]);

  useEffect(() => {
    if (data) {
      renderSVG();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <svg ref={svgRef} />;
};

export default CashFlowPlot;
