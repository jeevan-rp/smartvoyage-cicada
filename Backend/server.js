const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const admin = require('firebase-admin');
const axios = require('axios');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const geohash = require('ngeohash');

// ==================== INITIALIZATION ====================

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://smart-voyage-cicada.firebaseio.com`,
  storageBucket: process.env.GCS_BUCKET_NAME || 'storageBucket-vendors'
});

const db = admin.database();
const auth = admin.auth();

// Initialize Firebase Storage
const bucket = admin.storage().bucket();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// ==================== MIDDLEWARE ====================

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Authentication middleware
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Error handler
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
}

// ==================== UTILITY FUNCTIONS ====================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateCarbonSaved(distanceKm, transportMode) {
  const emissions = {
    'car': 0.192,
    'bus': 0.089,
    'train': 0.041,
    'subway': 0.033,
    'bike': 0,
    'walking': 0
  };
  
  const carEmissions = distanceKm * emissions.car;
  const actualEmissions = distanceKm * (emissions[transportMode] || emissions.bus);
  return Math.max(0, carEmissions - actualEmissions);
}

function calculateLevel(stats) {
  const totalPoints = (stats.ecoPoints || 0) + (stats.communityPoints || 0);
  return Math.floor(totalPoints / 500) + 1;
}

function generateRedemptionCode() {
  return 'SP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function getNearbyGeohashes(centerHash) {
  const neighbors = geohash.neighbors(centerHash);
  return [centerHash, ...Object.values(neighbors)];
}

// ==================== POI & CROWD DATA ====================

const popularPOIs = {
  'mg_road_bangalore': {
    name: 'MG Road',
    location: { lat: 12.9752, lng: 77.6069 },
    capacity: 10000,
    currentLoad: 6500,
    ecoSensitivity: 'high'
  },
  'lalbagh_gardens': {
    name: 'Lalbagh Botanical Garden',
    location: { lat: 12.9507, lng: 77.5852 },
    capacity: 5000,
    currentLoad: 3200,
    ecoSensitivity: 'very_high'
  },
  'cubbon_park': {
    name: 'Cubbon Park',
    location: { lat: 12.9762, lng: 77.5938 },
    capacity: 8000,
    currentLoad: 1500,
    ecoSensitivity: 'high'
  },
  'bangalore_palace': {
    name: 'Bangalore Palace',
    location: { lat: 12.9989, lng: 77.5926 },
    capacity: 3000,
    currentLoad: 2800,
    ecoSensitivity: 'medium'
  }
};

const hiddenGems = {
  'visvesvaraya_museum': {
    name: 'Visvesvaraya Industrial & Technological Museum',
    location: { lat: 12.9768, lng: 77.5934 },
    category: 'museum',
    avgRating: 4.5,
    description: 'Fascinating science museum with interactive exhibits'
  },
  'ulsoor_lake': {
    name: 'Ulsoor Lake',
    location: { lat: 12.9796, lng: 77.6183 },
    category: 'nature',
    avgRating: 4.2,
    description: 'Scenic lake with boating facilities'
  },
  'karnataka_chitrakala_parishath': {
    name: 'Karnataka Chitrakala Parishath',
    location: { lat: 12.9615, lng: 77.5956 },
    category: 'art_gallery',
    avgRating: 4.6,
    description: 'Art gallery showcasing traditional and contemporary art'
  }
};

function generateCrowdPrediction(poi, date = null, time = null) {
  const now = new Date();
  const dayOfWeek = date ? new Date(date).getDay() : now.getDay();
  const hour = time ? parseInt(time.split(':')[0]) : now.getHours();
  
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  let basePercentage = isWeekend ? 70 : 50;
  
  if (hour >= 10 && hour <= 11) basePercentage += 20;
  else if (hour >= 12 && hour <= 14) basePercentage += 30;
  else if (hour >= 16 && hour <= 18) basePercentage += 25;
  else if (hour >= 20) basePercentage -= 40;
  else if (hour <= 8) basePercentage -= 50;
  
  if (poi.ecoSensitivity === 'very_high') basePercentage += 15;
  else if (poi.ecoSensitivity === 'high') basePercentage += 10;
  
  const percentage = Math.min(100, Math.max(0, basePercentage));
  
  let level = 'low';
  if (percentage >= 80) level = 'very_high';
  else if (percentage >= 60) level = 'high';
  else if (percentage >= 40) level = 'moderate';
  else if (percentage >= 20) level = 'low';
  else level = 'very_low';
  
  let bestTime = 'Early morning (before 9 AM)';
  if (percentage > 70) bestTime = 'Late evening (after 7 PM) or weekday mornings';
  
  return { percentage, level, bestTime, recommendation: percentage > 70 ? 'Avoid visiting during peak hours' : 'Good time to visit' };
}

function getCurrentCrowdStatus(poi) {
  const randomFactor = Math.random() * 20 - 10;
  const currentPercentage = Math.min(100, Math.max(0, poi.currentLoad / poi.capacity * 100 + randomFactor));
  
  let level = 'moderate';
  if (currentPercentage >= 80) level = 'very_high';
  else if (currentPercentage >= 60) level = 'high';
  else if (currentPercentage >= 40) level = 'moderate';
  else level = 'low';
  
  return {
    currentLoad: Math.round(poi.currentLoad * (1 + randomFactor / 100)),
    capacity: poi.capacity,
    percentage: Math.round(currentPercentage),
    level,
    lastUpdated: new Date().toISOString()
  };
}

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), service: 'SmartVoyage API' });
});

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, userType = 'traveler' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const userRecord = await auth.createUser({ email, password, displayName });
    
    const userData = {
      uid: userRecord.uid,
      email,
      displayName,
      userType,
      createdAt: new Date().toISOString(),
      preferences: { ecoPreference: 'balanced', favoriteCategories: [], savedPlaces: [] },
      stats: {
        totalCarbonSaved: 0,
        totalLocalSpend: 0,
        ecoPoints: 0,
        communityPoints: 0,
        routesCompleted: 0,
        vendorsVisited: 0
      }
    };
    
    await db.ref('users/' + userRecord.uid).set(userData);
    const customToken = await auth.createCustomToken(userRecord.uid);
    
    res.status(201).json({ message: 'User created successfully', user: { uid: userRecord.uid, email, displayName }, token: customToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Google Login/Registration
app.post('/api/auth/google-login', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'ID Token required' });

    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.ref('users/' + uid);
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
      const userData = {
        uid,
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
        userType: 'traveler',
        createdAt: new Date().toISOString(),
        preferences: { ecoPreference: 'balanced', favoriteCategories: [], savedPlaces: [] },
        stats: {
          totalCarbonSaved: 0,
          totalLocalSpend: 0,
          ecoPoints: 0,
          communityPoints: 0,
          routesCompleted: 0,
          vendorsVisited: 0
        }
      };
      await userRef.set(userData);
      return res.status(201).json({ message: 'User registered via Google', user: userData });
    }

    res.json({ message: 'Login successful', user: snapshot.val() });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('users/' + req.user.uid).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'User not found' });
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateUser, async (req, res) => {
  try {
    const { displayName, preferences } = req.body;
    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (preferences) updates.preferences = preferences;
    
    await db.ref('users/' + req.user.uid).update(updates);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ECO-ROUTING ENDPOINTS ====================

// Calculate eco-friendly route
app.post('/api/routing/calculate', authenticateUser, async (req, res) => {
  try {
    const { origin, destination, waypoints = [], travelMode = 'TRANSIT' } = req.body;
    
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination required' });
    }
    
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    
    const formatLocation = (location) => {
      if (typeof location === 'string') return { address: location };
      if (location.lat && location.lng) return { latLng: { latitude: location.lat, longitude: location.lng } };
      return { address: location.address || '' };
    };
    
    const requestBody = {
      origin: formatLocation(origin),
      destination: formatLocation(destination),
      travelMode: travelMode.toUpperCase(),
      computeAlternativeRoutes: true,
      routingPreference: 'TRAFFIC_AWARE',
      polylineQuality: 'HIGH_QUALITY'
    };
    
    if (waypoints.length > 0) {
      requestBody.intermediates = waypoints.map(wp => formatLocation(wp));
    }
    
    if (travelMode === 'TRANSIT') {
      requestBody.transitPreferences = {
        allowedTravelModes: ['BUS', 'SUBWAY', 'TRAIN', 'TRAM', 'RAIL'],
        routingPreference: 'LESS_WALKING'
      };
    }
    
    const response = await axios.post(ROUTES_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs'
      }
    });
    
    if (!response.data.routes || response.data.routes.length === 0) {
      return res.status(404).json({ error: 'No routes found' });
    }
    
    const routes = response.data.routes.map((route, index) => {
      const distanceKm = route.distanceMeters / 1000;
      const carbonSaved = calculateCarbonSaved(distanceKm, travelMode.toLowerCase());
      
      return {
        routeId: generateId(),
        rank: index + 1,
        distanceMeters: route.distanceMeters,
        distanceKm: distanceKm,
        durationSeconds: parseInt(route.duration.replace('s', '')),
        durationMinutes: Math.round(parseInt(route.duration.replace('s', '')) / 60),
        polyline: route.polyline.encodedPolyline,
        carbonSavedKg: carbonSaved,
        carbonSavedGrams: carbonSaved * 1000,
        legs: route.legs?.map(leg => ({
          startLocation: leg.startLocation?.latLng,
          endLocation: leg.endLocation?.latLng,
          distanceMeters: leg.distanceMeters,
          durationSeconds: parseInt(leg.duration?.replace('s', '') || '0')
        })) || []
      };
    });
    
    const routeData = {
      routeId: routes[0].routeId,
      userId: req.user.uid,
      origin,
      destination,
      waypoints,
      travelMode,
      calculatedAt: new Date().toISOString(),
      routes: routes
    };
    
    await db.ref('routes/' + routes[0].routeId).set(routeData);
    
    await db.ref('users/' + req.user.uid).update({
      'stats/totalCarbonSaved': admin.database.ServerValue.increment(routes[0].carbonSavedKg),
      'stats/routesCompleted': admin.database.ServerValue.increment(1)
    });
    
    res.json({ success: true, routes: routes, ecoTips: [`🚆 Using public transit reduces CO2 emissions by 70% compared to driving`, `💚 You saved ${routes[0].carbonSavedKg.toFixed(2)} kg of CO2 on this trip`] });
  } catch (error) {
    console.error('Routing error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to calculate route' });
  }
});

// Get user's route history
app.get('/api/routing/history', authenticateUser, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const snapshot = await db.ref('routes')
      .orderByChild('userId')
      .equalTo(req.user.uid)
      .limitToLast(parseInt(limit))
      .once('value');
    
    const routes = [];
    snapshot.forEach(child => {
      routes.unshift(child.val());
    });
    res.json({ routes, total: routes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LOCAL DISCOVERY ENDPOINTS ====================

// Search nearby vendors
app.get('/api/discovery/search', authenticateUser, async (req, res) => {
  try {
    const { lat, lng, radius = 5, category, isLocallyOwned = true, limit = 20 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }
    
    let snapshot = await db.ref('vendors').orderByChild('isActive').equalTo(true).once('value');
    const vendors = [];
    
    snapshot.forEach(child => {
      const vendor = child.val();
      if (isLocallyOwned === 'true' && !vendor.isLocallyOwned) return;
      if (category && vendor.businessType !== category) return;
      
      const distance = calculateDistance(parseFloat(lat), parseFloat(lng), vendor.location.lat, vendor.location.lng);
      if (distance <= parseFloat(radius)) {
        vendors.push({ vendorId: child.key, ...vendor, distanceKm: distance, distanceMeters: Math.round(distance * 1000) });
      }
    });
    
    vendors.sort((a, b) => a.distanceKm - b.distanceKm);
    res.json({ success: true, total: vendors.length, vendors: vendors.slice(0, parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor details
app.get('/api/discovery/vendor/:vendorId', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('vendors/' + req.params.vendorId).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Vendor not found' });
    
    await db.ref('vendors/' + req.params.vendorId).update({
      'stats/views': admin.database.ServerValue.increment(1)
    });
    
    res.json({ vendorId: snapshot.key, ...snapshot.val() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personalized recommendations
app.get('/api/discovery/recommendations', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const preferences = userDoc.data()?.preferences || {};
    
    const recommendations = [];
    const categoriesToTry = preferences.favoriteCategories?.length > 0 ? preferences.favoriteCategories.slice(0, 3) : ['restaurant', 'cafe', 'museum'];
    
    for (const category of categoriesToTry) {
      const snapshot = await db.ref('vendors')
        .orderByChild('businessType')
        .equalTo(category)
        .limitToFirst(5)
        .once('value');
      
      snapshot.forEach(child => {
        const vendor = child.val();
        if (vendor.isActive) {
          recommendations.push({ vendorId: child.key, ...vendor });
        }
      });
    }
    
    recommendations.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    res.json({ success: true, recommendations: recommendations.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-in at vendor
app.post('/api/discovery/checkin', authenticateUser, async (req, res) => {
  try {
    const { vendorId } = req.body;
    if (!vendorId) return res.status(400).json({ error: 'Vendor ID required' });
    
    const snapshot = await db.ref('vendors/' + vendorId).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Vendor not found' });
    
    const vendor = snapshot.val();
    const today = new Date().toISOString().split('T')[0];
    const checkinId = `${req.user.uid}_${vendorId}_${today}`;
    const checkinRef = db.ref('checkins/' + checkinId);
    const existingCheckin = await checkinRef.once('value');
    
    if (existingCheckin.exists()) {
      return res.status(400).json({ error: 'Already checked in today' });
    }
    
    await checkinRef.set({
      userId: req.user.uid,
      vendorId,
      vendorName: vendor.name,
      timestamp: new Date().toISOString(),
      date: today,
      pointsEarned: vendor.loyaltyPointsValue || 50
    });
    
    await db.ref('users/' + req.user.uid).update({
      'stats/totalLocalSpend': admin.database.ServerValue.increment(100),
      'stats/communityPoints': admin.database.ServerValue.increment(vendor.loyaltyPointsValue || 50),
      'stats/vendorsVisited': admin.database.ServerValue.increment(1)
    });
    
    await db.ref('vendors/' + vendorId).update({
      'stats/totalCheckins': admin.database.ServerValue.increment(1),
      'stats/lastCheckinAt': new Date().toISOString()
    });
    
    res.json({ success: true, message: `Checked in at ${vendor.name}`, pointsEarned: vendor.loyaltyPointsValue || 50 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CROWD DISPERSAL ENDPOINTS ====================

// Get crowd prediction for a POI
app.post('/api/crowd/predict', authenticateUser, async (req, res) => {
  try {
    const { poiId, date, time } = req.body;
    if (!poiId || !popularPOIs[poiId]) return res.status(400).json({ error: 'Invalid POI ID' });
    
    const poi = popularPOIs[poiId];
    const prediction = generateCrowdPrediction(poi, date, time);
    const isOvercrowded = prediction.percentage >= 80;
    
    let alternatives = [];
    if (isOvercrowded) {
      for (const [gemId, gem] of Object.entries(hiddenGems)) {
        const distance = calculateDistance(poi.location.lat, poi.location.lng, gem.location.lat, gem.location.lng);
        if (distance <= 5) {
          alternatives.push({ id: gemId, name: gem.name, distanceKm: distance, category: gem.category, rating: gem.avgRating, description: gem.description });
        }
      }
      alternatives.sort((a, b) => a.distanceKm - b.distanceKm);
      alternatives = alternatives.slice(0, 3);
    }
    
    res.json({
      success: true,
      poi: { id: poiId, name: poi.name, location: poi.location },
      crowdPrediction: prediction,
      isOvercrowded,
      alternatives,
      recommendation: isOvercrowded ? `This location is expected to be very crowded (${prediction.percentage}% capacity). Consider nearby alternatives.` : `Good time to visit! Crowd level is ${prediction.level}.`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get real-time crowd data
app.get('/api/crowd/live', authenticateUser, async (req, res) => {
  try {
    const nearbyPOIs = [];
    for (const [poiId, poi] of Object.entries(popularPOIs)) {
      const crowdStatus = getCurrentCrowdStatus(poi);
      nearbyPOIs.push({ id: poiId, name: poi.name, location: poi.location, ...crowdStatus });
    }
    nearbyPOIs.sort((a, b) => b.percentage - a.percentage);
    res.json({ success: true, total: nearbyPOIs.length, pois: nearbyPOIs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optimize itinerary to avoid crowds
app.post('/api/crowd/optimize-itinerary', authenticateUser, async (req, res) => {
  try {
    const { desiredPOIs } = req.body;
    if (!desiredPOIs || !Array.isArray(desiredPOIs)) {
      return res.status(400).json({ error: 'Desired POIs array required' });
    }
    
    const poiPredictions = [];
    for (const poiId of desiredPOIs) {
      if (popularPOIs[poiId]) {
        const prediction = generateCrowdPrediction(popularPOIs[poiId]);
        poiPredictions.push({
          id: poiId,
          name: popularPOIs[poiId].name,
          location: popularPOIs[poiId].location,
          crowdPercentage: prediction.percentage,
          crowdLevel: prediction.level,
          bestTimeToVisit: prediction.bestTime
        });
      }
    }
    
    poiPredictions.sort((a, b) => a.crowdPercentage - b.crowdPercentage);
    const optimalOrder = poiPredictions.map((poi, index) => ({
      poi: poi.name,
      suggestedTime: `${9 + index * 2}:00`,
      expectedCrowdLevel: poi.crowdLevel,
      duration: '1-2 hours'
    }));
    
    res.json({ success: true, originalPOIs: desiredPOIs, optimizedOrder: optimalOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GAMIFICATION ENDPOINTS ====================

// Get user impact dashboard
app.get('/api/gamification/dashboard', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('users/' + req.user.uid).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'User not found' });
    
    const userData = snapshot.val();
    const stats = userData.stats || {};
    
    const treesPlantedEquivalent = Math.floor(stats.totalCarbonSaved / 22);
    const achievements = [];
    if (stats.routesCompleted >= 1) achievements.push({ name: 'First Journey', description: 'Completed your first eco-friendly route', icon: '🌟' });
    if (stats.totalCarbonSaved >= 100) achievements.push({ name: 'Carbon Champion', description: 'Saved 100+ kg of CO2', icon: '🌍' });
    if (stats.vendorsVisited >= 5) achievements.push({ name: 'Local Explorer', description: 'Visited 5 local businesses', icon: '🏪' });
    
    res.json({
      user: { name: userData.displayName, memberSince: userData.createdAt },
      impact: { carbonSavedKg: stats.totalCarbonSaved || 0, treesEquivalent: treesPlantedEquivalent, localSpendINR: stats.totalLocalSpend || 0 },
      gamification: {
        totalPoints: (stats.ecoPoints || 0) + (stats.communityPoints || 0),
        ecoPoints: stats.ecoPoints || 0,
        communityPoints: stats.communityPoints || 0,
        level: calculateLevel(stats),
        achievements
      },
      activity: { totalRoutes: stats.routesCompleted || 0, totalVendors: stats.vendorsVisited || 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
app.get('/api/gamification/leaderboard', authenticateUser, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const snapshot = await db.ref('users')
      .orderByChild('stats/ecoPoints')
      .limitToLast(parseInt(limit))
      .once('value');
    
    const leaderboard = [];
    snapshot.forEach(child => {
      const userData = child.val();
      leaderboard.push({
        userId: child.key,
        name: userData.displayName,
        points: userData.stats?.ecoPoints || 0,
        carbonSaved: userData.stats?.totalCarbonSaved || 0,
        routesCompleted: userData.stats?.routesCompleted || 0
      });
    });
    
    leaderboard.reverse();
    leaderboard.forEach((item, index) => item.rank = index + 1);
    
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Earn points for eco-friendly route
app.post('/api/gamification/earn-points', authenticateUser, async (req, res) => {
  try {
    const { routeId, points, carbonSaved } = req.body;
    if (!routeId || !points) return res.status(400).json({ error: 'Route ID and points required' });
    
    const snapshot = await db.ref('rewards')
      .orderByChild('routeId')
      .equalTo(routeId)
      .once('value');
    
    let alreadyAwarded = false;
    snapshot.forEach(child => {
      if (child.val().userId === req.user.uid) alreadyAwarded = true;
    });
    
    if (alreadyAwarded) {
      return res.status(400).json({ error: 'Points already awarded for this route' });
    }
    
    await db.ref('users/' + req.user.uid).update({
      'stats/ecoPoints': admin.database.ServerValue.increment(points)
    });
    
    await db.ref('rewards').push({
      userId: req.user.uid,
      routeId,
      type: 'eco_route',
      points,
      carbonSaved,
      awardedAt: new Date().toISOString()
    });
    
    res.json({ success: true, pointsEarned: points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Redeem points for reward
app.post('/api/gamification/redeem', authenticateUser, async (req, res) => {
  try {
    const { vendorId, pointsToRedeem } = req.body;
    if (!vendorId || !pointsToRedeem) return res.status(400).json({ error: 'Vendor ID and points required' });
    
    const snapshot = await db.ref('users/' + req.user.uid).once('value');
    const userData = snapshot.val();
    const totalPoints = (userData.stats?.ecoPoints || 0) + (userData.stats?.communityPoints || 0);
    
    if (totalPoints < pointsToRedeem) {
      return res.status(400).json({ error: 'Insufficient points' });
    }
    
    let remainingPoints = pointsToRedeem;
    let communityPointsDeducted = Math.min(userData.stats?.communityPoints || 0, remainingPoints);
    remainingPoints -= communityPointsDeducted;
    let ecoPointsDeducted = remainingPoints;
    
    if (ecoPointsDeducted > 0) {
      await db.ref('users/' + req.user.uid).update({
        'stats/ecoPoints': admin.database.ServerValue.increment(-ecoPointsDeducted)
      });
    }
    if (communityPointsDeducted > 0) {
      await db.ref('users/' + req.user.uid).update({
        'stats/communityPoints': admin.database.ServerValue.increment(-communityPointsDeducted)
      });
    }
    
    await db.ref('redemptions').push({
      userId: req.user.uid,
      vendorId,
      pointsSpent: pointsToRedeem,
      redeemedAt: new Date().toISOString(),
      status: 'pending'
    });
    
    res.json({ success: true, pointsRedeemed: pointsToRedeem, remainingPoints: totalPoints - pointsToRedeem, redemptionCode: generateRedemptionCode() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available rewards
app.get('/api/gamification/rewards', authenticateUser, async (req, res) => {
  try {
    const snapshot = await db.ref('vendors').orderByChild('isActive').equalTo(true).once('value');
    const rewards = [];
    
    snapshot.forEach(child => {
      const vendor = child.val();
      rewards.push({
        vendorId: child.key,
        vendorName: vendor.name,
        rewardType: 'discount',
        description: `${vendor.loyaltyPointsValue || 50} points = 10% off on next purchase`,
        pointsRequired: vendor.loyaltyPointsValue || 50
      });
    });
    
    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VENDOR MANAGEMENT ENDPOINTS ====================

// Register new vendor
app.post('/api/vendor/register', authenticateUser, upload.array('photos', 5), async (req, res) => {
  try {
    const { name, description, businessType, address, lat, lng, contactPhone, contactEmail, priceRange, openingHours } = req.body;
    
    if (!name || !description || !businessType || !address || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const photoUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `vendors/${uuidv4()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });
        
        await new Promise((resolve, reject) => {
          blobStream.on('error', reject);
          blobStream.on('finish', resolve);
          blobStream.end(file.buffer);
        });
        
        await blob.makePublic();
        photoUrls.push(`https://storage.googleapis.com/${bucket.name}/${filename}`);
      }
    }
    
    const vendorData = {
      name,
      description,
      businessType,
      address,
      location: { lat: parseFloat(lat), lng: parseFloat(lng), geohash: geohash.encode(parseFloat(lat), parseFloat(lng)) },
      contactInfo: { phone: contactPhone, email: contactEmail },
      photos: photoUrls,
      priceRange: priceRange || 'moderate',
      openingHours: openingHours || '10:00-22:00',
      isActive: true,
      isCommunityVerified: false,
      isLocallyOwned: true,
      avgRating: 0,
      totalRatings: 0,
      loyaltyPointsValue: 50,
      stats: { views: 0, totalCheckins: 0, lastCheckinAt: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: req.user.uid
    };
    
    const vendorRef = db.ref('vendors').push();
    await vendorRef.set(vendorData);
    res.status(201).json({ success: true, vendorId: vendorRef.key, message: 'Vendor registered successfully' });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update vendor
app.put('/api/vendor/:vendorId', authenticateUser, upload.array('photos', 5), async (req, res) => {
  try {
    const snapshot = await db.ref('vendors/' + req.params.vendorId).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Vendor not found' });
    
    const vendor = snapshot.val();
    if (vendor.ownerId !== req.user.uid) {
      return res.status(403).json({ error: 'Unauthorized to update this vendor' });
    }
    
    const updates = { updatedAt: new Date().toISOString() };
    const allowedFields = ['name', 'description', 'address', 'priceRange', 'openingHours'];
    for (const field of allowedFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }
    
    if (req.body.lat && req.body.lng) {
      updates.location = {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng),
        geohash: geohash.encode(parseFloat(req.body.lat), parseFloat(req.body.lng))
      };
    }
    
    if (req.files && req.files.length > 0) {
      const newPhotoUrls = [];
      for (const file of req.files) {
        const filename = `vendors/${uuidv4()}_${file.originalname}`;
        const blob = bucket.file(filename);
        const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });
        
        await new Promise((resolve, reject) => {
          blobStream.on('error', reject);
          blobStream.on('finish', resolve);
          blobStream.end(file.buffer);
        });
        
        await blob.makePublic();
        newPhotoUrls.push(`https://storage.googleapis.com/${bucket.name}/${filename}`);
      }
      updates.photos = [...(vendor.photos || []), ...newPhotoUrls];
    }
    
    await db.ref('vendors/' + req.params.vendorId).update(updates);
    res.json({ success: true, message: 'Vendor updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review for vendor
app.post('/api/vendor/:vendorId/review', authenticateUser, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vendorId = req.params.vendorId;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const snapshot = await db.ref('vendors/' + vendorId).once('value');
    if (!snapshot.exists()) return res.status(404).json({ error: 'Vendor not found' });
    
    const reviewSnapshot = await db.ref('reviews')
      .orderByChild('vendorId')
      .equalTo(vendorId)
      .once('value');
    
    let alreadyReviewed = false;
    reviewSnapshot.forEach(child => {
      if (child.val().userId === req.user.uid) alreadyReviewed = true;
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You have already reviewed this vendor' });
    }
    
    await db.ref('reviews').push({
      vendorId,
      userId: req.user.uid,
      userName: req.user.name || 'Anonymous',
      rating: parseInt(rating),
      comment: comment || '',
      createdAt: new Date().toISOString()
    });
    
    const allReviewsSnapshot = await db.ref('reviews')
      .orderByChild('vendorId')
      .equalTo(vendorId)
      .once('value');
    
    let totalRating = 0;
    let reviewCount = 0;
    allReviewsSnapshot.forEach(child => {
      totalRating += child.val().rating;
      reviewCount++;
    });
    
    const newAvgRating = reviewCount > 0 ? totalRating / reviewCount : 0;
    
    await db.ref('vendors/' + vendorId).update({ avgRating: newAvgRating, totalRatings: reviewCount });
    
    res.json({ success: true, message: 'Review added successfully', newAverageRating: newAvgRating });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor reviews
app.get('/api/vendor/:vendorId/reviews', authenticateUser, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const snapshot = await db.ref('reviews')
      .orderByChild('vendorId')
      .equalTo(req.params.vendorId)
      .limitToLast(parseInt(limit))
      .once('value');
    
    const reviews = [];
    snapshot.forEach(child => {
      reviews.unshift({ reviewId: child.key, ...child.val() });
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ERROR HANDLING ====================

app.use(errorHandler);

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 SmartVoyage API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: /api/auth/register, /api/auth/profile`);
  console.log(`🗺️ Routing endpoints: /api/routing/calculate, /api/routing/history`);
  console.log(`🏪 Discovery endpoints: /api/discovery/search, /api/discovery/checkin`);
  console.log(`🤖 Crowd endpoints: /api/crowd/predict, /api/crowd/live`);
  console.log(`🎮 Gamification endpoints: /api/gamification/dashboard, /api/gamification/leaderboard`);
  console.log(`🏢 Vendor endpoints: /api/vendor/register, /api/vendor/:vendorId/review`);
});