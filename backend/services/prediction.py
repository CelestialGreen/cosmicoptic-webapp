"""
🔄 HOT-SWAP SERVICE
This is the ONLY file that changes when real model arrives.
Keep the interface stable!
"""

import time
import json
from pathlib import Path
from typing import Dict, Any
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.schemas import AnalysisResponse, AnalysisMetadata, TransitRegion, SHAPExplanation
from services.data_generator import SyntheticLightCurveGenerator
from services.explainer import shap_explainer

class PredictionService:
    def __init__(self):
        """Initialize the prediction service"""
        # Load sample database
        data_path = Path(__file__).parent.parent / "data" / "samples.json"
        with open(data_path) as f:
            self.samples_db = json.load(f)["samples"]
        
        self.generator = SyntheticLightCurveGenerator()
        
        # 🔄 FUTURE: Load real model here
        # self.model = joblib.load("models/cosmic_optic_model.joblib")
    
    def predict(self, sample_id: str) -> AnalysisResponse:
        """
        Main prediction method.
        
        🔄 CURRENT: Uses synthetic data generator
        🔄 FUTURE: Will use real ML model
        """
        start_time = time.time()
        
        # Find sample metadata
        sample = next((s for s in self.samples_db if s["id"] == sample_id), None)
        if not sample:
            raise ValueError(f"Sample {sample_id} not found")
        
        # === PHASE 1: SYNTHETIC ===
        result = self._predict_synthetic(sample)
        
        # === PHASE 2: REAL MODEL (comment out above, uncomment below) ===
        # result = self._predict_with_model(sample)
        
        # Add processing time
        processing_time = int((time.time() - start_time) * 1000)
        result["processing_time_ms"] = processing_time
        
        # ✅ CRITICAL: Final safety check - sanitize ALL float values before JSON serialization
        result = self._sanitize_floats(result)
        
        return AnalysisResponse(**result)
    
    def _predict_synthetic(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        """
        🔄 PHASE 1: Synthetic prediction with BINARY classification
        Remove this method when real model is ready
        """
        truth = sample["truth"]
        params = sample["params"]
        
        # Generate appropriate light curve based on truth label
        # Map 3-class truth to 2-class prediction
        if truth == "confirmed":
            # Strong exoplanet signal - use realistic transit depth
            time_points, flux, transit_regions = self.generator.generate_confirmed_planet(
                period_days=params.get("period_days", 10),
                transit_depth=params.get("transit_depth", 0.01),  # Fallback if no radius
                transit_duration=params.get("transit_duration", 3),
                planet_radius_earth=params.get("planet_radius")  # NEW: Calculate from radius
            )
            classification = "exoplanet"
            confidence = 0.90 + (hash(sample["id"]) % 8) / 100  # 90-98%
            
        elif truth == "candidate":
            # Weak exoplanet signal or borderline case
            time_points, flux, transit_regions = self.generator.generate_candidate()
            
            # Candidates split: some are exoplanets (70%), some are not (30%)
            candidate_hash = hash(sample["id"]) % 100
            if candidate_hash < 70:
                # Classify as exoplanet but with lower confidence
                classification = "exoplanet"
                confidence = 0.60 + (candidate_hash % 20) / 100  # 60-80%
            else:
                # Classify as no_planet (ambiguous signal)
                classification = "no_planet"
                confidence = 0.55 + (candidate_hash % 15) / 100  # 55-70%
            
        else:  # false_positive
            # Clear non-planet signal
            time_points, flux, transit_regions = self.generator.generate_false_positive(
                anomaly_type=params.get("anomaly_type", "noise")
            )
            classification = "no_planet"
            confidence = 0.85 + (hash(sample["id"]) % 12) / 100  # 85-97%
        
        # Calculate BINARY class probabilities
        if classification == "exoplanet":
            probs = {
                "exoplanet": confidence,
                "no_planet": 1 - confidence
            }
        else:  # no_planet
            probs = {
                "exoplanet": 1 - confidence,
                "no_planet": confidence
            }
        
        # Generate SHAP explanation
        shap_data = shap_explainer.explain_prediction(
            light_curve=flux,
            time_points=time_points,
            classification=classification,
            confidence=confidence,
            transit_regions=transit_regions
        )
        
        return {
            "classification": classification,
            "confidence_score": confidence,
            "class_probabilities": probs,
            "light_curve_data": flux,
            "time_points": time_points,
            "highlighted_regions": [
                TransitRegion(**r) for r in transit_regions
            ],
            "analysis": AnalysisMetadata(
                orbital_period=params.get("period_days"),
                transit_duration=params.get("transit_duration"),
                planet_radius=params.get("planet_radius"),
                star_name=sample["name"],
                discovery_method="Transit"
            ),
            "shap_explanation": SHAPExplanation(**shap_data),
            "model_version": "CosmicNet-v1.0"
        }
    
    def _sanitize_floats(self, data: Any) -> Any:
        """
        Recursively sanitize all float values in nested dictionaries/lists
        to prevent JSON serialization errors from NaN/Infinity values
        """
        import math
        import numpy as np
        
        if isinstance(data, dict):
            return {k: self._sanitize_floats(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._sanitize_floats(item) for item in data]
        elif isinstance(data, (float, np.floating)):
            # Replace NaN with 0.0, Infinity with large finite numbers
            if math.isnan(data):
                return 0.0
            elif math.isinf(data):
                return 1e10 if data > 0 else -1e10
            else:
                return float(data)
        elif isinstance(data, (np.integer,)):
            return int(data)
        else:
            return data
    
    def _predict_with_model(self, sample: Dict[str, Any]) -> Dict[str, Any]:
        """
        🔄 PHASE 2: Real model prediction
        Implement this when model team delivers
        """
        # TODO: Load light curve from file
        # light_curve = load_light_curve(sample["id"])
        
        # TODO: Preprocess
        # features = preprocess(light_curve)
        
        # TODO: Predict
        # prediction = self.model.predict(features)
        # probabilities = self.model.predict_proba(features)
        
        # TODO: Find transit regions
        # transit_regions = find_transits(light_curve, probabilities)
        
        # TODO: Return same structure as _predict_synthetic
        pass

# Global service instance
prediction_service = PredictionService()
