import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cosmicOpticAPI } from './services/api';
import DataInput from './components/DataInput';
import FileUploadInput from './components/FileUploadInput';
import ModelMetrics from './components/ModelMetrics';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
  const [samples, setSamples] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Load samples on mount
  useEffect(() => {
    loadSamples();
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const status = await cosmicOpticAPI.getStatus();
      setApiStatus(status);
    } catch (err) {
      console.error('API not reachable:', err);
      setApiStatus({ status: 'offline' });
    }
  };

  const loadSamples = async () => {
    try {
      const data = await cosmicOpticAPI.getSamples();
      setSamples(data.samples);
    } catch (err) {
      setError('Failed to load samples. Please ensure the backend is running.');
      console.error(err);
    }
  };

  const handleAnalyze = async (sampleId) => {
    console.log('🔍 [DEBUG] Starting analysis for:', sampleId);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('📡 [DEBUG] Calling API...');
      const result = await cosmicOpticAPI.predictExoplanet(sampleId);
      console.log('✅ [DEBUG] Got result:', {
        classification: result.classification,
        confidence: result.confidence_score,
        hasLightCurve: !!result.light_curve_data,
        hasTimePoints: !!result.time_points,
        hasSHAP: !!result.shap_explanation,
        hasAnalysis: !!result.analysis
      });
      setAnalysisResult(result);
      console.log('📊 [DEBUG] State updated successfully');
    } catch (err) {
      console.error('❌ [DEBUG] Error occurred:', err);
      console.error('❌ [DEBUG] Error response:', err.response);
      console.error('❌ [DEBUG] Error status:', err.response?.status);
      console.error('❌ [DEBUG] Error data:', err.response?.data);
      
      // Better error message
      let errorMessage = 'Analysis failed. Please try again.';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.status === 404) {
        errorMessage = 'Sample not found. Please select a different signal.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. The analysis took too long.';
      } else if (!err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
      console.log('🏁 [DEBUG] Analysis complete');
    }
  };

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await cosmicOpticAPI.uploadAndPredict(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err.response?.data?.detail || 'File upload failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="header-content">
          <h1>
            <span className="cosmic-icon">🔭</span>
            CosmicOptic
          </h1>
          <p className="tagline">AI-Powered Exoplanet Discovery</p>
          {apiStatus && (
            <div className={`api-status ${apiStatus.status}`}>
              <span className="status-dot"></span>
              Model: CosmicNet-v1.0
            </div>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Error Display */}
          {error && (
            <motion.div
              className="error-banner glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Left Column */}
          <div className="layout-left">
            {/* Model Metrics */}
            <ModelMetrics />

            {/* Sample Selection */}
            <DataInput
              samples={samples}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />

            {/* File Upload */}
            <FileUploadInput
              onAnalyze={handleFileUpload}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column - Results */}
          <div className="layout-right">
            <ResultsDisplay
              isLoading={isLoading}
              result={analysisResult}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          NASA Space Apps Challenge 2025 | Team CelestialGreen
        </p>
      </footer>
    </div>
  );
}

export default App;
