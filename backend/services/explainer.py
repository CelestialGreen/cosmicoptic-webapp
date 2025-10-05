"""
SHAP Explainer Service
Provides model interpretability using SHAP values
"""

import numpy as np
from scipy.ndimage import gaussian_filter1d
from typing import Dict, List, Tuple, Any

class SHAPExplainer:
    """
    SHAP explainability service for exoplanet detection models
    
    🔄 HOT-SWAP READY: This will work with real models once integrated
    For now, provides synthetic SHAP-like explanations
    """
    
    def __init__(self):
        """Initialize the SHAP explainer"""
        # 🔄 FUTURE: Initialize real SHAP explainer
        # import shap
        # self.explainer = shap.Explainer(model, background_data)
        pass
    
    def explain_prediction(
        self, 
        light_curve: List[float], 
        time_points: List[float],
        classification: str,
        confidence: float,
        transit_regions: List[Dict]
    ) -> Dict[str, Any]:
        """
        Generate SHAP explanation for a prediction
        
        Args:
            light_curve: Normalized flux values
            time_points: Time in days
            classification: Predicted class (exoplanet/no_planet)
            confidence: Model confidence score
            transit_regions: Detected transit regions
            
        Returns:
            Dictionary with SHAP explanation data
        """
        
        # 🔄 PHASE 1: Synthetic SHAP-like values
        return self._generate_synthetic_shap(
            light_curve, time_points, classification, confidence, transit_regions
        )
        
        # 🔄 PHASE 2: Real SHAP (uncomment when model ready)
        # return self._generate_real_shap(light_curve, classification)
    
    def _generate_synthetic_shap(
        self,
        light_curve: List[float],
        time_points: List[float],
        classification: str,
        confidence: float,
        transit_regions: List[Dict]
    ) -> Dict[str, Any]:
        """
        Generate realistic synthetic SHAP values for demonstration
        
        SHAP SEMANTICS:
        - POSITIVE values = Features supporting the PREDICTED class
        - NEGATIVE values = Features opposing the PREDICTED class
        - For "exoplanet": Transit dips get POSITIVE (support detection)
        - For "no_planet": Noise/irregularity get POSITIVE (support rejection)
        
        REALISM FEATURES:
        - Smooth Gaussian-like peaks at important regions
        - Sparse contributions (most points near zero)
        - Natural noise and fluctuations
        - Smooth transitions (no sharp edges)
        """
        
        n_points = len(light_curve)
        flux_array = np.array(light_curve)
        time_array = np.array(time_points)
        
        # Calculate feature importance (SHAP-like values)
        feature_importance = np.zeros(n_points)
        
        # Base value (model's default prediction = 0.5 neutral)
        base_value = 0.5
        
        # Add natural background noise (small random fluctuations)
        np.random.seed(42)  # Reproducible
        background_noise = np.random.normal(0, 0.01, n_points)
        feature_importance += background_noise
        
        if classification == "exoplanet":
            # EXOPLANET DETECTED: Show what SUPPORTS this decision
            if transit_regions:
                for i, region in enumerate(transit_regions):
                    start_idx = region.get("start_index", 0)
                    end_idx = region.get("end_index", n_points)
                    depth = region.get("depth", 0.01)
                    
                    # Calculate center of transit
                    center_idx = (start_idx + end_idx) // 2
                    center_time = time_array[center_idx]
                    
                    # Create Gaussian-like peak centered on transit
                    # Width = transit duration * 1.5 for smooth falloff
                    width = (end_idx - start_idx) * 1.5
                    
                    # Calculate Gaussian importance for all points
                    distances = np.abs(time_array - center_time)
                    gaussian_weights = np.exp(-0.5 * (distances / (width * 0.15)) ** 2)
                    
                    # Scale by depth and confidence, with decay for multiple transits
                    importance_scale = min(depth * 600 * confidence, 0.8) * (0.9 ** i)
                    feature_importance += gaussian_weights * importance_scale
            
            # Out-of-transit regions: Very slight positive (periodicity helps)
            # But keep it sparse (only small contribution)
            baseline_stability = 1.0 - np.abs(flux_array - 1.0)
            feature_importance += baseline_stability * 0.02 * confidence
            
            # Add some negative contributions for noisy regions
            flux_noise = np.abs(flux_array - np.median(flux_array))
            high_noise_mask = flux_noise > np.percentile(flux_noise, 80)
            feature_importance[high_noise_mask] -= 0.05 * confidence
            
            # Calculate predicted value
            predicted_value = base_value + np.mean(feature_importance)
            
        else:  # no_planet
            # NO_PLANET DETECTED: Show what SUPPORTS this rejection
            
            # High variance/irregularity SUPPORTS "no_planet" (positive SHAP)
            flux_variance = np.abs(flux_array - np.mean(flux_array))
            max_var = np.max(flux_variance)
            # ✅ CRITICAL: Prevent division by zero
            if max_var > 1e-10:  # Small epsilon to avoid divide-by-zero
                normalized_variance = flux_variance / max_var
            else:
                normalized_variance = np.zeros_like(flux_variance)
            
            # Create smooth peaks at high-variance regions using Gaussian smoothing
            window_size = max(3, n_points // 50)
            smoothed_variance = np.convolve(
                normalized_variance, 
                np.ones(window_size) / window_size, 
                mode='same'
            )
            
            # Scale by confidence
            feature_importance += smoothed_variance * 0.4 * confidence
            
            if transit_regions:
                # Weak transit-like features get NEGATIVE SHAP
                # (these argue FOR exoplanet but were insufficient)
                for region in transit_regions:
                    start_idx = region.get("start_index", 0)
                    end_idx = region.get("end_index", n_points)
                    center_idx = (start_idx + end_idx) // 2
                    center_time = time_array[center_idx]
                    
                    # Create smooth negative Gaussian at dip locations
                    width = (end_idx - start_idx) * 1.5
                    distances = np.abs(time_array - center_time)
                    gaussian_weights = np.exp(-0.5 * (distances / (width * 0.15)) ** 2)
                    
                    # Negative contribution (weak evidence for planet)
                    feature_importance -= gaussian_weights * 0.2 * confidence
            
            # Add very slight positive for stable regions (consistency with no-transit)
            stability = 1.0 - np.abs(flux_array - np.median(flux_array))
            feature_importance += stability * 0.01 * confidence
            
            # Normalize to reasonable range
            feature_importance = np.clip(feature_importance, -0.8, 0.8)
            
            # Calculate predicted value
            predicted_value = base_value + np.mean(feature_importance)
        
        # Apply Gaussian smoothing filter for realistic appearance
        # Real SHAP values have smooth transitions due to feature interactions
        feature_importance = gaussian_filter1d(feature_importance, sigma=1.5)
        
        # Final normalization to keep in realistic range
        max_abs = np.max(np.abs(feature_importance))
        if max_abs > 0:
            feature_importance = feature_importance / max_abs * 0.6  # Scale to max ±0.6
        
        # ✅ CRITICAL: Sanitize NaN and Infinity values before JSON serialization
        feature_importance = np.nan_to_num(feature_importance, nan=0.0, posinf=0.6, neginf=-0.6)
        
        # Ensure predicted value is reasonable
        predicted_value = np.clip(predicted_value, 0.0, 1.0)
        predicted_value = float(np.nan_to_num(predicted_value, nan=0.5))  # Default to neutral if NaN
        
        # Find top contributing regions
        top_regions = self._identify_top_regions(
            feature_importance, time_points, top_k=5
        )
        
        # Generate human-readable explanation
        explanation_summary = self._generate_explanation(
            classification, confidence, top_regions, transit_regions
        )
        
        return {
            "feature_importance": feature_importance.tolist(),
            "top_contributing_regions": top_regions,
            "explanation_summary": explanation_summary,
            "base_value": base_value,
            "predicted_value": predicted_value
        }
    
    def _identify_top_regions(
        self,
        feature_importance: np.ndarray,
        time_points: List[float],
        top_k: int = 5
    ) -> List[Dict[str, float]]:
        """
        Identify top contributing time regions based on SHAP values
        """
        
        # Find peaks of absolute importance
        abs_importance = np.abs(feature_importance)
        
        # Group consecutive high-importance points into regions
        threshold = np.percentile(abs_importance, 80)
        important_mask = abs_importance > threshold
        
        regions = []
        in_region = False
        region_start = 0
        
        for i, is_important in enumerate(important_mask):
            if is_important and not in_region:
                region_start = i
                in_region = True
            elif not is_important and in_region:
                region_end = i
                region_importance = np.mean(feature_importance[region_start:region_end])
                
                # ✅ CRITICAL: Sanitize all float values before adding to JSON
                start_time = float(np.nan_to_num(time_points[region_start], nan=0.0))
                end_time = float(np.nan_to_num(time_points[region_end - 1], nan=0.0))
                importance = float(np.nan_to_num(region_importance, nan=0.0))
                
                regions.append({
                    "start_time": start_time,
                    "end_time": end_time,
                    "importance": importance,
                    "contribution_percent": float(abs(importance) * 100)
                })
                in_region = False
        
        # Sort by absolute importance and take top K
        regions.sort(key=lambda x: abs(x["importance"]), reverse=True)
        return regions[:top_k]
    
    def _generate_explanation(
        self,
        classification: str,
        confidence: float,
        top_regions: List[Dict],
        transit_regions: List[Dict]
    ) -> str:
        """
        Generate human-readable explanation of the prediction
        
        SHAP INTERPRETATION:
        - Positive (blue) = Features supporting the predicted class
        - Negative (red) = Features opposing the predicted class
        """
        
        if classification == "exoplanet":
            if not transit_regions:
                return f"Model detected EXOPLANET with {confidence*100:.1f}% confidence, though no clear transit regions were identified. This may indicate a subtle or complex signal."
            
            n_transits = len(transit_regions)
            transit_text = f"{n_transits} periodic transit event{'s' if n_transits > 1 else ''}"
            
            top_region = top_regions[0] if top_regions else None
            if top_region and top_region['importance'] > 0:
                time_info = f" The strongest supporting evidence appears at {top_region['start_time']:.1f}-{top_region['end_time']:.1f} days (contributing +{top_region['contribution_percent']:.1f}% toward exoplanet classification)."
            else:
                time_info = ""
            
            return f"Model detected EXOPLANET with {confidence*100:.1f}% confidence based on {transit_text}.{time_info} Blue/positive SHAP regions show transit dips that SUPPORT the exoplanet detection."
        
        else:  # no_planet
            top_region = top_regions[0] if top_regions else None
            
            # Check if top region is positive (supporting no_planet) or negative (arguing for planet)
            if top_region:
                if top_region['importance'] > 0:
                    # Positive = noise/irregularity supporting "no_planet"
                    reason = f"high noise/variability at {top_region['start_time']:.1f}-{top_region['end_time']:.1f} days (+{top_region['contribution_percent']:.1f}%)"
                else:
                    # Negative = transit-like features that were rejected
                    reason = f"suspicious dips at {top_region['start_time']:.1f}-{top_region['end_time']:.1f} days were insufficient evidence ({top_region['contribution_percent']:.1f}%)"
            else:
                reason = "lack of convincing periodic transit patterns"
            
            return f"Model classified as NO PLANET with {confidence*100:.1f}% confidence due to {reason}. Blue/positive SHAP shows features SUPPORTING rejection (noise, irregularity), while red/negative shows weak transit-like features that were insufficient."
    
    def _generate_real_shap(self, light_curve: List[float], classification: str) -> Dict[str, Any]:
        """
        🔄 PHASE 2: Generate real SHAP values using the trained model
        Implement this when model team delivers
        """
        # TODO: Real SHAP implementation
        # import shap
        # 
        # # Prepare data
        # features = np.array(light_curve).reshape(1, -1)
        # 
        # # Calculate SHAP values
        # shap_values = self.explainer(features)
        # 
        # # Extract data
        # return {
        #     "feature_importance": shap_values.values[0].tolist(),
        #     "base_value": float(shap_values.base_values[0]),
        #     "predicted_value": float(shap_values.base_values[0] + shap_values.values[0].sum()),
        #     ...
        # }
        pass

# Global explainer instance
shap_explainer = SHAPExplainer()
