import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, IndianRupee, Wallet, Tag, Award, ArrowRight, Plus, Zap, TrendingUp, X, CheckCircle, AlertCircle, Flame, Star, Map, ShoppingBag } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const LEVELS = [
  { name: 'Eco Seed',     min: 0,    color: '#6b7280', icon: '🌱' },
  { name: 'Green Leaf',   min: 100,  color: '#22c55e', icon: '🍃' },
  { name: 'Eco Warrior',  min: 300,  color: '#3b82f6', icon: '⚡' },
  { name: 'Earth Ranger', min: 600,  color: '#f59e0b', icon: '🌍' },
  { name: 'Planet Hero',  min: 1000, color: '#8b5cf6', icon: '🏆' },
];

const TRIP_TYPES = [
  { label: 'Metro / Bus',     tokens: 30, co2: 2.1,  revenue: 800  },
  { label: 'Cycling',         tokens: 50, co2: 4.0,  revenue: 0    },
  { label: 'Walking',         tokens: 40, co2: 3.0,  revenue: 0    },
  { label: 'EV / CNG Auto',   tokens: 20, co2: 1.2,  revenue: 400  },
  { label: 'Local Market Visit', tokens: 25, co2: 0.5, revenue: 1500 },
  { label: 'Hidden Gem Visit', tokens: 60, co2: 1.0, revenue: 2000 },
];

const REWARDS = [
  { id: 1,  shop: "Brahmin's Coffee Bar",     offer: "Free Filter Coffee",        cost: 50,  area: "Basavanagudi" },
  { id: 2,  shop: "Koshy's Restaurant",       offer: "10% Off Breakfast",         cost: 80,  area: "St. Marks Rd" },
  { id: 3,  shop: "The Green Path Cafe",      offer: "15% Off Total Bill",        cost: 100, area: "Indiranagar" },
  { id: 4,  shop: "Malleshwaram Silk House",  offer: "₹200 Off on Silk Sarees",   cost: 150, area: "Malleshwaram" },
  { id: 5,  shop: "Lalbagh Nursery",          offer: "Free Sapling + Soil Kit",   cost: 120, area: "Lalbagh" },
  { id: 6,  shop: "Jayanagar Bakery",         offer: "Buy 1 Get 1 Khara Bath",    cost: 60,  area: "Jayanagar 4th Block" },
  { id: 7,  shop: "Local Pottery Studio",     offer: "Free Pottery Class",        cost: 250, area: "Koramangala" },
  { id: 8,  shop: "Cubbon Park Juice Corner", offer: "Free Fresh Juice",          cost: 40,  area: "Cubbon Park" },
  { id: 9,  shop: "Mattikere Organics",       offer: "10% Off Organic Produce",   cost: 90,  area: "Yeshwanthpur" },
  { id: 10, shop: "HAL Museum Gift Shop",     offer: "Free Entry Pass",           cost: 200, area: "HAL" },
  { id: 11, shop: "VV Puram Food Street",     offer: "₹100 Food Voucher",         cost: 175, area: "VV Puram" },
  { id: 12, shop: "Nandini Milk Parlour",     offer: "Free Milk Mysore Pak",      cost: 45,  area: "Multiple" },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const loadState = () => {
  try {
    return {
      tokens:    parseInt(localStorage.getItem('sv_tokens')   || '150'),
      co2:       parseFloat(localStorage.getItem('sv_co2')    || '4.2'),
      revenue:   parseInt(localStorage.getItem('sv_revenue')  || '6400'),
      trips:     parseInt(localStorage.getItem('sv_trips')    || '3'),
      streak:    parseInt(localStorage.getItem('sv_streak')   || '1'),
      redeemed:  JSON.parse(localStorage.getItem('sv_redeemed') || '[]'),
      log:       JSON.parse(localStorage.getItem('sv_log')      || '[]'),
      weekly:    JSON.parse(localStorage.getItem('sv_weekly')   || JSON.stringify([0.8,1.2,0,0.6,1.1,0.5,0])),
    };
  } catch { return {}; }
};

const saveState = (s) => {
  localStorage.setItem('sv_tokens',   s.tokens);
  localStorage.setItem('sv_co2',      s.co2);
  localStorage.setItem('sv_revenue',  s.revenue);
  localStorage.setItem('sv_trips',    s.trips);
  localStorage.setItem('sv_streak',   s.streak);
  localStorage.setItem('sv_redeemed', JSON.stringify(s.redeemed));
  localStorage.setItem('sv_log',      JSON.stringify(s.log.slice(0, 20)));
  localStorage.setItem('sv_weekly',   JSON.stringify(s.weekly));
};

const getLevel = (tokens) => [...LEVELS].reverse().find(l => tokens >= l.min) || LEVELS[0];
const getNextLevel = (tokens) => LEVELS.find(l => l.min > tokens);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0; const end = value; const dur = 1200;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      setDisplay(+(end * prog).toFixed(decimals));
      if (prog < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value, decimals]);
  return <span>{prefix}{display.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

// ─── Weekly Bar Chart ─────────────────────────────────────────────────────────
function WeeklyChart({ data }) {
  const max = Math.max(...data, 0.1);
  return (
    <div className="flex items-end gap-2 h-24 mt-3">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <motion.div
            initial={{ height: 0 }} animate={{ height: `${(v / max) * 80}px` }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
            className="w-full rounded-t-md"
            style={{ background: v > 0 ? 'linear-gradient(to top,#22c55e,#86efac)' : '#f1f5f9', minHeight: 4 }}
            title={`${v.toFixed(1)} kg CO₂`}
          />
          <span className="text-xs text-gray-400">{DAYS[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Log Trip Modal ───────────────────────────────────────────────────────────
function LogTripModal({ onClose, onLog }) {
  const [selected, setSelected] = useState(null);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Plus size={20} className="text-brand-green" /> Log Eco Trip</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={22} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {TRIP_TYPES.map((t, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${selected === i ? 'border-brand-green bg-green-50' : 'border-gray-100 hover:border-green-200'}`}>
              <p className="font-bold text-sm text-gray-800">{t.label}</p>
              <p className="text-xs text-brand-green mt-1">+{t.tokens} ST · -{t.co2}kg CO₂</p>
            </button>
          ))}
        </div>
        <button onClick={() => selected !== null && onLog(TRIP_TYPES[selected])}
          disabled={selected === null}
          className={`w-full py-3 rounded-2xl font-bold text-white transition-all ${selected !== null ? 'bg-gradient-to-r from-brand-green to-green-500 hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Confirm & Earn Tokens
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ImpactTracker = () => {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const update = (patch) => {
    setState(prev => { const next = { ...prev, ...patch }; saveState(next); return next; });
  };

  const handleLog = (trip) => {
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const weekly = [...state.weekly];
    weekly[todayIdx] = +(weekly[todayIdx] + trip.co2).toFixed(1);
    const newLog = [
      { text: `${trip.label} · +${trip.tokens} ST · -${trip.co2}kg CO₂`, ts: Date.now() },
      ...state.log,
    ];
    update({
      tokens: state.tokens + trip.tokens,
      co2: +(state.co2 + trip.co2).toFixed(1),
      revenue: state.revenue + trip.revenue,
      trips: state.trips + 1,
      streak: state.streak,
      weekly,
      log: newLog,
    });
    setShowModal(false);
    showToast(`+${trip.tokens} Smart Tokens earned! 🎉`);
  };

  const handleRedeem = (reward) => {
    if (state.redeemed.includes(reward.id)) return;
    if (state.tokens < reward.cost) {
      showToast(`Need ${reward.cost - state.tokens} more ST`, 'error');
      return;
    }
    update({ tokens: state.tokens - reward.cost, redeemed: [...state.redeemed, reward.id] });
    showToast(`Redeemed "${reward.offer}" at ${reward.shop}! 🛍️`);
  };

  const level = getLevel(state.tokens);
  const nextLevel = getNextLevel(state.tokens);
  const progress = nextLevel ? ((state.tokens - level.min) / (nextLevel.min - level.min)) * 100 : 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="container mx-auto max-w-6xl py-8 px-4 flex flex-col gap-16">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>{showModal && <LogTripModal onClose={() => setShowModal(false)} onLog={handleLog} />}</AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Award className="text-brand-green" size={36} /> Gamified Impact Tracker
          </h2>
          <p className="text-gray-500 mt-1">Every eco-choice earns Smart Tokens and saves the planet.</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Wallet */}
          <div className="glass-card px-5 py-3 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-500"><Wallet size={22} /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Smart Tokens</p>
              <p className="text-2xl font-extrabold text-gray-800">{state.tokens} <span className="text-sm font-normal text-gray-400">ST</span></p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-green to-green-500 text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all">
            <Plus size={18} /> Log Trip
          </button>
        </div>
      </div>

      {/* Level Banner */}
      <motion.div whileHover={{ scale: 1.01 }}
        className="glass-card mb-12 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ borderLeft: `4px solid ${level.color}` }}>
        <div className="text-4xl">{level.icon}</div>
        <div className="flex-1 w-full">
          <div className="flex justify-between items-center mb-2">
            <p className="font-extrabold text-gray-800 text-lg">{level.name}</p>
            {nextLevel
              ? <p className="text-xs text-gray-500">{state.tokens} / {nextLevel.min} ST → <strong>{nextLevel.name}</strong></p>
              : <p className="text-xs font-bold text-purple-600">Max Level Reached 🏆</p>}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className="h-3 rounded-full" style={{ background: `linear-gradient(to right, ${level.color}, #86efac)` }} />
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div><p className="text-2xl font-extrabold text-gray-800">{state.trips}</p><p className="text-xs text-gray-400">Trips</p></div>
          <div><p className="text-2xl font-extrabold text-orange-500 flex items-center gap-1"><Flame size={18} />{state.streak}</p><p className="text-xs text-gray-400">Day Streak</p></div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
        {[
          { icon: <Leaf size={28} />, label: 'Carbon Saved', value: <AnimatedNumber value={state.co2} decimals={1} suffix=" kg CO₂" />, color: 'text-brand-green', bg: 'bg-green-50' },
          { icon: <IndianRupee size={28} />, label: 'Local Revenue Boosted', value: <><span className="text-2xl">₹</span><AnimatedNumber value={state.revenue} /></>, color: 'text-brand-orange', bg: 'bg-orange-50' },
          { icon: <TrendingUp size={28} />, label: 'Eco Score', value: <AnimatedNumber value={Math.round(state.co2 * 8 + state.trips * 5)} suffix=" pts" />, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="glass-card p-6 flex items-center gap-4">
            <div className={`${s.bg} ${s.color} p-3 rounded-2xl`}>{s.icon}</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart + Activity Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="glass-card p-6">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-brand-green" /> Weekly CO₂ Savings
          </h3>
          <p className="text-xs text-gray-400 mb-2">kg of CO₂ saved per day this week</p>
          <WeeklyChart data={state.weekly} />
        </div>
        <div className="glass-card p-6">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-500" /> Recent Activity
          </h3>
          {state.log.length === 0
            ? <p className="text-sm text-gray-400 italic">No activity yet. Log your first trip! 🌱</p>
            : <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {state.log.map((entry, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2 border-b border-gray-50 pb-2">
                    <CheckCircle size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ul>}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag className="text-brand-orange" size={24} /> Redeem Rewards
          </h3>
          <p className="text-sm text-gray-500">Balance: <strong className="text-gray-800">{state.tokens} ST</strong></p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {REWARDS.map(reward => {
            const done = state.redeemed.includes(reward.id);
            const canAfford = state.tokens >= reward.cost;
            return (
              <motion.div key={reward.id} whileHover={{ scale: done ? 1 : 1.02 }}
                className={`glass-card flex flex-col justify-between transition-opacity ${done ? 'opacity-60' : ''}`}>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Map size={12} /> {reward.area}
                  </p>
                  <h4 className="font-extrabold text-gray-800 text-base mb-1">{reward.shop}</h4>
                  <p className="text-brand-green font-bold text-lg">{reward.offer}</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                    <Wallet size={14} /> {reward.cost} ST
                  </span>
                  <button onClick={() => handleRedeem(reward)} disabled={done || !canAfford}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                      done ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : canAfford ? 'bg-gray-800 hover:bg-black text-white hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    {done ? '✓ Redeemed' : !canAfford ? `Need ${reward.cost - state.tokens} more` : <><ArrowRight size={15} /> Redeem</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactTracker;
