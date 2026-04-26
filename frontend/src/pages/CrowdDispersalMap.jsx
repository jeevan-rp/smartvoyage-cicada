import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { AlertTriangle, MapPin, Leaf, TrendingUp, Loader } from 'lucide-react';

// Bangalore landmarks and hidden gems
const landmarks = [
  // Central Bangalore
  { id: 1,  name: "MG Road",                   lat: 12.9757, lng: 77.6011, capacity: 100, currentTraffic: 95, isCrowded: true,  gem: "Ulsoor Lake Walkway",             gemLat: 12.9846, gemLng: 77.6201, co2Saved: "0.6kg" },
  { id: 2,  name: "Cubbon Park",               lat: 12.9763, lng: 77.5929, capacity: 100, currentTraffic: 40, isCrowded: false, gem: "Bangalore Aquarium",              gemLat: 12.9756, gemLng: 77.5944, co2Saved: "0.2kg" },
  { id: 3,  name: "Commercial Street",         lat: 12.9811, lng: 77.6074, capacity: 100, currentTraffic: 96, isCrowded: true,  gem: "Frazer Town Mosque Street",       gemLat: 12.9877, gemLng: 77.6144, co2Saved: "0.5kg" },
  { id: 4,  name: "Vidhana Soudha",            lat: 12.9794, lng: 77.5906, capacity: 100, currentTraffic: 70, isCrowded: true,  gem: "High Court Garden",               gemLat: 12.9783, gemLng: 77.5873, co2Saved: "0.2kg" },
  { id: 5,  name: "UB City Mall",              lat: 12.9716, lng: 77.5946, capacity: 100, currentTraffic: 30, isCrowded: false, gem: "Visvesvaraya Industrial Museum",  gemLat: 12.9785, gemLng: 77.5920, co2Saved: "0.3kg" },
  { id: 6,  name: "Majestic Bus Stand (KBS)",  lat: 12.9771, lng: 77.5716, capacity: 100, currentTraffic: 98, isCrowded: true,  gem: "Tipu Sultan's Summer Palace",     gemLat: 12.9607, gemLng: 77.5767, co2Saved: "0.5kg" },
  // North Bangalore
  { id: 7,  name: "Bangalore Palace",          lat: 12.9987, lng: 77.5922, capacity: 100, currentTraffic: 55, isCrowded: false, gem: "Sankey Tank & Garden",            gemLat: 13.0100, gemLng: 77.5764, co2Saved: "0.3kg" },
  { id: 8,  name: "Malleswaram Market",        lat: 13.0035, lng: 77.5660, capacity: 100, currentTraffic: 84, isCrowded: true,  gem: "Kadu Malleshwara Temple",         gemLat: 13.0094, gemLng: 77.5602, co2Saved: "0.3kg" },
  { id: 9,  name: "ISKCON Temple Rajajinagar", lat: 13.0099, lng: 77.5514, capacity: 100, currentTraffic: 78, isCrowded: true,  gem: "Nandini Layout Lake",             gemLat: 13.0229, gemLng: 77.5381, co2Saved: "0.4kg" },
  { id: 10, name: "Orion Mall Rajajinagar",    lat: 13.0062, lng: 77.5552, capacity: 100, currentTraffic: 89, isCrowded: true,  gem: "Seshadripuram Heritage Walk",     gemLat: 13.0004, gemLng: 77.5660, co2Saved: "0.3kg" },
  { id: 11, name: "Hebbal Flyover",            lat: 13.0358, lng: 77.5970, capacity: 100, currentTraffic: 90, isCrowded: true,  gem: "Hebbal Lake Bird Watching",       gemLat: 13.0451, gemLng: 77.5903, co2Saved: "0.5kg" },
  { id: 12, name: "Yelahanka New Town",        lat: 13.1005, lng: 77.5963, capacity: 100, currentTraffic: 28, isCrowded: false, gem: "Yelahanka Lake Viewpoint",        gemLat: 13.1056, gemLng: 77.5898, co2Saved: "0.2kg" },
  { id: 13, name: "Nandi Hills",               lat: 13.3702, lng: 77.6835, capacity: 100, currentTraffic: 92, isCrowded: true,  gem: "Bhoga Nandeeshwara Temple",       gemLat: 13.3608, gemLng: 77.7197, co2Saved: "0.8kg" },
  // South Bangalore
  { id: 14, name: "Lalbagh Botanical Garden",  lat: 12.9507, lng: 77.5848, capacity: 100, currentTraffic: 88, isCrowded: true,  gem: "Bull Temple & Dodda Ganesha",     gemLat: 12.9433, gemLng: 77.5718, co2Saved: "0.4kg" },
  { id: 15, name: "Jayanagar 4th Block",       lat: 12.9302, lng: 77.5838, capacity: 100, currentTraffic: 35, isCrowded: false, gem: "Yediyur Lake Park",               gemLat: 12.9190, gemLng: 77.5747, co2Saved: "0.2kg" },
  { id: 16, name: "Banashankari Temple",       lat: 12.9257, lng: 77.5492, capacity: 100, currentTraffic: 82, isCrowded: true,  gem: "Turahalli Forest Walk",           gemLat: 12.8943, gemLng: 77.5459, co2Saved: "0.6kg" },
  { id: 17, name: "JP Nagar",                  lat: 12.9077, lng: 77.5856, capacity: 100, currentTraffic: 38, isCrowded: false, gem: "Puttenahalli Lake Bird Sanctuary", gemLat: 12.8969, gemLng: 77.5946, co2Saved: "0.2kg" },
  { id: 18, name: "BTM Layout",                lat: 12.9166, lng: 77.6101, capacity: 100, currentTraffic: 60, isCrowded: false, gem: "Madiwala Lake Promenade",         gemLat: 12.9202, gemLng: 77.6228, co2Saved: "0.3kg" },
  { id: 19, name: "Electronic City Phase 1",   lat: 12.8399, lng: 77.6770, capacity: 100, currentTraffic: 65, isCrowded: false, gem: "Muthyalamaduvu Waterfalls",       gemLat: 12.7832, gemLng: 77.6500, co2Saved: "0.5kg" },
  { id: 20, name: "Chamrajpet",                lat: 12.9617, lng: 77.5554, capacity: 100, currentTraffic: 76, isCrowded: true,  gem: "Basavanagudi Art District",       gemLat: 12.9428, gemLng: 77.5738, co2Saved: "0.4kg" },
  // East Bangalore
  { id: 21, name: "Indiranagar 100ft Road",    lat: 12.9784, lng: 77.6408, capacity: 100, currentTraffic: 87, isCrowded: true,  gem: "Halasuru Lake & Temple",          gemLat: 12.9860, gemLng: 77.6291, co2Saved: "0.4kg" },
  { id: 22, name: "Koramangala Forum Mall",    lat: 12.9341, lng: 77.6105, capacity: 100, currentTraffic: 91, isCrowded: true,  gem: "Ejipura Kalina Art Lane",         gemLat: 12.9389, gemLng: 77.6210, co2Saved: "0.5kg" },
  { id: 23, name: "Ulsoor Lake",               lat: 12.9846, lng: 77.6201, capacity: 100, currentTraffic: 33, isCrowded: false, gem: "Shiva Temple Ulsoor",             gemLat: 12.9831, gemLng: 77.6162, co2Saved: "0.2kg" },
  { id: 24, name: "Domlur",                    lat: 12.9609, lng: 77.6387, capacity: 100, currentTraffic: 72, isCrowded: true,  gem: "HAL Aerospace Museum",            gemLat: 12.9492, gemLng: 77.6686, co2Saved: "0.4kg" },
  { id: 25, name: "HSR Layout",                lat: 12.9116, lng: 77.6474, capacity: 100, currentTraffic: 42, isCrowded: false, gem: "Agara Lake Walking Trail",        gemLat: 12.9062, gemLng: 77.6521, co2Saved: "0.3kg" },
  { id: 26, name: "Whitefield",                lat: 12.9698, lng: 77.7499, capacity: 100, currentTraffic: 80, isCrowded: true,  gem: "ISKCON Whitefield Temple",        gemLat: 12.9869, gemLng: 77.7502, co2Saved: "0.4kg" },
  { id: 27, name: "Marathahalli Bridge",       lat: 12.9591, lng: 77.6974, capacity: 100, currentTraffic: 93, isCrowded: true,  gem: "Varthur Lake Sunset Point",       gemLat: 12.9388, gemLng: 77.7239, co2Saved: "0.7kg" },
  { id: 28, name: "Sarjapur Road",             lat: 12.9102, lng: 77.6860, capacity: 100, currentTraffic: 50, isCrowded: false, gem: "Carmelaram Reserve Forest",       gemLat: 12.8851, gemLng: 77.7020, co2Saved: "0.4kg" },
];

const createMarkerIcon = (isCrowded) => new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `<div class="${isCrowded ? 'bg-red-500 animate-pulse' : 'bg-brand-green'} w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const CrowdDispersalMap = () => {
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [gemReason, setGemReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMarkerClick = async (landmark) => {
    if (!landmark.isCrowded) return;

    setSelectedLandmark(landmark);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/hidden-gem-alert', {
        busyLocation: landmark.name,
        alternativeGem: landmark.gem
      });
      if (response.data.success) {
        setGemReason(response.data.reason);
      }
    } catch (error) {
      console.error(error);
      setGemReason("It's a beautiful, quiet spot loved by locals. Worth the short walk!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 mx-auto max-w-6xl relative h-[80vh] flex flex-col"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <TrendingUp className="text-red-500" size={32} />
          Real-Time Crowd Dashboard
        </h2>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-red-500"></div> Over Capacity</span>
          <span className="flex items-center gap-2 text-sm font-medium"><div className="w-3 h-3 rounded-full bg-green-500"></div> Normal</span>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {landmarks.map(lm => (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={createMarkerIcon(lm.isCrowded)}
              eventHandlers={{
                click: () => handleMarkerClick(lm),
              }}
            />
          ))}
        </MapContainer>
      </div>

      <AnimatePresence>
        {selectedLandmark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-11/12 sm:w-full max-w-md z-10"
          >
            <div className="glass-panel p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle size={24} />
                  Eco-Alert: High Capacity!
                </div>
                <button onClick={() => setSelectedLandmark(null)} className="text-gray-400 hover:text-gray-800 font-bold">&times;</button>
              </div>

              <p className="text-gray-800 font-medium mb-4">
                <span className="font-bold">{selectedLandmark.name}</span> is currently at {selectedLandmark.currentTraffic}% capacity.
              </p>

              <div className="bg-brand-green/10 rounded-xl p-4 border border-brand-green/30">
                <div className="flex items-center gap-2 text-brand-green font-bold mb-2">
                  <Leaf size={20} />
                  Suggested Alternative: {selectedLandmark.gem}
                </div>

                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader className="animate-spin" size={16} /> Generating AI recommendation...
                  </div>
                ) : (
                  <div className="text-sm text-gray-700 italic border-l-2 border-brand-green pl-3 mb-3">
                    "{gemReason}"
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Walk & Save {selectedLandmark.co2Saved} CO2
                  </div>
                  <button className="bg-gradient-to-r from-brand-green to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all">
                    Route Me Here
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default CrowdDispersalMap;
