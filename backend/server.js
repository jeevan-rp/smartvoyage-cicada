const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// ─── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SmartVoyage API is running' });
});

// ─── Bangalore Local Guide (Source of Truth) ─────────────────────────────────
const BANGALORE_GUIDE = {
    keywords: ['bangalore', 'bengaluru', 'blr', 'nandi hills', 'lalbagh', 'cubbon',
        'indiranagar', 'koramangala', 'mg road', 'whitefield', 'jayanagar',
        'malleshwaram', 'yelahanka', 'electronic city', 'basavanagudi', 'majestic'],
    hiddenGems: [
        "Turahalli Forest — Bangalore's only reserved forest inside city limits. A dawn hike here beats any tourist trail.",
        "Puttenahalli Lake, JP Nagar — A bird sanctuary with 180+ species; locals call it the city's best-kept secret.",
        "VV Puram Food Street — Tiny stalls serving authentic Masala Puri & Holige that no mainstream guide ever lists.",
        "Kadu Malleshwara Temple Garden — A 400-year-old temple complex, quieter than any park and more beautiful.",
        "Thottikallu Falls (Kanakapura Rd) — A hidden cascade 40 min from the city, virtually unknown to tourists.",
    ],
    localFoodSpots: [
        "Brahmin's Coffee Bar (Basavanagudi) — Legendary filter coffee & idli since 1947. Arrive before 9 AM or wait in line.",
        "CTR — Central Tiffin Room (Malleshwaram) — The definitive butter-benne masala dosa in all of Bangalore.",
        "Koshy's Restaurant (St. Marks Rd) — Old-world colonial charm and the best prawn curry in the city.",
        "Vidyarthi Bhavan (Gandhi Bazaar) — 80-year-old institution. The crispy dosa is a rite of passage for every visitor.",
        "Rameshwaram Cafe (Indiranagar) — The longest queues tell you everything you need to know about the quality.",
    ],
    ecoRoutePrefix: "Bangalore Metro (Purple & Green lines) covers most tourist zones efficiently. Hire a cycle for Cubbon Park & MG Road. BMTC Vajra AC buses connect the airport affordably.",
};

const PARIS_GUIDE = {
    keywords: ['paris', 'france', 'eiffel', 'louvre', 'montmartre', 'seine'],
    hiddenGems: [
        "Promenade Plantée (Coulée verte) — An elevated linear park built on a viaduct, predating NY's High Line.",
        "Le Caveau de la Huchette — An underground 16th-century jazz club where locals swing dance till dawn.",
        "Rue des Thermopyles — A cobbled, vine-covered street in the 14th arrondissement, free of crowds.",
        "Musée de la Vie Romantique — A quiet 19th-century villa with a hidden garden cafe.",
        "Canal Saint-Martin — Skip the Seine and enjoy wine with locals by the locks of this vibrant canal."
    ],
    localFoodSpots: [
        "Du Pain et des Idées — Their escargot chocolat-pistache is legendary.",
        "L'As du Fallafel — The best falafel in Le Marais, expect a fast-moving queue.",
        "Bouillon Chartier — Traditional, affordable French cuisine in a stunning Belle Époque dining room."
    ]
};

const isInBangalore = (dest = '') =>
    BANGALORE_GUIDE.keywords.some(k => dest.toLowerCase().includes(k));

const isInParis = (dest = '') =>
    PARIS_GUIDE.keywords.some(k => dest.toLowerCase().includes(k));


// ─── Existing: Basic Trip Prediction ─────────────────────────────────────────
app.post('/api/predict-trip', async (req, res) => {
    try {
        const { destination, origin } = req.body;
        if (!destination) return res.status(400).json({ error: 'Destination is required' });

        const prompt = `Act as an expert travel guide and eco-friendly route planner. 
        I want to travel from ${origin || 'my current location'} to ${destination}.
        Please provide:
        1. An eco-friendly route suggestion (e.g., public transport, walking, or low-emission routes) avoiding rushes.
        2. The best time of day or year to visit to avoid crowds.
        3. Predicted traffic or crowding conditions.
        4. A local hidden gem near the destination.
        
        Format the response in a JSON structure like this:
        {
            "ecoRoute": "Description of the eco-friendly route",
            "bestTime": "Recommended time to visit",
            "crowdPrediction": "Expected crowd/traffic levels",
            "hiddenGem": "Name and brief description of a hidden gem"
        }`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let parsedData;
        try {
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
            parsedData = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
        } catch {
            parsedData = { rawResponse: responseText };
        }
        res.json({ success: true, data: parsedData });
    } catch (error) {
        console.error('Error in predict-trip:', error.message || error);
        res.json({
            success: true,
            data: {
                ecoRoute: "Take the electric metro line and enjoy a short, scenic 10-minute walk through the local neighbourhood.",
                bestTime: "Early morning around 8:00 AM on weekdays to completely avoid major crowds.",
                crowdPrediction: "Expect heavy crowds at peak hours. Significantly quieter in the morning.",
                hiddenGem: "The Old Clocktower Cafe — a quiet, locally-owned spot just 2 streets away with amazing coffee.",
            },
        });
    }
});

// ─── New: Rich Community Concierge Trip Planner ───────────────────────────────
app.post('/api/plan-trip', async (req, res) => {
    try {
        const {
            origin,
            destination,
            days = 2,
            travelStyle = 'mid-range',
            travelerType = 'solo',
            transport = 'metro/bus',
        } = req.body;

        if (!destination) return res.status(400).json({ error: 'Destination is required' });

        const isBangalore = isInBangalore(destination);

        const prompt = `You are a warm, knowledgeable local travel concierge. Help a ${travelerType} traveler plan a ${days}-day ${travelStyle} trip from "${origin || 'current location'}" to "${destination}". Their preferred transport is: ${transport}.

Return ONLY a valid JSON object (no markdown, no extra text) using this exact schema:
{
  "ecoRoute": "2-3 sentence eco-friendly route description using ${transport}",
  "bestTime": "Best time of day and season to visit with reason",
  "crowdPrediction": "Expected crowd levels and peak/off-peak hours",
  "hiddenGems": ["hidden gem 1", "hidden gem 2", "hidden gem 3"],
  "itinerary": [
    { "day": 1, "title": "Day theme", "morning": "Morning plan", "afternoon": "Afternoon plan", "evening": "Evening plan" }
  ],
  "packingTips": ["tip1", "tip2", "tip3", "tip4"],
  "localFoodSpots": ["food spot 1", "food spot 2", "food spot 3"],
  "estimatedBudget": {
    "budget": "Daily estimate in INR for budget traveler",
    "midRange": "Daily estimate in INR for mid-range traveler",
    "luxury": "Daily estimate in INR for luxury traveler"
  }
}
Generate exactly ${days} objects in the itinerary array. Use friendly, adventurous language — not robotic.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        let parsed = {};
        try {
            const m = raw.match(/```json\n([\s\S]*?)\n```/) ||
                      raw.match(/```\n([\s\S]*?)\n```/) ||
                      raw.match(/(\{[\s\S]*\})/);
            parsed = JSON.parse(m ? m[1] : raw);
        } catch (e) {
            console.warn('JSON parse failed, using fallback');
        }

        // ── Apply Local Guide Overrides (Source of Truth) ──
        if (isBangalore) {
            parsed.hiddenGems = BANGALORE_GUIDE.hiddenGems;
            parsed.localFoodSpots = BANGALORE_GUIDE.localFoodSpots;
            parsed.ecoRoute = BANGALORE_GUIDE.ecoRoutePrefix + ' ' + (parsed.ecoRoute || '');
        }

        res.json({ success: true, data: parsed, localDataUsed: isBangalore });
    } catch (error) {
        console.error('Error in plan-trip:', error.message || error);
        const dest = req.body?.destination || 'your destination';
        const numDays = parseInt(req.body?.days) || 2;
        res.json({
            success: true,
            localDataUsed: isInBangalore(dest),
            data: {
                ecoRoute: `Take public transport or a shared EV auto to ${dest} — it's greener and often faster during peak hours.`,
                bestTime: 'Early morning (7–9 AM) — fewer crowds, golden light, and cooler temperatures.',
                crowdPrediction: 'Peak crowds on weekends from 11 AM–5 PM. Weekday mornings are your sweet spot.',
                hiddenGems: isInBangalore(dest)
                    ? BANGALORE_GUIDE.hiddenGems
                    : ['A quiet lane off the main road with local artisan shops', 'The rooftop café locals love but tourists miss', 'A sunrise viewpoint 15 min from the main attraction'],
                itinerary: Array.from({ length: numDays }, (_, i) => ({
                    day: i + 1,
                    title: `Day ${i + 1} — Explore & Discover`,
                    morning: 'Visit the main landmark early to beat the crowds and get the best light.',
                    afternoon: 'Wander through a local market and try authentic street food.',
                    evening: 'Sunset stroll through a nearby park or lakeside promenade.',
                })),
                packingTips: ['Reusable water bottle is a must', 'Comfortable walking shoes', 'Pack light — 1 bag rule', 'Download offline maps', 'Light rain jacket for evenings'],
                localFoodSpots: isInBangalore(dest)
                    ? BANGALORE_GUIDE.localFoodSpots
                    : ['Ask hotel staff for personal favourites', 'Long local queues = great food', 'Dawn street food stalls near markets are worth the early wake-up'],
                estimatedBudget: { budget: '₹800–1,200/day', midRange: '₹2,000–3,500/day', luxury: '₹6,000+/day' },
            },
        });
    }
});

// ─── Existing: Hidden Gem Alert ───────────────────────────────────────────────
app.post('/api/hidden-gem-alert', async (req, res) => {
    try {
        const busyLocation = req.body?.busyLocation || 'the main attraction';
        const alternativeGem = req.body?.alternativeGem || 'a nearby spot';

        const prompt = `Act as a local travel expert. The tourist is at a very crowded location: ${busyLocation}.
        I am suggesting they visit a nearby hidden gem instead: ${alternativeGem}.
        Write a short, persuasive "Why it's worth it" paragraph (max 3 sentences) explaining why ${alternativeGem} is a better, peaceful alternative right now.`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        res.json({ success: true, reason: result.response.text() });
    } catch (error) {
        console.error('Error in hidden-gem-alert:', error.message || error);
        res.json({
            success: true,
            reason: `While the main attraction is packed right now, ${req.body?.alternativeGem || 'this nearby spot'} offers a peaceful, authentic local experience that most tourists completely miss.`,
        });
    }
});

// ─── New: Chatbot Endpoint (RAG Logic & Guide-Speak) ──────────────────────────
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        // Context Integration: RAG Logic
        // Simulate extracting user context from history (budget, travel style, past destinations)
        const chatContext = history.map(h => `${h.role}: ${h.content}`).join('\\n');
        
        // Local Guides Data: Source of Truth
        let localDataContext = "";
        const msgLower = message.toLowerCase();
        
        if (isInParis(msgLower)) {
            localDataContext = `[LOCAL GUIDE DATA OVERRIDE] User is asking about Paris. 
            MUST highlight these Hidden Gems FIRST: ${PARIS_GUIDE.hiddenGems.join(' | ')}. 
            Mention these Local Food Spots: ${PARIS_GUIDE.localFoodSpots.join(' | ')}.
            Do NOT just list the Eiffel Tower or Louvre immediately without highlighting these hidden gems first.`;
        } else if (isInBangalore(msgLower)) {
            localDataContext = `[LOCAL GUIDE DATA OVERRIDE] User is asking about Bangalore.
            MUST highlight these Hidden Gems FIRST: ${BANGALORE_GUIDE.hiddenGems.join(' | ')}.
            Mention these Local Food Spots: ${BANGALORE_GUIDE.localFoodSpots.join(' | ')}.`;
        }
        
        const systemPrompt = `You are the SmartVoyage AI Travel Guide.
        Output Style Requirements: "Guide-Speak" — Use friendly, adventurous language. Do NOT sound like a robot. You are a local insider.
        
        RAG Logic Rules:
        1. Context Integration: Analyze the user's message and past history (provided below) to tailor budget, travel style, and references to past destinations.
        2. Local Guides Data (Source of Truth): If local guide data is provided, you MUST use it. Override any generic suggestions with the local data and cite the "SmartVoyage Local Guides" as your source.
        3. Fallback: Only use generic knowledge if the local guide data is sparse or missing for the destination.

        Recent Conversation History:
        ${chatContext}
        
        ${localDataContext ? '\\nLOCAL GUIDE DATA TO ENFORCE:\\n' + localDataContext : ''}
        
        User's New Message: "${message}"`;

        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent(systemPrompt);
        
        res.json({ success: true, reply: result.response.text() });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ success: false, reply: "Oops! My compass is spinning wildly. Could you repeat that? 🧭" });
    }
});

// ─── Community Connect API ─────────────────────────────────────────────────────
const GUIDES = [
  {
    id: 'g1',
    name: 'Elena R.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    contributionLevel: 'Gold',
    contributionMetrics: {
      totalToursGiven: 42,
      totalMessagesReplied: 312,
      responseTimeAvgMinutes: 15,
      travelerRatings: [5, 5, 4, 5, 5],
      tipsShared: 89
    },
    badges: ['Fast Responder', 'Art Expert'],
    expertise: 'Historical Center & Art'
  },
  {
    id: 'g2',
    name: 'Marco T.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    contributionLevel: 'Platinum',
    contributionMetrics: {
      totalToursGiven: 120,
      totalMessagesReplied: 840,
      responseTimeAvgMinutes: 5,
      travelerRatings: [5, 4, 5, 5, 4, 5],
      tipsShared: 215
    },
    badges: ['Top Guide', 'Foodie'],
    expertise: 'Street Food & Nightlife'
  }
];

app.get('/api/guides', (req, res) => {
    res.json({ success: true, guides: GUIDES });
});

// ─── Socket.io for Community Connect ─────────────────────────────────────────
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

io.on('connection', (socket) => {
    console.log('Community Connect: ' + socket.id);
    socket.on('send_message', (data) => {
        setTimeout(() => {
            socket.emit('receive_message', {
                text: "Thanks for reaching out! I'd love to help you plan your visit. Are you looking for food recommendations or cultural sites?",
                from: data.to,
            });
        }, 1500);
    });
    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
