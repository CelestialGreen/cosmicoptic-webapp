# 🔭 CosmicOptic - AI-Powered Exoplanet Discovery

<div align="center">

![CosmicOptic Banner](https://via.placeholder.com/1200x300/0D1117/00BFFF?text=CosmicOptic+-+Discover+the+Universe)

**Analyze stellar light curves and discover exoplanets using artificial intelligence**

[![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge%202025-blue)](https://www.spaceappschallenge.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![D3.js](https://img.shields.io/badge/D3.js-7.x-F9A03C?logo=d3.js)](https://d3js.org/)

**[Live Demo](#) | [Documentation](#-documentation) | [Challenge Details](CHALLENGE_DETAILS.md)**

</div>

---

## 🌟 Overview

CosmicOptic is a beautiful, interactive web application that uses machine learning to analyze stellar light curves and identify potential exoplanets. Built for the 2025 NASA Space Apps Challenge, it makes the thrill of astronomical discovery accessible to everyone.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Machine learning model classifies signals as confirmed exoplanets, candidates, or false positives
- 📊 **Interactive Visualizations** - D3.js-powered light curve charts with transit region highlighting
- 🎨 **Stunning UI** - Custom "Cosmic Glow" design system inspired by nebulae and deep space
- 🚀 **Smooth Animations** - Framer Motion for fluid, engaging interactions
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- 🔬 **Educational** - Learn about the transit method and exoplanet detection

---

## 🎯 The Challenge

**From NASA Space Apps 2025:**

> Data from several different space-based exoplanet surveying missions have enabled the discovery of thousands of new planets outside our solar system, but most of these exoplanets were identified manually. Your challenge is to create an AI/ML model that can analyze new data to accurately identify exoplanets.

We're solving this by creating an intuitive web platform that combines:
- Machine learning for automated classification
- Beautiful data visualization
- Educational content about exoplanet science

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** for backend
- **Node.js 18+** for frontend
- **Git** for version control

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/CelestialGreen/cosmicoptic.git
cd cosmicoptic/webapp
```

**2. Set up the backend**

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows (bash): source venv/Scripts/activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```

**3. Set up the frontend**

```bash
cd ../frontend
npm install
```

**4. Run the application**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**5. Open your browser**

Navigate to `http://localhost:5173` and start discovering exoplanets! 🌟

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- ⚛️ React 18 - UI framework
- 🎨 Framer Motion - Animations
- 📊 D3.js - Data visualization
- 🔄 Axios - API client
- ⚡ Vite - Build tool

**Backend:**
- 🐍 Python 3.10 - Runtime
- 🚀 FastAPI - Web framework
- 📊 NumPy - Numerical computation
- 🔬 Scikit-learn - Machine learning (future)
- 📦 Pydantic - Data validation

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (React SPA)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  DataInput  │  │ VerdictCard  │  │ LightCurve   │  │
│  │  Component  │  │  Component   │  │    Chart     │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/JSON API
┌────────────────────────▼────────────────────────────────┐
│                   Backend (FastAPI)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Prediction Service                      │  │
│  │  ┌────────────────┐    ┌─────────────────────┐  │  │
│  │  │   Synthetic    │ OR │   Real ML Model     │  │  │
│  │  │ Data Generator │    │   (Future Phase)    │  │  │
│  │  └────────────────┘    └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Design System

### Cosmic Glow Theme

Inspired by the beauty of deep space and the clarity of modern data visualization:

**Color Palette:**
```css
--bg-color: #0D1117          /* Deep Space */
--accent-color: #00BFFF       /* Deep Sky Blue */
--success-color: #32CD32      /* Lime Green - Confirmed Planets */
--highlight-color: #7FFF00    /* Chartreuse - Candidates/Transits */
--warning-color: #FF4500      /* Orange Red - False Positives */
```

**Key Visual Elements:**
- 🌌 Glassmorphism panels with backdrop blur
- ✨ Neon glow effects on interactive elements
- 🎭 Smooth animations and transitions
- 📊 Scientific data visualization

---

## 🔬 How It Works

### The Transit Method

CosmicOptic simulates the **transit method** of exoplanet detection:

1. **Observation** - Monitor a star's brightness over time
2. **Detection** - Identify periodic dips in brightness
3. **Analysis** - Determine if dips match planetary transit signature
4. **Classification** - AI classifies as planet, candidate, or false positive

### Sample Signals

We provide 8 diverse stellar signals:

**Confirmed Exoplanets:**
- 🪐 Kepler-186f - Earth-sized in habitable zone
- 🪐 Kepler-452b - Earth's cousin
- 🪐 TRAPPIST-1e - Rocky world

**Planetary Candidates:**
- 🌟 KOI-5123 - Weak signal
- 🌟 KOI-8888 - Noisy data

**False Positives:**
- ❌ EB-001 - Eclipsing binary
- ❌ VAR-002 - Variable star
- ❌ NOISE-003 - Instrumental noise

---

## 📊 Features in Detail

### 1. Data Input Interface

Select from pre-loaded stellar signals representing different astronomical phenomena. Clean, intuitive form with real-time validation.

### 2. AI Analysis

Backend processes the signal using either:
- **Phase 1:** Scientifically accurate synthetic data generator
- **Phase 2:** Trained machine learning model (easy hot-swap)

### 3. Verdict Card

Displays classification with:
- Confidence score (0-100%)
- Visual confidence bar
- Probability distribution across all classes
- Color-coded by classification type

### 4. Light Curve Chart

Interactive D3.js visualization showing:
- Normalized flux over time
- Highlighted transit regions
- Smooth line drawing animation
- Responsive design

### 5. Analysis Details

Shows extracted parameters:
- Orbital period (days)
- Transit duration (hours)
- Planet radius (Earth radii)
- Star name and discovery method

---

## 🔧 Development

### Project Structure

```
webapp/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── models/
│   │   └── schemas.py             # API data models
│   ├── services/
│   │   ├── prediction.py          # ML prediction service
│   │   └── data_generator.py     # Synthetic data generator
│   └── data/
│       └── samples.json           # Sample metadata
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Main component
    │   ├── index.css              # Global styles
    │   ├── components/
    │   │   ├── DataInput.jsx
    │   │   ├── ResultsDisplay.jsx
    │   │   ├── VerdictCard.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── LightCurveChart.jsx
    │   └── services/
    │       └── api.js             # API client
    └── package.json
```

### API Endpoints

**GET `/`**
- Health check endpoint
- Returns API status and version

**GET `/api/samples`**
- Lists all available sample signals
- Returns: `{ samples: [...] }`

**POST `/api/predict`**
- Analyzes a stellar signal
- Body: `{ sample_id: string }`
- Returns: `AnalysisResponse` with classification and visualization data

### Adding the Real Model

When your ML model is ready:

1. Place model file in `backend/models/saved/`
2. Update `backend/services/prediction.py`:
   - Load model in `__init__()`
   - Implement `_predict_with_model()`
   - Comment out `_predict_synthetic()`
3. Test with sample signals
4. Frontend works unchanged! ✨

See [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) for detailed instructions.

---

## 📚 Documentation

- **[CHALLENGE_DETAILS.md](CHALLENGE_DETAILS.md)** - NASA challenge requirements
- **[MASTER_PROJECT.md](MASTER_PROJECT.md)** - Original project vision
- **[IMPLEMENTATION_STRATEGY.md](IMPLEMENTATION_STRATEGY.md)** - Backend architecture guide
- **[FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md)** - UI components documentation
- **[QUICK_START_GUIDE.md](QUICK_START_GUIDE.md)** - Setup and workflow guide
- **[ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md)** - Project feasibility analysis

---

## 🧪 Testing

### Backend Tests

```bash
# Test health endpoint
curl http://localhost:8000/

# List samples
curl http://localhost:8000/api/samples

# Analyze signal
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"sample_id": "kepler-186f"}'
```

### Frontend Tests

1. Verify all UI components render correctly
2. Test dropdown selection
3. Trigger analysis and observe loading state
4. Verify results display with animations
5. Test all 8 sample signals
6. Check responsive design on mobile

---

## 🎓 Educational Value

CosmicOptic teaches users about:

- **Transit Method** - How planets are detected by star dimming
- **Light Curves** - Graphical representation of brightness over time
- **False Positives** - Eclipsing binaries, stellar variability, noise
- **Orbital Mechanics** - Period, duration, planet radius calculations
- **Machine Learning** - Classification confidence and probabilities

---

## 🏆 Competition Strategy

### What Makes CosmicOptic Stand Out

1. **Visual Excellence** - Most hackathon projects neglect design
2. **Scientific Accuracy** - Demonstrates domain knowledge
3. **User Experience** - Smooth, intuitive, engaging
4. **Architecture** - Professional, scalable, well-documented
5. **Educational Mission** - Appeals to NASA's outreach goals

---

## 🛣️ Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Backend with synthetic data
- [x] Frontend skeleton
- [x] Basic components
- [x] API integration

### Phase 2: Polish (In Progress)
- [ ] Smooth animations
- [ ] Advanced D3.js visualizations
- [ ] Error handling
- [ ] Responsive design

### Phase 3: Model Integration
- [ ] Integrate real ML model
- [ ] Real light curve data
- [ ] Performance optimization
- [ ] Comprehensive testing

### Phase 4: Future Enhancements
- [ ] User data upload
- [ ] Fold light curve feature
- [ ] Model performance metrics display
- [ ] Hyperparameter tuning interface
- [ ] Export results (JSON/CSV)
- [ ] Social sharing features

---

## 👥 Team

**CelestialGreen**

- **Frontend Team** - Building stunning UI/UX
- **Backend Team** - API and architecture
- **ML Team** - Training exoplanet detection model

Built with ❤️ for NASA Space Apps Challenge 2025

---

## 🙏 Acknowledgments

- **NASA** - For the Space Apps Challenge and open data
- **Kepler/TESS Missions** - For revolutionizing exoplanet science
- **Open Source Community** - For amazing tools and libraries

### Data Sources

- [NASA Exoplanet Archive](https://exoplanetarchive.ipasa.nasa.gov/)
- [MAST Archive](https://mast.stsci.edu/)
- [Exoplanet.eu Database](http://exoplanet.eu/)

### Technologies

- [React](https://react.dev/) - UI framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [D3.js](https://d3js.org/) - Data visualization
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

## 📄 License

This project is created for educational purposes as part of NASA Space Apps Challenge 2025.

---

## 📞 Contact

**Questions or feedback?**

- 🌐 Website: [Coming Soon]
- 💬 Discord: [Team Server]
- 📧 Email: team@celestialgreen.space

---

<div align="center">

**🌟 Discover the Universe, One Light Curve at a Time 🌟**

Made with 🔭 and ☕ during NASA Space Apps Challenge 2025

[⬆ Back to Top](#-cosmicoptic---ai-powered-exoplanet-discovery)

</div>
