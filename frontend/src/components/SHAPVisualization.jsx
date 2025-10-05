import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import './SHAPVisualization.css';

function SHAPVisualization({ shapData, timePoints, lightCurveData }) {
  const chartRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!shapData || !chartRef.current) return;
    drawSHAPChart();
  }, [shapData]);

  const drawSHAPChart = () => {
    const container = containerRef.current;
    const svg = d3.select(chartRef.current);
    
    // Clear previous
    svg.selectAll('*').remove();

    // Dimensions - More space for proper display
    const containerWidth = container.offsetWidth;
    const margin = { top: 25, right: 40, bottom: 50, left: 70 };
    const width = Math.max(containerWidth - margin.left - margin.right, 200);
    const height = 220 - margin.top - margin.bottom;

    const g = svg
      .attr('width', containerWidth)
      .attr('height', 220)
      .attr('viewBox', `0 0 ${containerWidth} 220`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data
    const shapValues = shapData.feature_importance;
    const data = timePoints.map((t, i) => ({
      time: t,
      value: shapValues[i],
      index: i
    }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(timePoints))
      .range([0, width]);

    // Better y-axis scaling for SHAP values (centered at zero)
    const maxAbsValue = Math.max(Math.abs(d3.min(shapValues)), Math.abs(d3.max(shapValues)));
    const yScale = d3.scaleLinear()
      .domain([-maxAbsValue * 1.15, maxAbsValue * 1.15])  // Symmetric around zero
      .range([height, 0]);

    // Zero line
    g.append('line')
      .attr('class', 'zero-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .style('stroke', 'var(--text-dim)')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '3,3');

    // Area chart for SHAP values
    const area = d3.area()
      .x(d => xScale(d.time))
      .y0(yScale(0))
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Split into positive and negative contributions
    const positiveData = data.filter(d => d.value >= 0);
    const negativeData = data.filter(d => d.value < 0);

    // Positive contributions (pushing toward exoplanet)
    if (positiveData.length > 0) {
      g.append('path')
        .datum(positiveData)
        .attr('class', 'shap-positive')
        .attr('d', area)
        .style('fill', 'rgba(0, 191, 255, 0.3)')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    }

    // Negative contributions (pushing toward no_planet)
    if (negativeData.length > 0) {
      g.append('path')
        .datum(negativeData)
        .attr('class', 'shap-negative')
        .attr('d', area)
        .style('fill', 'rgba(255, 69, 0, 0.3)')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
    }

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text')
      .style('fill', 'var(--text-secondary)');

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('fill', 'var(--text-secondary)');

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .style('font-size', '0.85rem')
      .text('Time (days)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .style('font-size', '0.85rem')
      .text('SHAP Value');
  };

  const formatContribution = (value) => {
    return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  return (
    <motion.div
      className="shap-visualization glass-card"
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="shap-header">
        <h3>🔍 Model Explainability (SHAP)</h3>
        <p className="shap-subtitle">
          Understanding why the model made this prediction
        </p>
      </div>

      {/* SHAP Feature Importance Chart */}
      <div className="shap-chart-container">
        <svg ref={chartRef} className="shap-chart"></svg>
        <div className="shap-legend">
          <div className="legend-item">
            <span className="legend-box positive"></span>
            <span>Positive = Supports Prediction</span>
          </div>
          <div className="legend-item">
            <span className="legend-box negative"></span>
            <span>Negative = Opposes Prediction</span>
          </div>
        </div>
      </div>

      {/* Top Contributing Regions */}
      {shapData.top_contributing_regions && shapData.top_contributing_regions.length > 0 && (
        <div className="top-features">
          <h4>Key Contributing Regions</h4>
          <div className="features-list">
            {shapData.top_contributing_regions.slice(0, 3).map((region, idx) => (
              <motion.div
                key={idx}
                className="feature-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
              >
                <div className="feature-info">
                  <span className="feature-time">
                    {region.start_time.toFixed(1)} - {region.end_time.toFixed(1)} days
                  </span>
                  <span
                    className={`feature-contribution ${region.importance > 0 ? 'positive' : 'negative'}`}
                  >
                    {formatContribution(region.contribution_percent)}
                  </span>
                </div>
                <div className="feature-bar-container">
                  <motion.div
                    className={`feature-bar ${region.importance > 0 ? 'positive' : 'negative'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(region.contribution_percent), 100)}%` }}
                    transition={{ duration: 0.8, delay: 1.0 + idx * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Summary */}
      <motion.div
        className="explanation-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="summary-icon">💡</div>
        <p>{shapData.explanation_summary}</p>
      </motion.div>

      {/* Base Value Info */}
      <div className="shap-metrics">
        <div className="metric">
          <span className="metric-label">Base Value:</span>
          <span className="metric-value">{shapData.base_value.toFixed(3)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Predicted Value:</span>
          <span className="metric-value">{shapData.predicted_value.toFixed(3)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default SHAPVisualization;
