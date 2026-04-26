import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Clock, Award } from 'lucide-react';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '40px 0', textAlign: 'center' }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }} className="glass-panel">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-5">
          Travel <span className="text-gradient">Smarter</span> & Greener
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
          Experience the world without the rush. Discover eco-friendly routes, avoid crowded hotspots, and uncover hidden gems supported by locals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-10">
          <Link to="/planner" className="w-full sm:w-auto">
            <button className="btn-primary w-full sm:w-auto px-8 py-4 text-lg">
              Plan Your Trip
            </button>
          </Link>
          <Link to="/discover" className="w-full sm:w-auto">
            <button className="btn-secondary w-full sm:w-auto px-8 py-4 text-lg">
              Explore Hidden Gems
            </button>
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '60px' }}>
        <motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ background: '#e8f5e9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Leaf color="var(--primary-green)" size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Eco-Friendly Routes</h3>
          <p style={{ color: '#6b7280' }}>Discover pathways that reduce your carbon footprint and offer scenic, peaceful journeys.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ background: '#fff3e0', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Clock color="var(--primary-orange)" size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Smart Timing</h3>
          <p style={{ color: '#6b7280' }}>AI-powered predictions tell you the best time to visit to avoid crowds and long waits.</p>
        </motion.div>

        <motion.div whileHover={{ y: -10 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ background: '#e3f2fd', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Award color="#1976D2" size={30} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Local Rewards</h3>
          <p style={{ color: '#6b7280' }}>Add hidden places to our map and earn coupons while boosting the local economy.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
