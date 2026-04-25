import datetime
import random

class CapacityPredictor:
    def __init__(self):
        # In a real scenario, this would load an XGBoost model.
        # e.g., self.model = xgb.Booster({'nthread': 4})
        # self.model.load_model('models/capacity_xgboost.model')
        pass

    def predict_crowd_level(self, location_name: str, current_time: datetime.datetime = None) -> float:
        """
        Predicts how crowded a location is.
        Returns a float between 0.0 (empty) and 1.0 (over capacity).
        """
        if current_time is None:
            current_time = datetime.datetime.now()
            
        # Mock logic based on time of day for the hackathon
        hour = current_time.hour
        is_weekend = current_time.weekday() >= 5
        
        base_crowd = 0.2
        if is_weekend:
            base_crowd += 0.3
            
        if 11 <= hour <= 15: # Lunch/midday peak
            base_crowd += 0.3
        elif 18 <= hour <= 21: # Evening peak
            base_crowd += 0.4
            
        # Add some random noise to simulate model variance
        prediction = min(1.0, base_crowd + random.uniform(-0.1, 0.1))
        
        print(f"[AI] Predicted crowd level for {location_name} at {current_time}: {prediction:.2f}")
        return prediction

    def is_overcrowded(self, location_name: str, threshold: float = 0.7) -> bool:
        """
        Helper method to determine if a place is too crowded and requires dispersal.
        """
        return self.predict_crowd_level(location_name) > threshold
