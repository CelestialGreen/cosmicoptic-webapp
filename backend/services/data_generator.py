import numpy as np
from typing import Tuple, List

class SyntheticLightCurveGenerator:
    """Generates realistic exoplanet transit light curves"""
    
    @staticmethod
    def calculate_realistic_depth(planet_radius_earth: float, star_radius_solar: float = 1.0) -> float:
        """
        Calculate physically accurate transit depth
        
        Transit depth = (R_planet / R_star)²
        
        Args:
            planet_radius_earth: Planet radius in Earth radii
            star_radius_solar: Star radius in Solar radii (default Sun-like)
        
        Returns:
            Transit depth as fraction (e.g., 0.01 = 1% dip)
        """
        # Constants
        R_earth = 6371  # km
        R_sun = 696000  # km
        
        # Convert to same units
        R_planet = planet_radius_earth * R_earth
        R_star = star_radius_solar * R_sun
        
        # Transit depth = (R_p / R_s)²
        depth = (R_planet / R_star) ** 2
        
        return depth
    
    @staticmethod
    def generate_confirmed_planet(
        period_days: float = 3.5,
        transit_depth: float = 0.01,
        transit_duration: float = 3.0,
        num_points: int = 1000,
        planet_radius_earth: float = None
    ) -> Tuple[List[float], List[float], List[dict]]:
        """
        Generate a clean planetary transit signal
        Returns: (time_points, flux_values, transit_regions)
        """
        # If planet_radius provided, calculate realistic depth
        if planet_radius_earth is not None:
            transit_depth = SyntheticLightCurveGenerator.calculate_realistic_depth(
                planet_radius_earth, star_radius_solar=1.0
            )
            # For small planets, make depth visible (amplify by 100x for demo purposes)
            # Real Kepler data processing does similar "detrending" to enhance signals
            if transit_depth < 0.0005:
                transit_depth *= 100  # Make Earth-sized planets detectable in demo
        
        time = np.linspace(0, 30, num_points)  # 30 days of observation
        flux = np.ones(num_points)  # Start with constant brightness
        
        # Add stellar noise (small variations)
        noise = np.random.normal(0, 0.0005, num_points)
        flux += noise
        
        # Add periodic transits with realistic duration
        transit_regions = []
        # Transit duration as fraction of orbital period (typically 2-5%)
        transit_width = min(0.04, transit_duration / (period_days * 24))  # Convert hours to days
        
        for i, t in enumerate(time):
            phase = (t % period_days) / period_days
            # Transit occurs around phase = 0.5
            phase_start = 0.5 - transit_width / 2
            phase_end = 0.5 + transit_width / 2
            
            if phase_start < phase < phase_end:
                # Create box-shaped transit with smooth edges (limb darkening approximation)
                # U-shaped bottom for realism
                relative_phase = (phase - 0.5) / (transit_width / 2)  # -1 to 1
                limb_factor = 1.0 - 0.1 * (1 - relative_phase**2)  # Slight U-shape
                depth_factor = transit_depth * limb_factor * (1 - abs(relative_phase) * 0.2)  # Smooth edges
                flux[i] -= depth_factor
                
                # Record transit region
                if not transit_regions or transit_regions[-1]['end_index'] < i - 10:
                    transit_regions.append({
                        'start_index': i,
                        'end_index': i,
                        'depth': depth_factor
                    })
                else:
                    transit_regions[-1]['end_index'] = i
                    transit_regions[-1]['depth'] = max(
                        transit_regions[-1]['depth'], 
                        depth_factor
                    )
        
        return time.tolist(), flux.tolist(), transit_regions
    
    @staticmethod
    def generate_false_positive(
        num_points: int = 1000,
        anomaly_type: str = "eclipsing_binary"
    ) -> Tuple[List[float], List[float], List[dict]]:
        """
        Generate false positive signals
        - eclipsing_binary: Deep, V-shaped dips
        - stellar_variability: Irregular brightness changes
        - noise: Just random noise
        """
        time = np.linspace(0, 30, num_points)
        flux = np.ones(num_points)
        
        if anomaly_type == "eclipsing_binary":
            # Deep, V-shaped eclipses (not planet-like)
            noise = np.random.normal(0, 0.001, num_points)
            flux += noise
            
            for t_center in [7, 14, 21]:  # Binary eclipses
                mask = np.abs(time - t_center) < 0.5
                flux[mask] -= 0.05 * (1 - np.abs(time[mask] - t_center) / 0.5)
            
            return time.tolist(), flux.tolist(), []
        
        elif anomaly_type == "stellar_variability":
            # Slow, sinusoidal variations (star pulsation)
            flux += 0.02 * np.sin(2 * np.pi * time / 10)
            flux += np.random.normal(0, 0.003, num_points)
            return time.tolist(), flux.tolist(), []
        
        else:  # pure noise
            flux += np.random.normal(0, 0.005, num_points)
            return time.tolist(), flux.tolist(), []
    
    @staticmethod
    def generate_candidate(
        num_points: int = 1000
    ) -> Tuple[List[float], List[float], List[dict]]:
        """
        Generate ambiguous signal (noisy planet or unclear data)
        """
        time = np.linspace(0, 30, num_points)
        flux = np.ones(num_points)
        
        # High noise
        noise = np.random.normal(0, 0.003, num_points)
        flux += noise
        
        # Weak transit signal
        period_days = 5.2
        transit_depth = 0.005  # Very shallow
        
        transit_regions = []
        for i, t in enumerate(time):
            phase = (t % period_days) / period_days
            if 0.48 < phase < 0.52:
                depth_factor = transit_depth
                flux[i] -= depth_factor
        
        return time.tolist(), flux.tolist(), transit_regions
