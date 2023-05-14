import React, { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./index.css";

const RevenueEarningPlot = ({
  year,
  data,
  annual,
  onChangeAnnual,
  yTicks = 7,
  currency = "$",
  abbrev = "B",
}) => {
  const svgRef = useRef();

  const renderSVG = useCallback(() => {
    // setup dimensions and margin info
    const svgWidth = 319;
    const peripheralWidth = 44;
    const controlsHeight = 20.5;
    const dims = {
      width: svgWidth,
      chartHeight: 152,
      margin: {
        top: -2.5, //top: -1.5,
        right: 22,
        bottom: 2 * controlsHeight, // bottom: 40,
        left: 20 + peripheralWidth, // calculated by taking peripheral width and adjusting until matching spec
      },
      nudge: {
        axisLeftY: 1,
        axisBottomY: -1,
        chartRangeX: -7,
        scaleRight: 6,
        barLeft: 2,
        quarterlyLabelLeft: -1.5,
        barPadding: 0.2,
        chartX: -3,
        descBottom: 20,
        controlsY: 5,
        footerLeft: -28.5,
      },
    };
    dims.chartWidth = dims.width - dims.margin.left - dims.margin.right;
    dims.height =
      dims.chartHeight -
      dims.margin.top +
      dims.margin.bottom +
      2 * dims.nudge.descBottom;

    // initialize y-axis variables
    let maxY = data.reduce(
      (acc, curr) => Math.max(acc, curr.Revenue, curr.Earnings),
      Number.MIN_VALUE
    );
    let minY = data.reduce(
      (acc, curr) => Math.min(acc, curr.Revenue, curr.Earnings),
      Number.MAX_VALUE
    );

    const period = (maxY - minY) / yTicks;
    minY = Math.floor(minY);
    maxY += period;

    if (minY % 2 !== 0) minY -= 1;
    if (minY > 0) minY = 0;

    const yScale = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([dims.chartHeight, 0]);

    const fillType = Object.keys(data[0]).slice(1); // ["Revenue", "Earning"]
    const facetGroup = d3.map(data, (d) => d.group); // ["Q1", "Q2", "Q3", "Q4"] or ["2019", "2020", "2021", "2022"]

    svgRef.current.innerHTML = "";

    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", `0 0 ${dims.width} ${dims.height}`);

    const base = svg
      .append("g")
      .attr("id", "base")
      .attr("transform", `translate(${dims.margin.left}, ${dims.margin.top})`);

    const chart = base
      .append("g")
      .attr("id", "chart")
      .attr("transform", `translate(${dims.nudge.chartX}, 0)`);

    base
      .append("g")
      .attr("id", "y-axis-peripheral")
      .attr("transform", `translate(0, ${dims.nudge.axisLeftY})`)
      .call(
        d3
          .axisLeft(yScale)
          .ticks(yTicks)
          .tickFormat((d) => d3.format("d")(d))
      )
      .call((g) => {
        g.selectAll("path.domain").remove(); // remove y axis line
        g.selectAll(".tick line").remove(); // remove y axis ticks

        // customize y axis ticks
        g.selectAll(".tick text")
          .attr("font-size", "14px")
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .call((t) => {
            t.each(function (d) {
              const self = d3.select(this);
              const digit = Number(d);
              const sign = digit < 0 ? "-" : "";
              const formattedStr = `${sign}${currency}${Math.abs(
                digit
              )}${abbrev}`;
              if (digit === 0) self.text(`0`);
              else self.text(formattedStr);
            });
          });

        // adjust x axis ticks, add bars that run lengthwise across the chart
        g.selectAll(".tick").call((t) => {
          const ledgerLines = chart.append("g").attr("id", "ledger-lines");

          t.each(function (d) {
            const self = d3.select(this);
            const str = self.attr("transform");
            const arr = str.split(/[(,)]+/);
            ledgerLines
              .append("line")
              .attr("stroke", "#393939")
              .attr("stroke-width", "1px")
              .attr("x1", 0)
              .attr("y1", arr[2])
              .attr("x2", dims.chartWidth)
              .attr("y2", arr[2]);
          });
        });
      });

    // add x axis
    const xScale = d3
      .scaleBand()
      .domain(facetGroup)
      .range([dims.nudge.chartRangeX, dims.chartWidth + dims.nudge.scaleRight])
      .padding([dims.nudge.barPadding]);

    chart
      .append("g")
      .attr("id", "x-axis-labels")
      .attr(
        "transform",
        `translate(0, ${dims.chartHeight + dims.nudge.axisBottomY})`
      )
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").remove();

        g.selectAll(".tick text")
          .attr("font-size", "14px")
          .attr("y", 0)
          .attr("font-family", "Arial")
          .call((t) => {
            t.each(function (d) {
              const self = d3.select(this);
              const groupId = self.text();

              self.text("");

              if (annual) {
                self
                  .append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy", "16px")
                  .text("FY");
              }
              
              self
                .append("tspan")
                .text(groupId)
                .attr("x", !annual ? dims.nudge.quarterlyLabelLeft : 0)
                .attr("dy", "16px");

              if (!annual) {
                self.append("tspan").text(year).attr("x", 0).attr("dy", "16px");
              }
            });
          });
      });

    // add scale for subgroup position
    const xSubScale = d3
      .scaleBand()
      .domain(fillType)
      .range([dims.nudge.barLeft, xScale.bandwidth()]);

    const color = d3
      .scaleOrdinal()
      .domain(fillType)
      .range(["#5160E8", "#963AA5"]);

    // add chart bars
    chart
      .append("g")
      .attr("id", "chart-bars")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${xScale(d.group)}, 0)`) // shift over by year/quarter
      .selectAll("rect")
      .data((d) => fillType.map((key) => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", (d) => xSubScale(d.key))
      .attr("y", (d) => (d.value >= 0 ? yScale(d.value) : yScale(0)))
      .attr("width", xSubScale.bandwidth())
      .attr("height", (d) => {
        if (d.value >= 0)
          return (
            dims.chartHeight - yScale(d.value) - (yScale(minY) - yScale(0))
          );
        return yScale(d.value) - yScale(0);
      })
      .attr("fill", (d) => color(d.key));

    const footer = base
      .append("g")
      .attr("id", "controls")
      .attr(
        "transform",
        `translate(${dims.nudge.footerLeft}, ${
          dims.chartHeight + dims.margin.bottom
        })`
      );

    footer
      .append("g")
      .attr("id", "fill-labels")
      .call((g) => {
        const desc1 = g.append("g").attr("transform", `translate(20,0)`);

        desc1
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "#5160E8");

        desc1
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 12)
          .text(fillType[0]);

        const desc2 = g.append("g").attr("transform", `translate(110,0)`);

        desc2
          .append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "#963AA5");

        desc2
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 12)
          .text(fillType[1]);
      });

    // Annual and quarterly radios
    footer
      .append("g")
      .attr("id", "mode-radio-controls")
      .attr(
        "transform",
        `translate(0, 21)` //${dims.nudge.descBottom + dims.nudge.controlsY} )`
      )
      .call((g) => {
        const desc1 = g
          .append("g")
          .attr("transform", `translate(20,0)`)
          .attr("class", "control_svg")
          .on("click", function () {
            onChangeAnnual(true);
          });
        const desc2 = g
          .append("g")
          .attr("transform", `translate(110,0)`)
          .attr("class", "control_svg")
          .on("click", function () {
            onChangeAnnual(false);
          });

        const circleRadius = 5;
        if (!annual) {
          desc1
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 7)
            .attr("r", circleRadius)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3)
            .attr("fill", "#d9d9d9");

          desc2
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 7)
            .attr("r", circleRadius)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3);
        } else {
          desc1
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 7)
            .attr("r", circleRadius)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3);

          desc2
            .append("circle")
            .attr("cx", 7)
            .attr("cy", 7)
            .attr("r", circleRadius)
            .attr("stroke", "#d9d9d9")
            .attr("stroke-width", 3)
            .attr("fill", "#d9d9d9");
        }

        desc1
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 12)
          .text("Annual");

        desc2
          .append("text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("fill", "currentColor")
          .attr("x", 20)
          .attr("y", 12)
          .text("Quarterly");
      });
  }, [abbrev, annual, currency, data, onChangeAnnual, yTicks, year]);

  useEffect(() => {
    if (data) {
      renderSVG();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <svg ref={svgRef} />;
};

export default RevenueEarningPlot;
