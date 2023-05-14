import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "./index.css";

const GeneralSlider = ({
  title,
  min = 0,
  max = 1,
  average,
  averageHandler,
}) => {
  const svgRef = useRef();
  const handlerRef = useRef();
  const xScaleRef = useRef();

  const renderSVG = () => {
    // setup dimensions and margin info
    const dims = {
      width: svgRef.current.clientWidth,
      height: 52,
    };
    dims.margin = {
      top: 0,
      right: 14,
      bottom: 38,
      left: 14,
    };
    dims.innerWidth = dims.width - dims.margin.left - dims.margin.right;
    dims.innerHeight = dims.height - dims.margin.top - dims.margin.bottom;

    // setup scales and axis info
    const xDomain = [min, max];
    const xRange = [0, dims.innerWidth];
    const xScale = d3.scaleLinear(xDomain, xRange);
    xScaleRef.current = xScale;
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    xAxis.ticks(0);
    const lineHeight = 4;
    const sliderLineY = 9;

    // configure slider peripheral aesthetics
    const descDims = {
      baseX: dims.innerWidth / 2,
      baseY: dims.innerHeight + 32,
    };
    descDims.padding = {
      offset: 68,
      right: 7,
      left: 2,
    };

    // configure slider aesthetics
    const barConfigs = [
      {
        name: "slider-line-green",
        x: 0,
        width: dims.innerWidth / 4,
        fill: "#00C25A",
      },
      {
        name: "slider-line-grey",
        x: dims.innerWidth / 4,
        width: dims.innerWidth / 2,
        fill: "#616161",
      },
      {
        name: "slider-line-red",
        x: (dims.innerWidth / 4) * 3,
        width: dims.innerWidth / 4,
        fill: "#C20033",
      },
    ];

    // setup svg d3 object
    svgRef.current.innerHTML = "";
    const svg = d3
      .select(svgRef.current)
      .attr("width", dims.width)
      .attr("height", dims.height)
      .attr("viewBox", `0 0 ${dims.width} ${dims.height}`)
      .append("g")
      .attr("transform", `translate(${dims.margin.left}, ${dims.margin.top})`)
      .attr("class", "slider-container");

    // append axis and slider line
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${dims.innerHeight})`)
      .attr("width", dims.innerWidth)
      .call(xAxis)
      .call((g) => {
        g.select("path.domain").remove();
        barConfigs.forEach((barConfig) => {
          g.append("rect")
            .attr("class", barConfig.name)
            .attr("x", barConfig.x)
            .attr("y", sliderLineY)
            .attr("width", barConfig.width)
            .attr("height", lineHeight)
            .attr("fill", barConfig.fill);
        });
      });

    // append slider peripherals
    const oversoldDesc = svg
      .append("g")
      .attr("class", "slider-desc")
      .attr(
        "transform",
        `translate(${descDims.baseX - descDims.padding.offset - 10}, ${
          descDims.baseY
        })`
      );

    oversoldDesc
      .append("svg")
      .attr("width", 19)
      .attr("height", 12)
      .attr("viewBox", "0 0 19 12")
      .attr("fill", "none")
      .append("path")
      .attr(
        "d",
        "M0.0595703 6L9.05957 11.1962V0.803848L0.0595703 6ZM8.15957 6.9H18.1572V5.1H8.15957V6.9Z"
      )
      .attr("fill", "#616161")
      .attr("transform", `translate(-50, -12)`);

    oversoldDesc
      .append("text")
      .attr("class", "slider-desc-text")
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("font-weight", "400")
      .attr("font-family", "Arial")
      .attr("fill", "#616161")
      .text("Oversold");

    const overboughtDesc = svg
      .append("g")
      .attr("class", "slider-desc")
      .attr(
        "transform",
        `translate(${descDims.baseX + descDims.padding.offset}, ${
          descDims.baseY
        })`
      );

    overboughtDesc
      .append("svg")
      .attr("width", 19)
      .attr("height", 12)
      .attr("viewBox", "0 0 19 12")
      .attr("fill", "none")
      .append("path")
      .attr(
        "d",
        "M19 6L10 0.803849L10 11.1962L19 6ZM10.9 5.1L0.902349 5.1L0.90235 6.9L10.9 6.9L10.9 5.1Z"
      )
      .attr("fill", "#616161")
      .attr("transform", `translate(40, -10)`);

    overboughtDesc
      .append("text")
      .attr("class", "slider-desc-text")
      .attr("text-anchor", "middle")
      .attr("font-size", "15px")
      .attr("font-weight", "400")
      .attr("font-family", "Arial")
      .attr("fill", "#616161")
      .text("Overbought");

    // create slider objects
    const triangleSize = 300;
    const outerTriangle = d3
      .symbol()
      .type(d3.symbolTriangle)
      .size(triangleSize);

    const innerTriangle = d3
      .symbol()
      .type(d3.symbolTriangle)
      .size(triangleSize - 50);

    function getTriangleColor(scaled, max) {
      if (scaled >= 0 && scaled <= max / 4) return "#00C25A";
      if (scaled > (max / 4) * 3) return "#C20033";
      return "#616161";
    }

    // add draggable slider
    const drag = d3.drag();
    const markerY = 10;
    const handler = svg
      .append("g")
      .attr(
        "transform",
        `translate(${xScale(average)}, ${markerY}) rotate(180)`
      )
      .attr("class", "slider")
      .attr("id", "handler")
      .call(drag);
    handlerRef.current = handler;

    const dragPointer = handler
      .append("path")
      .attr("d", outerTriangle)
      .attr("stroke", getTriangleColor(xScale(average), dims.innerWidth))
      .attr("stroke-width", 0.75)
      .classed("drag-pointer", true);

    const pointer = handler
      .append("path")
      .attr("d", innerTriangle)
      .attr("fill", getTriangleColor(xScale(average), dims.innerWidth))
      .classed("pointer", true);

    drag.on("start", function () {
      dragPointer.classed("dragging", true);
    });
    drag.on("drag", function (event, d) {
      let x = event.x;
      if (x < 0) x = 0;
      if (x > dims.innerWidth) x = dims.innerWidth;
      handler.attr("transform", `translate(${x}, ${markerY}) rotate(180)`);
      pointer.attr("fill", getTriangleColor(x, dims.innerWidth));
      dragPointer.attr("stroke", getTriangleColor(x, dims.innerWidth));

      const avg = xScale.invert(x);
      if (averageHandler) averageHandler(avg);
    });
    drag.on("end", function () {
      dragPointer.classed("dragging", false);
    });
  };

  useEffect(() => {
    if (handlerRef.current) {
      handlerRef.current.attr(
        "transform",
        `translate(${xScaleRef.current(average)}, 0)`
      );
    }
  }, [average]);
  useEffect(() => {
    renderSVG();
  });

  return (
    <div className="py-[1px]">
      <h6 className="text-[17px] leading-[18px] text-center text-white">
        {title}
      </h6>
      <svg ref={svgRef} />
    </div>
  );
};

export default GeneralSlider;
