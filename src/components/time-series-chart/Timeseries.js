import React, { useEffect } from "react";
import * as d3 from "d3";

const getXAxis = (mode, xRange) => {
  const date0 = new Date();
  switch (mode) {
    case "1D":
      return d3
        .axisBottom(d3.scaleLinear([-0.5, 5.5], xRange))
        .tickValues([0, 1, 2, 3, 4, 5])
        .tickFormat(
          (d) => ["10:00", "11:00", "12:00", "1:00", "2:00", "3:00"][d]
        );
    case "5D":
      let days = Math.max((date0.getDay() + 6) % 7, 4);
      return d3
        .axisBottom(d3.scaleLinear([-0.3, 4.3], xRange))
        .tickValues([0, 1, 2, 3, 4])
        .tickFormat((d) => {
          return ["Mon", "Tues", "Wed", "Thus", "Fri"][(days + d) % 5];
        });
    case "1M":
      date0.setDate(date0.getDate() - date0.getDay() - 27);
      return (
        d3
          .axisBottom(d3.scaleLinear([0, 28], xRange))
          // .tickValues([0, 7, 14, 21, 28])
          .tickValues([0, 8, 14, 20, 28])
          .tickFormat((d) => {
            const date = new Date(date0);
            date.setDate(date.getDate() + d);
            return d3.timeFormat("%b %e")(date);
          })
      );
    case "3M":
      date0.setMonth(date0.getMonth() - 2);
      return d3
        .axisBottom(d3.scaleLinear([-0.25, 2.25], xRange))
        .tickValues([0, 1, 2])
        .tickFormat((d) => {
          const date = new Date(date0);
          date.setMonth(date.getMonth() + d);
          return d3.timeFormat("%b")(date);
        });
    case "6M":
      date0.setMonth(date0.getMonth() - 5);
      return d3
        .axisBottom(d3.scaleLinear([-0.25, 5.25], xRange))
        .tickValues([0, 1, 2, 3, 4, 5])
        .tickFormat((d) => {
          const date = new Date(date0);
          date.setMonth(date.getMonth() + d);
          return d3.timeFormat("%b")(date);
        });
    case "1Y":
      date0.setMonth(date0.getMonth() - 11);
      return d3
        .axisBottom(d3.scaleLinear([0, 11.5], xRange))
        .tickValues([1, 3, 5, 7, 9, 11])
        .tickFormat((d) => {
          const date = new Date(date0);
          date.setMonth(date.getMonth() + d);
          return d3.timeFormat("%b")(date);
        });
    default:
      date0.setFullYear(date0.getFullYear() - 4);
      return d3
        .axisBottom(d3.scaleLinear([-0.25, 4.25], xRange))
        .tickValues([0, 1, 2, 3, 4])
        .tickFormat((d) => {
          const date = new Date(date0);
          date.setFullYear(date.getFullYear() + d);
          return d3.timeFormat("%Y")(date);
        });
  }
};

const Chart = ({ data, mode }) => {
  const svgRef = React.useRef();

  useEffect(() => {
    const dims = {
      width: 319,
      height: 111,
      margin: {
        top: 0,
        right: 10,
        left: 10,
        bottom: 20,
      },
    };

    dims.innerWidth = dims.width - dims.margin.left - dims.margin.right;
    dims.innerHeight = dims.height - dims.margin.top - dims.margin.bottom;
    // const width = svgRef.current.clientWidth;
    // const height = 111;
    // const marginTop = 0;
    // const marginBottom = 20;

    const X = d3.map(data, (d) => new Date(d.date));
    const Y = d3.map(data, (d) => d.price);
    const I = d3.map(data, (_, i) => i);
    const defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // compute default domains.
    const xDomain = d3.extent(X);
    const yDomain = [0, d3.max(Y)];

    // construct scales and axes.
    const xRange = [0, dims.innerWidth]; //todo review
    const yRange = [dims.innerHeight, dims.margin.top]; //todo review
    const xScale = d3.scaleUtc(xDomain, xRange);
    const yScale = d3.scaleLinear(yDomain, yRange);

    const xAxis = (
      mode === "MAX" ? d3.axisBottom(xScale).ticks(6) : getXAxis(mode, xRange)
    ).tickSizeOuter(0);

    // construct a line generator.
    const line = d3
      .line()
      .defined((i) => D[i])
      .curve(d3.curveLinear)
      .x((i) => xScale(X[i]))
      .y((i) => yScale(Y[i]));

    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", [0, 0, dims.width, dims.height]);

    // x axis

    svg
      .append("g")
      .attr("id", "timeseries-x-axis")
      .attr("transform", `translate(0,${dims.innerHeight})`)
      .call(xAxis)
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => {
        if (mode === "1M") {
          const ticks = g.selectAll(".tick text").nodes();
          ticks[0].setAttribute("text-anchor", "start");
          ticks[ticks.length - 1].setAttribute("text-anchor", "end");
        }
      })
      .call((g) => {
        g.selectAll(".tick text")
          .attr("font-size", 14)
          .attr("font-family", "Arial")
          .attr("x", 0)
          .attr("y", 4);
        if (mode === "MAX") {
          g.selectAll(".tick text").attr('x', -12)
        }
      });

    // average line and value
    // const averageY = d3.sum(Y) / Y.length;
    const averageY = d3.max(Y) / 2;
    if (!isNaN(averageY)) {
      svg
        .append("line")
        .attr("stroke", "currentColor")
        .attr("stroke-dasharray", "2 2")
        .attr("x1", 0)
        .attr("y1", yScale(averageY))
        .attr("x2", dims.innerWidth) // todo - review
        .attr("y2", yScale(averageY));

      // svg
      //   .append("text")
      //   .attr("x", 0)
      //   .attr("y", yScale(averageY) + 15)
      //   .attr("fill", "currentColor")
      //   .attr("font-size", 14)
      //   .text(averageY.toFixed(2));
    }

    // graph line
    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("class", "stroke-[#00C25A]")
      .attr("d", line(I));
  }, [data, mode]);
  return <svg className="w-full" ref={svgRef} />;
};

export default Chart;
