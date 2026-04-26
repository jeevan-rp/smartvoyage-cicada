import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { MapPin, Leaf, Clock, Map, Star, User, Menu, X } from 'lucide-react';

import Home from './pages/Home';
import Planner from './pages/Planner';
import Discover from './pages/Discover';
import LocalDiscoveryEngine from './pages/LocalDiscoveryEngine';
import CrowdDispersalMap from './pages/CrowdDispersalMap';
import ImpactTracker from './pages/ImpactTracker';
import CommunityConnect from './pages/CommunityConnect';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';

import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar glass-panel relative" style={{ padding: '15px 30px', marginTop: '20px', borderRadius: '40px' }}>
          <div className="flex justify-between items-center w-full md:w-auto">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Leaf color="var(--primary-green)" size={28} />
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.5rem' }}>
                Smart<span style={{ color: 'var(--primary-orange)' }}>Voyage</span>
              </h2>
            </div>
            
            {/* Hamburger Menu Button */}
            <button 
              className="md:hidden text-gray-600 focus:outline-none hover:text-brand-green transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <div className={`nav-links flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0 w-full md:w-auto md:flex transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'flex' : 'hidden'}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Home</Link>
            <Link to="/planner" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Trip Planner</Link>
            <Link to="/discover" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Add Gem</Link>
            <Link to="/local-shops" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Local Shops</Link>
            <Link to="/crowd-map" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Crowd Map</Link>
            <Link to="/impact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0">Impact Tracking</Link>
            <Link to="/connect" onClick={() => setIsMobileMenuOpen(false)} className="text-sm md:text-base font-bold text-gray-700 hover:text-brand-green w-full md:w-auto text-center py-2 md:py-0 border-b border-gray-100 md:border-none mb-2 md:mb-0">Connect</Link>
            
            {user ? (
              <div className="flex flex-col md:flex-row items-center gap-3 ml-0 md:ml-4 mt-2 md:mt-0 w-full md:w-auto justify-center">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="transition-transform hover:scale-110 shadow-sm rounded-full border-2 border-transparent hover:border-brand-green">
                  <img src={user.photoURL || 'https://i.pravatar.cc/150?img=11'} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn-outline text-sm w-full md:w-auto mt-2 md:mt-0">Logout</button>
              </div>
            ) : (
              <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="btn-primary mt-2 md:mt-0 w-full md:w-auto shadow-md">
                Login with Google
              </button>
            )}
          </div>
        </nav>

        <main style={{ marginTop: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/local-shops" element={<LocalDiscoveryEngine />} />
            <Route path="/crowd-map" element={<CrowdDispersalMap />} />
            <Route path="/impact" element={<ImpactTracker />} />
            <Route path="/connect" element={<CommunityConnect />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        
        {/* Floating AI Guide Chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
