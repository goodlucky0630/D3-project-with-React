import React, { useEffect } from "react";
import * as d3 from "d3";
import "./index.css";
import Box from "../containers/box";

const AnalystPriceTargetScale = ({ current, average, min, max }) => {
    const svgRef = React.useRef();
		const padding = 30;

    const descOptions = [
      {
        value: min,
        label: `Low ${min.toFixed(2)}`,
				top: 20,
				left: padding,
				tick: 0,
				circle:	{
					fill: '#6509DB',
					radius: 8,
				},
      },
			{
        value: average,
        label: `Average ${average.toFixed(2)}`,
				top: -28,
				left: 0,
				tick: -18,
				circle:	{
					fill: '#1439BD',
					radius: 8,
					borderColor: '#3C6AE1',
					borderWidth: 3,
				},
      },
      {
        value: max,
        label: `High ${max.toFixed(2)}`,
				top: 20,
				left: current >= max ? 0 : -padding,
				tick: 0,
				circle:	{
					fill: '#6509DB',
					radius: 8,
				},
      },
			{
        value: current,
        label: `Current ${current.toFixed(2)}`,
				top: 44,
				left: current <= min ? padding : current >= max ? -padding : 0,
				tick: 34,
				circle:	{
					fill: '#4398C8',
					radius: 6,
				},
      },
    ];

    const getXAxis = (xRange) => {
      const ticks = descOptions.map(option => option.value);

      return d3
        .axisBottom(d3.scaleLinear([Math.min(min, current), Math.max(max, current)], xRange))
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
        innerHeight: 42,
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
      const xRange = [0, dims.innerWidth];
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
									.attr('stroke-width', 2);
								d3.select(this)
									.append("circle")
									.attr("r", descOptions[i].circle.radius)
									.style("stroke", descOptions[i].circle.borderColor ? descOptions[i].circle.borderColor : "transparent")
									.style("stroke-width", descOptions[i].circle.borderWidth ? descOptions[i].circle.borderWidth : 0)
									.style('fill', descOptions[i].circle.fill);
							});
						});

          g.selectAll(".domain").attr("stroke-width", "2px");
          g.selectAll(".domain").attr("stroke", "#464646");

					if (current > max) {
						const offset = current - max;
						const interval = dims.innerWidth / (current - min);
						const dashBetween = getDashedArrayInfo(offset, interval);
						g.selectAll(".domain").style("stroke-dasharray", (`${(max - min) * interval} ${dashBetween}`));
					}

					if (current < min) {
						const offset = min - current;
						const interval = dims.innerWidth / (max - current);
						const dashBetween = getDashedArrayInfo(offset, interval);
						g.selectAll(".domain").style("stroke-dasharray", (`${dashBetween} ${(max - min) * interval}`));
					}


          g.selectAll(".tick text")
            .attr("y", "4px")
            .call((t) => {
              t.each(function (d, i) {
                // for each one
                var self = d3.select(this);
								self
									.attr("dy", descOptions[i].top)
									.text(self.text())
									.attr('transform', `translate(${descOptions[i].left}, 0)`);
              });
            });
        });
    };

    useEffect(() => {
      renderSVG();
    });

    return <svg ref={svgRef} />;
  };

const AnalystPriceTarget = () => {
  return (
    <Box>
      <h1>Analyst Price Target</h1>
      <AnalystPriceTargetScale
				min={150}
				max={210}
				current={120}
				average={180}
			/>
    </Box>
  );
};

export default AnalystPriceTarget;
