import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Store, MessageCircle } from 'lucide-react';

const mockVendors = [
  {
    id: 1,
    name: "Maria's Artisan Bakery",
    type: "Community-Owned",
    score: 98,
    bio: "Maria has been baking with locally sourced wheat since 2010, employing 5 neighborhood residents.",
    tip: "Best to visit right at 7 AM for the warm sourdough. Skip the line!",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 2,
    name: "The Green Byte Cafe",
    type: "Community-Owned",
    score: 92,
    bio: "A sustainable cafe completely powered by solar energy, run by two local university graduates.",
    tip: "Try the matcha latte, and bring your own cup for a 15% discount.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: 3,
    name: "Starcoffee Corporate",
    type: "Major Corporate Chain",
    score: 45,
    bio: "Global coffee conglomerate.",
    tip: "Always busy.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"
  }
];

const LocalDiscoveryEngine = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommunity, setFilterCommunity] = useState(true);

  // Filter out corporate chains by default if filterCommunity is true
  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterCommunity ? vendor.type === "Community-Owned" : true;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 mx-auto max-w-5xl"
    >
      <div className="glass-panel p-5 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
              <Store className="text-brand-orange" size={36} />
              Local Discovery Engine
            </h2>
            <p className="text-gray-500 font-medium text-lg ml-0 md:ml-12">Support community-owned businesses and hidden spots.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/90 rounded-2xl px-5 py-3 shadow-md border border-gray-100 w-full md:flex-1 md:max-w-md transition-shadow hover:shadow-lg">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search local shops..." 
              className="bg-transparent border-none outline-none w-full text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input 
              type="checkbox" 
              checked={filterCommunity}
              onChange={() => setFilterCommunity(!filterCommunity)}
              className="w-5 h-5 accent-brand-green"
            />
            Prioritize Community-Owned & Filter Corporate Chains
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVendors.map(vendor => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={vendor.id} 
              className="glass-card overflow-hidden flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="p-5 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-gray-800 leading-tight">{vendor.name}</h3>
                  <div className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Heart size={16} className="text-brand-green" />
                    Impact Score: {vendor.score}
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4 block">
                  {vendor.type}
                </span>
                <p className="text-gray-600 text-base mb-6 flex-grow leading-relaxed">{vendor.bio}</p>
                
                <div className="bg-brand-green/10 rounded-2xl p-5 mt-auto border border-brand-green/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageCircle size={60} />
                  </div>
                  <h4 className="text-brand-green font-bold flex items-center gap-2 text-sm mb-2 relative z-10">
                    <MessageCircle size={18} /> Local Tip
                  </h4>
                  <p className="text-gray-700 text-base italic relative z-10 leading-relaxed">"{vendor.tip}"</p>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredVendors.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No local vendors found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LocalDiscoveryEngine;
