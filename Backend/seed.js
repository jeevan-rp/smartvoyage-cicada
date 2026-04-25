const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://smart-voyage-cicada-default-rtdb.firebaseio.com'
});

const db = admin.database();

const vendors = {
  "v1": {
    "name": "Green Earth Bistro",
    "businessType": "restaurant",
    "description": "Organic farm-to-table dining with zero waste policies.",
    "location": { "lat": 12.9716, "lng": 77.5946 },
    "isActive": true,
    "isLocallyOwned": true,
    "avgRating": 4.8,
    "sustainabilityScore": 95,
    "impactDescription": "Uses 100% compostable packaging and sources from local urban farms.",
    "loyaltyPointsValue": 100,
    "stats": { "localImpact": 95, "totalCheckins": 120 }
  },
  "v2": {
    "name": "Ethical Threads",
    "businessType": "shopping",
    "description": "Sustainable fashion and accessories made from recycled materials.",
    "location": { "lat": 12.9752, "lng": 77.6069 },
    "isActive": true,
    "isLocallyOwned": true,
    "avgRating": 4.5,
    "sustainabilityScore": 88,
    "impactDescription": "Supports local weavers and uses natural dyes.",
    "loyaltyPointsValue": 50,
    "stats": { "localImpact": 85, "totalCheckins": 45 }
  },
  "v3": {
    "name": "EcoStay Bangalore",
    "businessType": "experience",
    "description": "Solar-powered boutique stay with rainwater harvesting.",
    "location": { "lat": 12.9507, "lng": 77.5852 },
    "isActive": true,
    "isLocallyOwned": false,
    "avgRating": 4.7,
    "sustainabilityScore": 92,
    "impactDescription": "Reduces water usage by 40% through greywater recycling.",
    "loyaltyPointsValue": 200,
    "stats": { "localImpact": 60, "totalCheckins": 310 }
  }
};

async function seed() {
  console.log('Seeding vendors...');
  await db.ref('vendors').set(vendors);
  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
