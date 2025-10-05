import { motion } from 'framer-motion';
import './VerdictCard.css';

function VerdictCard({ result }) {
  const { classification, confidence_score, class_probabilities } = result;

  const getClassificationColor = (type) => {
    switch (type) {
      case 'exoplanet':
        return 'var(--success-color)';
      case 'no_planet':
        return 'var(--warning-color)';
      default:
        return 'var(--text-color)';
    }
  };

  const getClassificationIcon = (type) => {
    switch (type) {
      case 'exoplanet':
        return '🪐';
      case 'no_planet':
        return '⭕';
      default:
        return '❓';
    }
  };

  const getClassificationText = (type) => {
    switch (type) {
      case 'exoplanet':
        return 'Exoplanet Detected';
      case 'no_planet':
        return 'No Planet Detected';
      default:
        return 'Unknown';
    }
  };

  const getConfidenceLevel = (score) => {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <motion.div
      className="verdict-card glass-card"
      style={{ borderColor: getClassificationColor(classification) }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="verdict-header">
        <span className="verdict-icon" style={{ fontSize: '3rem' }}>
          {getClassificationIcon(classification)}
        </span>
        <h2
          className="verdict-title"
          style={{ color: getClassificationColor(classification) }}
        >
          {getClassificationText(classification)}
        </h2>
      </div>

      <div className="confidence-section">
        <div className="confidence-label">
          <span>Confidence</span>
          <span className="confidence-level">
            {getConfidenceLevel(confidence_score)}
          </span>
        </div>
        <div className="confidence-bar">
          <motion.div
            className="confidence-fill"
            initial={{ width: 0 }}
            animate={{ width: `${confidence_score * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ backgroundColor: getClassificationColor(classification) }}
          />
        </div>
        <div className="confidence-value">
          {(confidence_score * 100).toFixed(1)}%
        </div>
      </div>

      <div className="probabilities-section">
        <h3>Classification Probabilities</h3>
        {Object.entries(class_probabilities).map(([key, value], index) => (
          <motion.div
            key={key}
            className="probability-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="prob-label">
              <span className="prob-icon">{getClassificationIcon(key)}</span>
              <span>{getClassificationText(key)}</span>
            </div>
            <div className="prob-bar">
              <motion.div
                className="prob-fill"
                initial={{ width: 0 }}
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                style={{
                  backgroundColor: getClassificationColor(key),
                  opacity: 0.7,
                }}
              />
            </div>
            <span className="prob-value">{(value * 100).toFixed(1)}%</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default VerdictCard;
