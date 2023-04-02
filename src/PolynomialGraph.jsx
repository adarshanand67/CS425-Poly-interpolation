import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function PolynomialGraph({ coefficients }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Define the x and y scales
    const xScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, 400]);
    const yScale = d3.scaleLinear()
      .domain([-100, 100])
      .range([200, 0]);

    // Generate the polynomial data
    const polynomial = d3.range(-10, 10, 0.1).map((x) => {
      const y = coefficients.reduce((sum, coeff, i) => sum + coeff * Math.pow(x, i), 0);
      return { x, y };
    });

    // Define the line function
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Draw the line on the SVG
    svg.append("path")
      .datum(polynomial)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }, [coefficients]);

  return (
    <svg ref={svgRef} width="400" height="200">
      <g transform="translate(50, 50)">
        <line x1="0" y1="0" x2="0" y2="200" stroke="black" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="black" />
      </g>
    </svg>
  );
}

export default PolynomialGraph;
