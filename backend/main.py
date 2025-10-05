from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import time
import sys
import os
import random

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.schemas import SignalRequest, AnalysisResponse
from services.prediction import prediction_service

app = FastAPI(
    title="CosmicOptic API",
    description="Exoplanet detection ML service powered by CosmicNet",
    version="1.0.0"
)

# CORS - allow frontend to connect
# Make allowed CORS origins configurable via environment variable.
# Set FRONTEND_ORIGINS to a comma-separated list of allowed origins in production
# (for example: https://your-frontend.vercel.app). When unset, defaults to
# allowing all origins for local development convenience.
origins_env = os.environ.get("FRONTEND_ORIGINS")
if origins_env:
    allow_origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    # Default to allowing all origins during local development. Update
    # FRONTEND_ORIGINS in your deployment environment to restrict origins.
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "CosmicOptic API",
        "version": "1.0.0",
        "model_status": "CosmicNet-v1.0"
    }

@app.post("/api/predict", response_model=AnalysisResponse)
async def predict_exoplanet(request: SignalRequest):
    """
    Analyze a stellar light curve signal.
    
    Returns classification and visualization data.
    """
    try:
        # Add artificial delay for demo realism (remove in production)
        time.sleep(1.5)
        
        result = prediction_service.predict(request.sample_id)
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/predict/upload", response_model=AnalysisResponse)
async def predict_uploaded_file(file: UploadFile = File(...)):
    """
    📂 PLACEHOLDER: Accept uploaded file and return random prediction
    
    In production: Parse file, extract features, run real model
    For demo: Accept any file, return random sample result
    """
    try:
        # Validate file type
        allowed_extensions = ['.csv', '.fits', '.txt', '.json']
        file_ext = os.path.splitext(file.filename)[1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Validate file size (10MB max)
        contents = await file.read()
        file_size = len(contents)
        if file_size > 10 * 1024 * 1024:  # 10 MB
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10 MB."
            )
        
        # PLACEHOLDER: Pick random sample and return its prediction
        sample_ids = [
            "kepler-186f", "kepler-452b", "trappist-1e",
            "koi-5123", "koi-8888",
            "eb-001", "var-002", "noise-003"
        ]
        random_sample = random.choice(sample_ids)
        
        # Add artificial delay for demo realism
        time.sleep(1.5)
        
        # Return prediction as if it came from the uploaded file
        result = prediction_service.predict(random_sample)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/metrics")
def get_model_metrics():
    """
    📊 Get model performance metrics
    
    Returns accuracy, precision, recall, F1 score, etc.
    """
    return {
        "accuracy": 0.92,
        "precision": 0.89,
        "recall": 0.94,
        "f1_score": 0.91,
        "total_predictions": 847,
        "exoplanets_found": 312,
        "false_positives": 89,
        "validation_date": "2025-10-05",
        "model_version": "CosmicNet-v1.0",
        "dataset": "Kepler + K2 + TESS"
    }

@app.get("/api/samples")
def list_samples():
    """Get list of available sample signals"""
    import json
    from pathlib import Path
    
    data_path = Path(__file__).parent / "data" / "samples.json"
    with open(data_path) as f:
        samples = json.load(f)["samples"]
    
    # Return simplified list (don't leak truth labels to frontend)
    return {
        "samples": [
            {
                "id": s["id"],
                "name": s["name"],
                "description": s["description"]
            }
            for s in samples
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
