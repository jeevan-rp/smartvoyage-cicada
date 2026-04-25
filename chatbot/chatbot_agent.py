import os
import google.generativeai as genai
from dotenv import load_dotenv

from ai_core.capacity_predictor import CapacityPredictor
from ai_core.gem_retriever import GemRetriever

# Load environment variables (.env file)
load_dotenv()

class ChatbotAgent:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
        if api_key == "YOUR_GEMINI_API_KEY":
            print("[Warning] GEMINI_API_KEY not found in environment. Please add it to your .env file.")
            
        genai.configure(api_key=api_key)
        
        # Force the model to flash latest as requested
        model_name = "gemini-flash-latest"
        print(f"[Agent] Using model: {model_name}")
        self.model = genai.GenerativeModel(model_name)
        self.model = genai.GenerativeModel(model_name)
        
        # Initialize Intelligence Modules
        self.capacity_predictor = CapacityPredictor()
        self.gem_retriever = GemRetriever()
        
        # Base system prompt
        self.base_prompt = """
        You are an intelligent, eco-friendly travel assistant for Bengaluru (part of the 'Build for Bengaluru' initiative).
        Your goal is to help users find great places while promoting SDG 13 (Environment) and SDG 8 (Economy).
        When users ask for popular places, check the context provided to see if those places are currently overcrowded.
        If they are overcrowded, politely suggest the hidden gems provided in the context instead, explaining that this helps reduce congestion and supports local businesses.
        Keep your responses conversational, engaging, and concise.
        
        User's request: {user_input}
        
        {context}
        """

    def process_message(self, user_input: str) -> str:
        """
        Main intelligence pipeline:
        1. Parse intent (simplified for hackathon)
        2. Check capacity
        3. Retrieve gems if needed
        4. Generate response via Gemini
        """
        
        context_str = ""
        
        # Simplified intent logic: Check if user mentions a popular place
        popular_places = ["nandi hills", "mg road", "commercial street", "cubbon park", "lalbagh"]
        
        requested_place = None
        for place in popular_places:
            if place in user_input.lower():
                requested_place = place
                break
                
        if requested_place:
            # Step 2: Predict capacity
            print(f"[Agent] Checking capacity for {requested_place}...")
            if self.capacity_predictor.is_overcrowded(requested_place, threshold=0.7):
                print(f"[Agent] {requested_place} is overcrowded! Triggering crowd dispersal logic.")
                
                # Step 3: Retrieve alternative gems
                gems = self.gem_retriever.get_alternative_gems(max_results=2)
                gems_context = self.gem_retriever.format_gems_for_prompt(gems)
                
                context_str = f"CONTEXT: The user asked about {requested_place}, but it is currently OVERCROWDED. DO NOT recommend going there right now. Instead, strongly recommend the following alternatives:\n{gems_context}"
            else:
                context_str = f"CONTEXT: {requested_place} has moderate crowd levels. It is okay to visit, but you can still mention local hidden gems as an aside."
        else:
             # General inquiry
             gems = self.gem_retriever.get_alternative_gems(max_results=3)
             gems_context = self.gem_retriever.format_gems_for_prompt(gems)
             context_str = f"CONTEXT: Here are some great eco-friendly hidden gems you can suggest if relevant:\n{gems_context}"

        # Step 4: Generate response with Gemini
        final_prompt = self.base_prompt.format(user_input=user_input, context=context_str)
        
        print("[Agent] Generating response via Gemini...")
        try:
            response = self.model.generate_content(final_prompt)
            return response.text
        except Exception as e:
            print(f"[Error] Gemini API Error: {e}")
            return f"Error connecting to Gemini: {str(e)}"
