import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import './LightCurveChart.css';

function LightCurveChart({ timePoints, fluxData, highlightedRegions, starName }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!timePoints || !fluxData || !svgRef.current) return;

    drawChart();
  }, [timePoints, fluxData, highlightedRegions]);

  const drawChart = () => {
    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    
    // Clear previous chart
    svg.selectAll('*').remove();

    // Dimensions - Add padding to prevent overflow
    const containerWidth = container.offsetWidth;
    const margin = { top: 30, right: 40, bottom: 60, left: 70 };
    const width = Math.max(containerWidth - margin.left - margin.right, 200);
    const height = 350 - margin.top - margin.bottom;

    // Create SVG group with proper containment
    const g = svg
      .attr('width', containerWidth)
      .attr('height', 350)
      .attr('viewBox', `0 0 ${containerWidth} 350`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(timePoints))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(fluxData) * 0.999, d3.max(fluxData) * 1.001])
      .range([height, 0]);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(8);
    const yAxis = d3.axisLeft(yScale).ticks(6);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', 'var(--text-secondary)');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('fill', 'var(--text-secondary)');

    // Axis labels
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-color)')
      .text('Time (days)');

    g.append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-color)')
      .text('Normalized Flux');

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

    // Highlighted regions (transits)
    if (highlightedRegions && highlightedRegions.length > 0) {
      highlightedRegions.forEach((region) => {
        const startTime = timePoints[region.start_index];
        const endTime = timePoints[region.end_index];

        g.append('rect')
          .attr('class', 'transit-region')
          .attr('x', xScale(startTime))
          .attr('y', 0)
          .attr('width', xScale(endTime) - xScale(startTime))
          .attr('height', height)
          .style('fill', 'var(--highlight-color)')
          .style('opacity', 0.15);
      });
    }

    // Line generator
    const line = d3
      .line()
      .x((d, i) => xScale(timePoints[i]))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    // Draw the line
    const path = g
      .append('path')
      .datum(fluxData)
      .attr('class', 'light-curve-line')
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-color)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Animate the line drawing
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add data points (sample every 10th point for performance)
    const sampledData = fluxData.filter((d, i) => i % 10 === 0);
    const sampledTimes = timePoints.filter((d, i) => i % 10 === 0);

    g.selectAll('.data-point')
      .data(sampledData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', (d, i) => xScale(sampledTimes[i]))
      .attr('cy', (d) => yScale(d))
      .attr('r', 0)
      .style('fill', 'var(--accent-color)')
      .style('opacity', 0.6)
      .transition()
      .delay((d, i) => i * 2)
      .attr('r', 2);
  };

  return (
    <motion.div
      className="light-curve-chart glass-card"
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <h3>Light Curve Analysis</h3>
        <p className="star-name">{starName}</p>
      </div>
      
      <svg ref={svgRef} className="chart-svg"></svg>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-line" style={{ background: 'var(--accent-color)' }}></span>
          <span>Normalized Flux</span>
        </div>
        {highlightedRegions && highlightedRegions.length > 0 && (
          <div className="legend-item">
            <span
              className="legend-box"
              style={{ background: 'var(--highlight-color)' }}
            ></span>
            <span>Detected Transit</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LightCurveChart;
