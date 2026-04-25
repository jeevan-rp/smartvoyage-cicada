import json
import os

class GemRetriever:
    def __init__(self, geojson_path: str = "data/hidden_gems.geojson"):
        # Load the GeoJSON dataset
        self.geojson_path = geojson_path
        self.gems = self._load_data()

    def _load_data(self):
        try:
            with open(self.geojson_path, 'r') as f:
                data = json.load(f)
                return data.get('features', [])
        except FileNotFoundError:
            print(f"[Warning] Could not find {self.geojson_path}. Returning empty list.")
            return []

    def get_alternative_gems(self, category: str = None, max_results: int = 3):
        """
        Retrieves hidden gems from the GeoJSON dataset.
        Filters by category if provided.
        """
        filtered_gems = self.gems
        if category:
            filtered_gems = [
                gem for gem in self.gems 
                if gem['properties'].get('category') == category
            ]
            
        # Sort by popularity score (lowest first) to promote truly hidden gems
        filtered_gems.sort(key=lambda x: x['properties'].get('popularity_score', 1.0))
        
        results = []
        for gem in filtered_gems[:max_results]:
            props = gem['properties']
            results.append({
                "name": props.get('name'),
                "description": props.get('description'),
                "category": props.get('category'),
                "eco_friendly": props.get('eco_friendly', False)
            })
            
        return results

    def format_gems_for_prompt(self, gems) -> str:
        """
        Formats the retrieved gems into a string suitable for injection into the Gemini prompt.
        """
        if not gems:
            return "No specific hidden gems found."
            
        prompt_context = "Here are some less-crowded hidden gems to suggest:\n"
        for i, gem in enumerate(gems, 1):
            prompt_context += f"{i}. {gem['name']} ({gem['category']}): {gem['description']} [Eco-friendly: {gem['eco_friendly']}]\n"
            
        return prompt_context
