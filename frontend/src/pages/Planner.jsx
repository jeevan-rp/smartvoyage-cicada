import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, Loader, Navigation, Clock, Users, Sparkles, Leaf,
  Backpack, UtensilsCrossed, Wallet, Star, CalendarDays,
  Train, Bike, Car, Footprints, ChevronRight, Save, Zap, CheckCircle
} from 'lucide-react';
import axios from 'axios';

// ─── Config ───────────────────────────────────────────────────────────────────
const STYLES   = [{ v:'budget', label:'Budget 🎒' }, { v:'mid-range', label:'Mid-Range 🏨' }, { v:'luxury', label:'Luxury 💎' }];
const TRAVELERS = [{ v:'solo', label:'Solo', icon:'🧍' }, { v:'couple', label:'Couple', icon:'👫' }, { v:'family', label:'Family', icon:'👨‍👩‍👧' }, { v:'group', label:'Group', icon:'👥' }];
const TRANSPORTS = [
  { v:'metro/bus', label:'Metro / Bus', Icon: Train },
  { v:'cycling',   label:'Cycle',       Icon: Bike  },
  { v:'ev/cab',    label:'EV / Cab',    Icon: Car   },
  { v:'walking',   label:'Walk',        Icon: Footprints },
];
const TABS = ['Itinerary', 'Eco Route', 'Hidden Gems', 'Timing & Crowds', 'Packing & Budget'];
const TAB_ICONS = [CalendarDays, Leaf, Sparkles, Clock, Backpack];
const ECO_TOKENS = 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Pill = ({ active, onClick, children, className = '' }) => (
  <button onClick={onClick}
    className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${active
      ? 'border-brand-green bg-green-50 text-brand-green'
      : 'border-gray-200 text-gray-600 hover:border-green-300'} ${className}`}>
    {children}
  </button>
);

const Card = ({ color = '#22c55e', icon: Icon, title, children }) => (
  <div className="glass-card p-5" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} color={color} />
      <h4 className="font-bold text-gray-800 text-base m-0">{title}</h4>
    </div>
    <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
  </div>
);

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1,2,3].map(i => (
      <div key={i} className="glass-card p-5">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-full mb-2" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
    ))}
  </div>
);

// ─── Day Card ─────────────────────────────────────────────────────────────────
const DayCard = ({ day }) => (
  <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
    className="glass-card p-5 border-t-4" style={{ borderColor: '#22c55e' }}>
    <h4 className="font-extrabold text-gray-800 text-lg mb-4">
      Day {day.day} — <span className="text-brand-green">{day.title}</span>
    </h4>
    <div className="space-y-3">
      {[['🌅 Morning', day.morning], ['☀️ Afternoon', day.afternoon], ['🌙 Evening', day.evening]].map(([label, text]) => (
        <div key={label} className="flex gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-24 shrink-0 pt-0.5">{label}</span>
          <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Planner = () => {
  const [form, setForm] = useState({ origin:'', destination:'', days:2, travelStyle:'mid-range', travelerType:'solo', transport:'metro/bus' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePlan = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { setError('Please enter a destination 📍'); return; }
    setLoading(true); setError(''); setResult(null); setSaved(false); setTokensEarned(false);
    try {
      const res = await axios.post('https://api-smartvoyage.vercel.app/api/plan-trip', form);
      if (res.data?.success) {
        setResult({ ...res.data.data, localDataUsed: res.data.localDataUsed });
        setActiveTab(0);
      } else setError('Something went wrong. Please try again.');
    } catch {
      setError('Could not reach the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const trips = JSON.parse(localStorage.getItem('sv_saved_trips') || '[]');
    trips.unshift({ destination: form.destination, days: form.days, style: form.travelStyle, savedAt: Date.now(), plan: result });
    localStorage.setItem('sv_saved_trips', JSON.stringify(trips.slice(0, 10)));
    setSaved(true);
  };

  const handleEarnTokens = () => {
    const cur = parseInt(localStorage.getItem('sv_tokens') || '0');
    localStorage.setItem('sv_tokens', cur + ECO_TOKENS);
    const log = JSON.parse(localStorage.getItem('sv_log') || '[]');
    log.unshift({ text: `Trip planned to ${form.destination} · +${ECO_TOKENS} ST`, ts: Date.now() });
    localStorage.setItem('sv_log', JSON.stringify(log.slice(0, 20)));
    setTokensEarned(true);
  };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
      className="max-w-4xl mx-auto py-8 px-4">

      {/* ── Header ── */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center justify-center gap-3">
          <Map className="text-brand-green" size={36} /> Plan Your Adventure
        </h2>
        <p className="text-gray-500 mt-2 text-base">Tell me where you're headed — I'll handle the rest! 🌿</p>
      </div>

      {/* ── Form ── */}
      <motion.div className="glass-panel p-8 rounded-3xl mb-8">
        <form onSubmit={handlePlan} className="space-y-6">

          {/* Origin / Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Starting Point (optional)</label>
              <input className="form-input w-full" placeholder="e.g. Majestic, Koramangala…"
                value={form.origin} onChange={e => set('origin', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Destination ✳️</label>
              <input className="form-input w-full" placeholder="e.g. Lalbagh, Nandi Hills…"
                value={form.destination} onChange={e => set('destination', e.target.value)} required />
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">
              <CalendarDays size={14} className="inline mr-1" /> Number of Days: <strong>{form.days}</strong>
            </label>
            <input type="range" min={1} max={7} value={form.days} onChange={e => set('days', +e.target.value)}
              className="w-full accent-green-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {[1,2,3,4,5,6,7].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Travel Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => <Pill key={s.v} active={form.travelStyle === s.v} onClick={() => set('travelStyle', s.v)}>{s.label}</Pill>)}
            </div>
          </div>

          {/* Traveler Type */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Travelling As</label>
            <div className="flex flex-wrap gap-2">
              {TRAVELERS.map(t => (
                <Pill key={t.v} active={form.travelerType === t.v} onClick={() => set('travelerType', t.v)}>
                  {t.icon} {t.label}
                </Pill>
              ))}
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Preferred Transport</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRANSPORTS.map(({ v, label, Icon }) => (
                <button key={v} type="button" onClick={() => set('transport', v)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all text-sm font-bold ${
                    form.transport === v ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-500 hover:border-green-200'}`}>
                  <Icon size={20} /> {label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full btn-primary py-4 text-lg flex justify-center items-center gap-3 rounded-2xl">
            {loading ? <><Loader size={22} className="animate-spin" /> Crafting your adventure…</> : <><Navigation size={22} /> Plan My Adventure ✨</>}
          </button>
        </form>
      </motion.div>

      {/* ── Loading Skeleton ── */}
      {loading && <Skeleton />}

      {/* ── Results ── */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>

            {/* Destination title + actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-800">
                  Here's your adventure map! 🗺️
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {form.days}-day {form.travelStyle} trip to <strong>{form.destination}</strong>
                  {result.localDataUsed && (
                    <span className="ml-2 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      📍 Local Guide Data
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {!tokensEarned ? (
                  <button onClick={handleEarnTokens}
                    className="flex items-center gap-2 bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-amber-200 transition-all">
                    <Zap size={16} /> +{ECO_TOKENS} ST
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-green-700 font-bold text-sm bg-green-100 px-3 py-2 rounded-xl">
                    <CheckCircle size={16} /> Tokens Earned!
                  </span>
                )}
                <button onClick={handleSave} disabled={saved}
                  className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl text-sm transition-all ${saved ? 'bg-gray-100 text-gray-400' : 'bg-gray-800 text-white hover:bg-black'}`}>
                  <Save size={16} /> {saved ? 'Saved!' : 'Save Trip'}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
              {TABS.map((tab, i) => {
                const Icon = TAB_ICONS[i];
                return (
                  <button key={tab} onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold whitespace-nowrap border-2 transition-all ${
                      activeTab === i ? 'border-brand-green bg-green-50 text-brand-green' : 'border-gray-200 text-gray-500 hover:border-green-200'}`}>
                    <Icon size={15} /> {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.25 }}>

                {/* Itinerary */}
                {activeTab === 0 && (
                  <div className="space-y-4">
                    {result.itinerary?.length
                      ? result.itinerary.map(d => <DayCard key={d.day} day={d} />)
                      : <p className="text-gray-400 text-sm italic">No itinerary data available.</p>}
                  </div>
                )}

                {/* Eco Route */}
                {activeTab === 1 && (
                  <div className="space-y-4">
                    <Card icon={Leaf} title="Eco-Friendly Route" color="#22c55e">
                      {result.ecoRoute || 'No route data.'}
                    </Card>
                    <Card icon={Clock} title="Best Time to Visit" color="#f59e0b">
                      {result.bestTime || 'No timing data.'}
                    </Card>
                  </div>
                )}

                {/* Hidden Gems */}
                {activeTab === 2 && (
                  <div className="space-y-3">
                    {result.hiddenGems?.map((gem, i) => (
                      <motion.div key={i} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
                        className="glass-card p-4 flex gap-3 items-start">
                        <div className="text-xl shrink-0">💎</div>
                        <div>
                          <p className="text-sm text-gray-700 leading-relaxed">{gem}</p>
                          {result.localDataUsed && <span className="text-xs font-bold text-green-600 mt-1 inline-block">📍 Local Source</span>}
                        </div>
                      </motion.div>
                    )) || <p className="text-gray-400 text-sm italic">No gems found.</p>}
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><UtensilsCrossed size={16} className="text-brand-orange" /> Local Food Spots</h4>
                      <div className="space-y-2">
                        {result.localFoodSpots?.map((spot, i) => (
                          <div key={i} className="glass-card p-3 flex gap-3 items-start">
                            <span className="text-base shrink-0">🍽️</span>
                            <p className="text-sm text-gray-600 leading-relaxed">{spot}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timing & Crowds */}
                {activeTab === 3 && (
                  <div className="space-y-4">
                    <Card icon={Clock} title="Optimal Timing" color="#f59e0b">
                      {result.bestTime || 'No timing data.'}
                    </Card>
                    <Card icon={Users} title="Crowd Forecast" color="#ef4444">
                      {result.crowdPrediction || 'No crowd data.'}
                    </Card>
                  </div>
                )}

                {/* Packing & Budget */}
                {activeTab === 4 && (
                  <div className="space-y-4">
                    <div className="glass-card p-5">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Backpack size={16} className="text-brand-green" /> Packing Tips</h4>
                      <ul className="space-y-2">
                        {result.packingTips?.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <ChevronRight size={15} className="text-brand-green shrink-0 mt-0.5" /> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="glass-card p-5">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><Wallet size={16} className="text-brand-orange" /> Estimated Daily Budget</h4>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                          { label:'Budget 🎒', val: result.estimatedBudget?.budget,   color:'#22c55e' },
                          { label:'Mid-Range 🏨', val: result.estimatedBudget?.midRange, color:'#f59e0b' },
                          { label:'Luxury 💎', val: result.estimatedBudget?.luxury,   color:'#8b5cf6' },
                        ].map(b => (
                          <div key={b.label} className="rounded-2xl p-3" style={{ background: b.color + '15', border: `1px solid ${b.color}30` }}>
                            <p className="text-xs font-bold text-gray-500 mb-1">{b.label}</p>
                            <p className="text-sm font-extrabold" style={{ color: b.color }}>{b.val || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Planner;
