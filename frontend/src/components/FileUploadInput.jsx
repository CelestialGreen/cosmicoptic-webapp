import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FileUploadInput.css';

const FileUploadInput = ({ onAnalyze, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large! Maximum size is 10 MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large! Maximum size is 10 MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
  };

  return (
    <motion.div
      className="file-upload-container glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="upload-header">
        <h3>📂 Upload Your Data</h3>
        <p className="upload-subtitle">
          Upload stellar light curve data for analysis
        </p>
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <div className="upload-icon">📁</div>
            <p className="drop-text">
              Drag & drop your file here, or{' '}
              <label htmlFor="file-input" className="file-label">
                browse
              </label>
            </p>
            <input
              id="file-input"
              type="file"
              accept=".csv,.fits,.txt,.json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <p className="file-info">
              Accepted formats: CSV, FITS, TXT, JSON • Max size: 10 MB
            </p>
          </>
        ) : (
          <div className="selected-file">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              className="clear-button"
              onClick={handleClear}
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <motion.button
          className="upload-button"
          onClick={handleUpload}
          disabled={isLoading}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? '⏳ Analyzing...' : '🚀 Upload & Analyze'}
        </motion.button>
      )}
    </motion.div>
  );
};

export default FileUploadInput;
