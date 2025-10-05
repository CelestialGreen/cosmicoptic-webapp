from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class SignalRequest(BaseModel):
    sample_id: str = Field(..., description="ID of the stellar signal to analyze")
    
class TransitRegion(BaseModel):
    start_index: int
    end_index: int
    depth: float
    
class AnalysisMetadata(BaseModel):
    orbital_period: Optional[float] = None
    transit_duration: Optional[float] = None  # in hours
    planet_radius: Optional[float] = None  # Earth radii
    star_name: str
    discovery_method: str = "Transit"

class SHAPExplanation(BaseModel):
    """SHAP explainability data for model interpretability"""
    feature_importance: List[float] = Field(..., description="SHAP values for each time point")
    top_contributing_regions: List[Dict[str, float]] = Field(..., description="Most important transit regions")
    explanation_summary: str = Field(..., description="Human-readable explanation")
    base_value: float = Field(..., description="Expected value without features")
    predicted_value: float = Field(..., description="Final prediction value")
    
class AnalysisResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    # Core classification - BINARY: Exoplanet or None
    classification: str = Field(..., description="exoplanet | no_planet")
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    class_probabilities: Dict[str, float] = Field(..., description="Probabilities for exoplanet and no_planet")
    
    # Visualization data
    light_curve_data: List[float] = Field(..., description="Normalized flux values")
    time_points: List[float] = Field(..., description="Time in days")
    highlighted_regions: List[TransitRegion] = Field(default=[])
    
    # Metadata
    analysis: AnalysisMetadata
    
    # SHAP Explainability (optional - present when model supports it)
    shap_explanation: Optional[SHAPExplanation] = None
    
    model_version: str = "synthetic-v1.0"
    processing_time_ms: int
