import { motion } from 'framer-motion';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <motion.div
        className="spinner-orb"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="orb-core"></div>
        <div className="orb-ring ring-1"></div>
        <div className="orb-ring ring-2"></div>
        <div className="orb-ring ring-3"></div>
      </motion.div>
      
      <motion.div
        className="loading-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <h3>Analyzing Light Curve</h3>
        <p>Our AI is detecting transit patterns...</p>
      </motion.div>

      <div className="loading-steps">
        {['Normalizing flux data', 'Detecting transits', 'Computing probabilities'].map(
          (step, index) => (
            <motion.div
              key={step}
              className="step-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3, repeat: Infinity, repeatDelay: 2 }}
            >
              <span className="step-dot"></span>
              <span>{step}</span>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}

export default LoadingSpinner;
