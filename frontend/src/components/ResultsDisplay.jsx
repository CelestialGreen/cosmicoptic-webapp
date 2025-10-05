import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import VerdictCard from './VerdictCard';
import LightCurveChart from './LightCurveChart';
import SHAPVisualization from './SHAPVisualization';
import './ResultsDisplay.css';

function ResultsDisplay({ isLoading, result }) {
  console.log('🎨 [DEBUG] ResultsDisplay render:', { isLoading, hasResult: !!result });
  
  if (isLoading) {
    console.log('⏳ [DEBUG] Showing loading spinner');
    return (
      <motion.div
        className="results-display glass-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (!result) {
    console.log('📭 [DEBUG] No result, showing empty state');
    return (
      <motion.div
        className="results-display glass-card empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="empty-content">
          <span className="empty-icon">🔭</span>
          <h2>Ready to Discover</h2>
          <p>Select a stellar signal to begin your exoplanet analysis</p>
        </div>
      </motion.div>
    );
  }
  
  console.log('✨ [DEBUG] Rendering result:', {
    classification: result.classification,
    confidence: result.confidence_score
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="results-display"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Verdict Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <VerdictCard result={result} />
        </motion.div>

        {/* Light Curve Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LightCurveChart
            timePoints={result.time_points}
            fluxData={result.light_curve_data}
            highlightedRegions={result.highlighted_regions}
            starName={result.analysis.star_name}
          />
        </motion.div>

        {/* SHAP Explainability - NEW! */}
        {result.shap_explanation && (
          <SHAPVisualization
            shapData={result.shap_explanation}
            timePoints={result.time_points}
            lightCurveData={result.light_curve_data}
          />
        )}

        {/* Additional Analysis */}
        <motion.div
          className="glass-card analysis-details"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>Analysis Details</h3>
          <div className="details-grid">
            {result.analysis.orbital_period && (
              <div className="detail-item">
                <span className="detail-label">Orbital Period</span>
                <span className="detail-value">
                  {result.analysis.orbital_period.toFixed(2)} days
                </span>
              </div>
            )}
            {result.analysis.transit_duration && (
              <div className="detail-item">
                <span className="detail-label">Transit Duration</span>
                <span className="detail-value">
                  {result.analysis.transit_duration.toFixed(2)} hours
                </span>
              </div>
            )}
            {result.analysis.planet_radius && (
              <div className="detail-item">
                <span className="detail-label">Planet Radius</span>
                <span className="detail-value">
                  {result.analysis.planet_radius.toFixed(2)} R⊕
                </span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Star</span>
              <span className="detail-value">{result.analysis.star_name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Method</span>
              <span className="detail-value">{result.analysis.discovery_method}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Processing Time</span>
              <span className="detail-value">{result.processing_time_ms}ms</span>
            </div>
          </div>
          
          <div className="model-info">
            <span className="model-badge">Model: {result.model_version}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ResultsDisplay;
