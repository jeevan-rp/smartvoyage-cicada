from fastapi import FastAPI
from pydantic import BaseModel
from chatbot_agent import ChatbotAgent
import uvicorn

app = FastAPI(title="Hidden Gems Chatbot AI API")
agent = ChatbotAgent()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint for Member 2 (Node.js) or the frontend to call the AI chatbot.
    """
    user_message = request.message
    
    # Process message through our intelligence layer
    reply = agent.process_message(user_message)
    
    return ChatResponse(reply=reply)

@app.get("/")
async def root():
    return {"message": "AI Intelligence Layer is running. Use /api/chat to talk to the bot."}

if __name__ == "__main__":
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
