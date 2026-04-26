import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Calendar, UserCheck, Send, MapPin, Star, Award, Clock, X, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

const getLevelColor = (level) => {
  switch(level) {
    case 'Bronze': return 'text-amber-700 bg-amber-100 border-amber-300';
    case 'Silver': return 'text-gray-600 bg-gray-100 border-gray-300';
    case 'Gold': return 'text-yellow-600 bg-yellow-100 border-yellow-400';
    case 'Platinum': return 'text-purple-600 bg-purple-100 border-purple-300';
    default: return 'text-gray-500 bg-gray-100 border-gray-200';
  }
};

const getAvgRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
};

const CommunityConnect = () => {
  const [guides, setGuides] = useState([]);
  const [activeGuide, setActiveGuide] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch guides from our updated backend
    fetch('http://localhost:5000/api/guides')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.guides.length > 0) {
          setGuides(data.guides);
          setActiveGuide(data.guides[0]);
          setMessages([
            { id: 1, sender: 'guide', text: `Hi there! I'm ${data.guides[0].name.split(' ')[0]}, a local here. Need any advice on cultural etiquette or secret spots?` }
          ]);
        }
      })
      .catch(err => console.error("Error fetching guides:", err));

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'guide', text: msg.text }]);
    });

    return () => newSocket.close();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeGuide) return;

    const newMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newMsg]);
    
    if (socket) {
      socket.emit('send_message', { text: inputText, to: activeGuide.id });
    }
    
    setInputText('');
  };

  const handleGuideSelect = (guide) => {
    setActiveGuide(guide);
    setMessages([
      { id: Date.now(), sender: 'guide', text: `Hi! I'm ${guide.name.split(' ')[0]}. How can I help you explore today?` }
    ]);
  };

  const handleBookTour = (e) => {
    e.stopPropagation();
    setBookingModal(true);
  };

  const confirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModal(false);
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 mx-auto max-w-6xl h-auto md:h-[85vh] flex flex-col relative"
    >
      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal && activeGuide && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden"
            >
              {bookingSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle size={64} className="text-brand-green mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800">Tour Booked!</h3>
                  <p className="text-gray-500 mt-2">Check your email for details.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Calendar size={20} className="text-brand-green" /> Book Micro-Tour
                    </h3>
                    <button onClick={() => setBookingModal(false)} className="text-gray-400 hover:text-gray-700">
                      <X size={22} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                    <img src={activeGuide.avatar} alt={activeGuide.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-800">{activeGuide.name}</h4>
                      <p className="text-sm text-gray-500">{activeGuide.expertise}</p>
                    </div>
                  </div>

                  <button 
                    onClick={confirmBooking}
                    className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                  >
                    Confirm Booking
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
          <MessageSquare className="text-brand-orange" size={36} />
          Community Connect
        </h2>
        <p className="text-gray-500 font-medium text-lg ml-0 md:ml-12">Book micro-tours and get real-time advice from verified local guides.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden min-h-[600px]">
        {/* Guides List */}
        <div className="w-full md:w-1/3 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pr-2 pb-2 md:pb-0">
          {guides.length === 0 ? (
            <p className="text-gray-500 italic p-4">Loading guides...</p>
          ) : (
            guides.map(guide => {
              const rating = getAvgRating(guide.contributionMetrics.travelerRatings);
              const isActive = activeGuide?.id === guide.id;
              
              return (
                <div 
                  key={guide.id}
                  onClick={() => handleGuideSelect(guide)}
                  className={`glass-card p-4 cursor-pointer transition-all border-2 ${isActive ? 'border-brand-green bg-white/90' : 'border-transparent hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative">
                       <img src={guide.avatar} alt={guide.name} className="w-14 h-14 rounded-full object-cover shadow-sm hidden sm:block" />
                       <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                         <Award size={16} className={getLevelColor(guide.contributionLevel).split(' ')[0]} />
                       </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 flex items-center gap-1 text-sm md:text-base">
                        {guide.name} <UserCheck size={14} className="text-brand-green" />
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs font-bold text-brand-orange">
                          <Star size={12} className="fill-current mr-1" /> {rating}
                        </div>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelColor(guide.contributionLevel)}`}>
                          {guide.contributionLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin size={14} className="shrink-0" /> <span className="truncate">{guide.expertise}</span>
                  </p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.badges.map((badge, i) => (
                      <span key={i} className="text-[10px] font-medium bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-md">
                        {badge}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={handleBookTour}
                    className="w-full bg-brand-green/10 hover:bg-brand-green/20 text-brand-green font-bold py-2 rounded-lg text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Calendar size={16} /> Book Micro-Tour
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Messaging Interface */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden shadow-lg border border-white/80">
          {activeGuide ? (
            <>
              {/* Header */}
              <div className="bg-white/90 p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={activeGuide.avatar} alt={activeGuide.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      {activeGuide.name}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelColor(activeGuide.contributionLevel)}`}>
                        {activeGuide.contributionLevel}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="text-sm font-bold text-brand-green flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div> Online
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> Replies in ~{activeGuide.contributionMetrics.responseTimeAvgMinutes}m
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <div className="text-xs font-bold text-gray-400 uppercase">Tours Given</div>
                  <div className="text-lg font-extrabold text-gray-800">{activeGuide.contributionMetrics.totalToursGiven}</div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gradient-to-b from-transparent to-gray-50/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[70%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-green text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm shadow-sm'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white/90 p-5 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about local spots, etiquette, or anything else..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-3 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all font-medium"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="bg-brand-orange hover:bg-orange-500 disabled:bg-gray-300 text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
               <MessageSquare size={48} className="opacity-20" />
               <p>Select a guide to start chatting</p>
             </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityConnect;
