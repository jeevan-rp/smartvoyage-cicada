import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { MapPin, Star, PlusCircle, Gift, Award, Trash2, Camera, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customMarkerIcon = new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="color: #ef4444; filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const Discover = () => {
  const [places, setPlaces] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const q = query(collection(db, "hidden_gems"), orderBy("createdAt", "desc"));
      
      const getPromise = getDocs(q);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase read timeout")), 5000));
      
      const querySnapshot = await Promise.race([getPromise, timeoutPromise]);
      
      const placesData = [];
      querySnapshot.forEach((doc) => {
        placesData.push({ id: doc.id, ...doc.data() });
      });
      
      // Merge with localStorage fallback items
      const localPlaces = JSON.parse(localStorage.getItem('mock_hidden_gems') || '[]');
      setPlaces([...placesData, ...localPlaces]);
    } catch (error) {
      console.warn("Firestore error (using local state fallback): ", error);
      const localPlaces = JSON.parse(localStorage.getItem('mock_hidden_gems') || '[]');
      setPlaces(localPlaces);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    
    const userDisplayName = auth.currentUser?.displayName || auth.currentUser?.email || "Anonymous Local Guide";
    const userId = auth.currentUser?.uid || "mock-user-123";
    
    const newPlace = {
      name,
      description,
      location,
      coordinates,
      image: imagePreview,
      addedBy: userDisplayName,
      userId: userId,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    try {
      // Add a timeout to prevent indefinite hanging if Firebase is blocked
      const addPromise = addDoc(collection(db, "hidden_gems"), newPlace);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000));
      
      const docRef = await Promise.race([addPromise, timeoutPromise]);
      newPlace.id = docRef.id;
      setPlaces(prev => [newPlace, ...prev]);
      setSubmitMessage({ type: 'success', text: 'Successfully saved to Firebase database! You earned 50 Reward Points!' });
    } catch (error) {
      console.warn("Firestore error (using localStorage fallback): ", error);
      newPlace.id = Date.now().toString();
      const localPlaces = JSON.parse(localStorage.getItem('mock_hidden_gems') || '[]');
      localStorage.setItem('mock_hidden_gems', JSON.stringify([newPlace, ...localPlaces]));
      setPlaces(prev => [newPlace, ...prev]);
      setSubmitMessage({ type: 'warning', text: 'Saved locally (Firebase unavailable). You earned 50 Reward Points!' });
    }
    
    setName('');
    setDescription('');
    setLocation('');
    setCoordinates(null);
    setImagePreview(null);
    setIsSubmitting(false);
    
    setTimeout(() => {
      setShowAddForm(false);
      setSubmitMessage({ type: '', text: '' });
    }, 3000);
  };

  const handleRemovePlace = async (placeId) => {
    // Optimistically remove from UI
    setPlaces(prev => prev.filter(p => p.id !== placeId));
    
    // Remove from local storage fallback
    const localPlaces = JSON.parse(localStorage.getItem('mock_hidden_gems') || '[]');
    const updatedLocal = localPlaces.filter(p => p.id !== placeId);
    localStorage.setItem('mock_hidden_gems', JSON.stringify(updatedLocal));
    
    // Attempt to remove from Firebase
    try {
      await deleteDoc(doc(db, "hidden_gems", placeId));
    } catch (e) {
      console.warn("Firestore delete error (item might only exist locally): ", e);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '20px 0' }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
            <MapPin className="text-brand-orange" size={36} />
            Local Hidden Gems
          </h2>
          <p className="text-gray-500 font-medium text-lg ml-0 md:ml-12">Discover unique spots away from the crowds, curated by locals.</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary w-full sm:w-auto justify-center px-6 py-3 text-lg font-bold shadow-md hover:shadow-lg transition-all"
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {showAddForm ? 'Cancel' : <><PlusCircle size={20} /> Add a Place & Earn</>}
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-card mb-12 overflow-hidden border border-white/80"
        >
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8 bg-orange-50 border border-orange-100 p-5 rounded-2xl">
              <div className="bg-white p-3 rounded-xl shadow-sm text-brand-orange"><Gift size={24} /></div>
              <p className="font-bold text-gray-800 text-lg">
                Add a verified hidden gem to help the local economy and earn <span className="text-brand-orange">50 Travel Coupons!</span>
              </p>
            </div>
          
          <form onSubmit={handleAddPlace} style={{ display: 'grid', gap: '20px' }}>
            <div className="field">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name of the Place</label>
              <input 
                type="text" 
                className="form-input" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location (City/Region or GPS)</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  className="form-input flex-1" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  required
                />
                <button 
                  type="button" 
                  onClick={handleGetLocation} 
                  className="btn-secondary whitespace-nowrap flex items-center justify-center gap-2 px-4 py-2" 
                  disabled={isLocating}
                >
                  <Navigation size={18} /> {isLocating ? 'Locating...' : 'Get Location'}
                </button>
              </div>
              
              {coordinates && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 250 }}
                  className="mt-4 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0"
                >
                  <MapContainer
                    center={[coordinates.lat, coordinates.lng]}
                    zoom={15}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[coordinates.lat, coordinates.lng]} icon={customMarkerIcon} />
                  </MapContainer>
                </motion.div>
              )}
            </div>
            
            <div className="field">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Add a Photo (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 flex items-center gap-2 transition-colors flex-1 justify-center font-medium">
                  <Camera size={20} /> Choose Image
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4 relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-100" />
                  <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-white/90 text-red-500 p-1.5 rounded-lg shadow-sm hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="field">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Why is it special? (Description)</label>
              <textarea 
                className="form-input" 
                style={{ minHeight: '100px', resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`btn-secondary w-full sm:w-auto mt-4 px-8 py-3 text-lg justify-center sm:justify-start ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              <Award size={24} /> {isSubmitting ? 'Saving to Database...' : 'Submit & Earn Rewards'}
            </button>
            
            {submitMessage.text && (
              <div className={`mt-4 p-4 rounded-xl font-bold ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {submitMessage.text}
              </div>
            )}
          </form>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading hidden gems...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {places.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.5)', borderRadius: '20px' }}>
              No hidden gems added yet. Be the first to share and earn!
            </div>
          ) : (
            places.map(place => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={place.id} 
                className="glass-card flex flex-col justify-between h-full border border-white/80"
              >
                <div className="p-5 md:p-8 flex flex-col h-full">
                  {place.image && (
                    <div className="mb-5 rounded-xl overflow-hidden h-40 shadow-sm border border-gray-100 shrink-0">
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-extrabold text-2xl text-gray-800 leading-tight">{place.name}</h3>
                    <div className="bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-bold text-brand-green shadow-sm shrink-0" title={place.coordinates ? `Lat: ${place.coordinates.lat}, Lng: ${place.coordinates.lng}` : place.location}>
                      <MapPin size={16} /> <span className="truncate max-w-[100px]">{place.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed flex-grow mb-8 text-lg">
                    {place.description}
                  </p>
                  
                  <div className="border-t border-gray-100 pt-5 flex justify-between items-center text-sm font-medium text-gray-500 mt-auto">
                    <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">{place.addedBy.charAt(0)}</span> {place.addedBy}</span>
                    <div className="flex items-center gap-2">
                      {(place.userId === (auth.currentUser?.uid || "mock-user-123")) && (
                        <button 
                          onClick={() => handleRemovePlace(place.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 font-bold"
                          title="Remove this gem"
                        >
                          <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1.5 bg-orange-50 text-brand-orange px-3 py-1 rounded-full font-bold">
                        <Star size={16} className="fill-current" /> Local Favorite
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Discover;
