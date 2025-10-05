import { useState } from 'react';
import { motion } from 'framer-motion';
import './DataInput.css';

function DataInput({ samples, onAnalyze, isLoading }) {
  const [selectedSample, setSelectedSample] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSample && !isLoading) {
      onAnalyze(selectedSample);
    }
  };

  return (
    <motion.div
      className="data-input glass-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Select Stellar Signal</h2>
      <p className="description">
        Choose a pre-loaded light curve from NASA's exoplanet missions to analyze
      </p>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-group">
          <label htmlFor="signal-select">Stellar Signal</label>
          <select
            id="signal-select"
            value={selectedSample}
            onChange={(e) => setSelectedSample(e.target.value)}
            disabled={isLoading || samples.length === 0}
          >
            <option value="">-- Select a signal --</option>
            {samples.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.name} - {sample.description}
              </option>
            ))}
          </select>
        </div>

        <motion.button
          type="submit"
          disabled={!selectedSample || isLoading}
          className="analyze-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Analyzing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Analyze Signal
            </>
          )}
        </motion.button>
      </form>

      <div className="info-panel">
        <h3>How it works</h3>
        <ul>
          <li>🌟 Select a stellar light curve signal</li>
          <li>🤖 Our AI analyzes the transit patterns</li>
          <li>🪐 Discover if it's an exoplanet!</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default DataInput;
