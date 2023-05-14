import React, { useEffect } from "react";
import * as d3 from "d3";
import * as numberShortener from "number-shortener";

const calcPercentage = (current, average) => {
  const percentValue = (current - average) * 100 / average;
  let percentColor = percentValue > 0 ? '#00C25A' : percentValue < 0 ? '#C20033' : '#464646';
  const percentText = percentValue > 0 ? `+${percentValue.toFixed(2)}%` : `${percentValue.toFixed(2)}%`;
  return {
    percentColor,
    percentText,
  }
};

const getShortenNumber = (value) => {
  const shortenValue = value >= 1000 ? numberShortener(Math.round(value)).toUpperCase() : value.toFixed(2);
  const hasPlus = shortenValue.slice(-1) === '+';
  return hasPlus ? shortenValue.slice(0, -1) : shortenValue;
}

const GrowthChart = ({ current, average }) => {
  const svgRef = React.useRef();
  const padding = 50;

  const descOptions = [
    {
      value: current,
      label: `Current:${calcPercentage(current, average).percentText}`,
      top: [30, 16],
      textColors: ['#ffffff', calcPercentage(current, average).percentColor],
      tick: 22,
      circle:	{
        fill: '#1439BD',
        radius: 8,
        borderColor: '#3C6AE1',
        borderWidth: 3,
      },
    },
    {
      value: average,
      label: `Average Volume:${getShortenNumber(average)}`,
      top: [-44, 16],
      textColors: ['#ffffff', '#ffffff'],
      tick: -20,
      circle:	{
        fill: '#6509DB',
        radius: 6,
      }
    },
  ];

  const getXAxis = (xRange) => {
    const ticks = descOptions.map(option => option.value);

    return d3
      .axisBottom(d3.scaleLinear([Math.min(average, current), Math.max(average, current)], xRange))
      .tickValues(ticks)
      .tickFormat((d, idx) => descOptions[idx]['label']);
  };

  const getDashedArrayInfo = (offset, interval) => {
    let dashInterval = ` 5 `;
    let dashBetween = "";
    let dashedCount = parseInt(offset * interval / 5);
    if (dashedCount % 2 === 1) dashedCount += 1;
    for (let dashIndex = 0; dashIndex < dashedCount; dashIndex++) {
      dashBetween += dashInterval;
    }
    return dashBetween;
  }

  const renderSVG = () => {
    const dims = {
      width: 320,
      innerHeight: 15,
      margin: {
        top: 0,
        left: padding,
        right: padding,
      },
    };

    dims.height = dims.innerHeight;
    dims.innerWidth = dims.width - (dims.margin.left + dims.margin.right);

    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", [0, 0, dims.width, dims.height]);

    const base = svg
      .append("g")
      .attr("id", "base")
      .attr("transform", `translate(${dims.margin.left - 5}, ${dims.margin.top})`);

    // Add axis
    const xRange = average > current
      ? [0, dims.innerWidth / 2]
      : average === current
        ? [dims.innerWidth / 2, dims.innerWidth / 2]
        : [dims.innerWidth / 2, dims.innerWidth];
    const xAxis = getXAxis(xRange).tickSizeOuter(0);

    base
      .append("g")
      .attr("id", "analyst-price-target-chart")
      .attr("transform", `translate(0, ${dims.innerHeight})`)
      .attr("width", dims.innerWidth)
      .call(xAxis)
      .call((g) => {

        var ticks = g.selectAll(".tick");
        ticks
          .call((t) => {
            t.each(function (d, i) {
              d3.select(this)
                .select('line')
                .attr('y2', descOptions[i].tick)
                .style('stroke', '#464646')
                .attr('stroke-width', 2)
              d3.select(this)
                .append("circle")
                .attr("r", descOptions[i].circle.radius)
                .style("stroke", descOptions[i].circle.borderColor ? descOptions[i].circle.borderColor : "transparent")
                .style("stroke-width", descOptions[i].circle.borderWidth ? descOptions[i].circle.borderWidth : 0)
                .style('fill', descOptions[i].circle.fill);
            });
          });

        g.selectAll(".domain").attr("stroke-width", "2");
        g.selectAll(".domain").attr("stroke", "#464646");

        const MIN_VOLUMNE = 1000
        const MAX_VOLUMNE = average * 2 - MIN_VOLUMNE

        if (current > MAX_VOLUMNE) {
          const offset = current - MAX_VOLUMNE;
          const interval = dims.innerWidth / (current - MIN_VOLUMNE);
          const dashBetween = getDashedArrayInfo(offset, interval);
          // g.selectAll(".domain").style("stroke-dasharray", (`${(MAX_VOLUMNE - MIN_VOLUMNE) * interval} ${dashBetween}`));
          g.selectAll(".domain").style("stroke-dasharray", (`${dashBetween}`));
        }

        if (current < MIN_VOLUMNE) {
          const offset = MIN_VOLUMNE - current;
          const interval = dims.innerWidth / (MAX_VOLUMNE - current);
          const dashBetween = getDashedArrayInfo(offset, interval);
          g.selectAll(".domain").style("stroke-dasharray", (`${dashBetween} ${(MAX_VOLUMNE - MIN_VOLUMNE) * interval}`));
        }
        
        g.selectAll(".tick text")
          .attr("y", "4px")
          .call((t) => {
            t.each(function (d, i) {
              // for each one
              var self = d3.select(this);
              var arr = self.text().split(":"); // get the text and split it
              self.text(""); // clear it out
              for (const k in arr) {
                self
                  .append("tspan") // insert two tspans
                  .attr("x", 0)
                  .attr("dy", descOptions[i].top[k])
                  .attr("color", descOptions[i].textColors[k])
                  .text(arr[k])
              }
            });
          });
      });
  };

  useEffect(() => {
    renderSVG();
  });

  return <svg ref={svgRef} />;
};

export default GrowthChart;