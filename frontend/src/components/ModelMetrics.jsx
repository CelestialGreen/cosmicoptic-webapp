import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import api from '../services/api';
import './ModelMetrics.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/metrics');
      setMetrics(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="model-metrics glass-card">
        <div className="metrics-loading">
          <span className="loading-spinner">⏳</span>
          <p>Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="model-metrics glass-card">
        <div className="metrics-error">
          <span className="error-icon">⚠️</span>
          <p>{error || 'No metrics available'}</p>
        </div>
      </div>
    );
  }

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getBarWidth = (value) => {
    return `${value * 100}%`;
  };

  return (
    <motion.div
      className="model-metrics glass-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="metrics-header">
        <h3>📊 Model Performance</h3>
        <button
          className="refresh-button"
          onClick={fetchMetrics}
          title="Refresh metrics"
        >
          🔄
        </button>
      </div>

      <div className="metrics-grid">
        {/* Accuracy */}
        <motion.div
          className="metric-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="metric-label">Accuracy</div>
          <div className="metric-bar">
            <motion.div
              className="metric-fill accuracy"
              initial={{ width: 0 }}
              animate={{ width: getBarWidth(metrics.accuracy) }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
          <div className="metric-value">{formatPercentage(metrics.accuracy)}</div>
        </motion.div>

        {/* Precision */}
        <motion.div
          className="metric-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="metric-label">Precision</div>
          <div className="metric-bar">
            <motion.div
              className="metric-fill precision"
              initial={{ width: 0 }}
              animate={{ width: getBarWidth(metrics.precision) }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          <div className="metric-value">{formatPercentage(metrics.precision)}</div>
        </motion.div>

        {/* Recall */}
        <motion.div
          className="metric-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="metric-label">Recall</div>
          <div className="metric-bar">
            <motion.div
              className="metric-fill recall"
              initial={{ width: 0 }}
              animate={{ width: getBarWidth(metrics.recall) }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
          <div className="metric-value">{formatPercentage(metrics.recall)}</div>
        </motion.div>

        {/* F1 Score */}
        <motion.div
          className="metric-item"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="metric-label">F1 Score</div>
          <div className="metric-bar">
            <motion.div
              className="metric-fill f1"
              initial={{ width: 0 }}
              animate={{ width: getBarWidth(metrics.f1_score) }}
              transition={{ duration: 1, delay: 0.9 }}
            />
          </div>
          <div className="metric-value">{formatPercentage(metrics.f1_score)}</div>
        </motion.div>
      </div>

      <div className="metrics-stats">
        <div className="stat-item">
          <span className="stat-label">Total Predictions:</span>
          <span className="stat-value">{metrics.total_predictions.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Exoplanets Found:</span>
          <span className="stat-value exoplanets">{metrics.exoplanets_found.toLocaleString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">False Positives:</span>
          <span className="stat-value false-positives">{metrics.false_positives.toLocaleString()}</span>
        </div>
      </div>

      <div className="metrics-footer">
        <div className="model-info">
          <span className="info-icon">🤖</span>
          <span className="info-text">{metrics.model_version}</span>
        </div>
        <div className="validation-date">
          <span className="date-icon">📅</span>
          <span className="date-text">Validated: {metrics.validation_date}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelMetrics;
