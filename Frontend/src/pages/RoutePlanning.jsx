import React, { useState } from 'react';
import { routingService } from '../services/api';

export default function RoutePlanning() {
    const [origin, setOrigin] = useState('MG Road, Bangalore');
    const [destination, setDestination] = useState('Lalbagh Botanical Garden, Bangalore');
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ecoTips, setEcoTips] = useState([]);

    const [errorMsg, setErrorMsg] = useState(null);

    const handleCalculateRoute = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const response = await routingService.calculateRoute({
                origin,
                destination,
                travelMode: 'TRANSIT'
            });
            setRoutes(response.data.routes || []);
            setEcoTips(response.data.ecoTips || []);
        } catch (error) {
            console.error("Error calculating route", error);
            setErrorMsg("Failed to calculate eco-route. Please verify the destination and your API connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-surface font-body-md min-h-screen pb-24">
            

<header className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-['Plus_Jakarta_Sans']">
                SmartVoyage
            </div>
<nav className="hidden md:flex items-center gap-8">
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/map-discovery">Map</a>
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/vendors">Discovery</a>
<a className="text-emerald-600 dark:text-emerald-400 font-bold font-body-md px-3 py-1 rounded-lg" href="/itinerary">Itinerary</a>
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/impact-dashboard">Impact</a>
</nav>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-emerald-500">notifications</span>
</button>
<a href="/profile" className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-emerald-500">account_circle</span>
</a>
</div>
</div>
</header>
<main className="pt-24 px-6 max-w-7xl mx-auto">

<section className="mb-10">
<h1 className="font-display-lg text-display-lg text-on-surface mb-2">Sustainable Routes</h1>
<p className="font-body-lg text-body-lg text-outline">Explore the cleanest path to your next adventure.</p>
</section>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

<div className="lg:col-span-4 space-y-6">

<div className="glass-panel p-6 rounded-[24px]">
<div className="space-y-4">
<div className="relative">
<label className="font-label-caps text-label-caps text-outline mb-2 block">ORIGIN</label>
<div className="flex items-center bg-white/30 border border-white/40 rounded-xl px-4 py-3 focus-within:border-primary-container transition-all">
<span className="material-symbols-outlined text-primary mr-3">my_location</span>
<input className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface" placeholder="Starting point" type="text" value={origin} onChange={(e) => setOrigin(e.target.value)}/>
</div>
</div>
<div className="flex justify-center -my-2 relative z-10">
<button className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform">
<span className="material-symbols-outlined">swap_vert</span>
</button>
</div>
<div className="relative">
<label className="font-label-caps text-label-caps text-outline mb-2 block">DESTINATION</label>
<div className="flex items-center bg-white/30 border border-white/40 rounded-xl px-4 py-3 focus-within:border-primary-container transition-all">
<span className="material-symbols-outlined text-primary mr-3">location_on</span>
<input className="bg-transparent border-none focus:ring-0 w-full font-body-md text-on-surface" placeholder="Where to?" type="text" value={destination} onChange={(e) => setDestination(e.target.value)}/>
</div>
</div>
<button onClick={handleCalculateRoute} disabled={loading} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all mt-4 disabled:opacity-50">
    {loading ? 'Calculating...' : 'Find Eco-Route'}
</button>
{errorMsg && <p className="text-error text-sm mt-2">{errorMsg}</p>}
</div>
</div>

<div className="glass-panel rounded-[24px] overflow-hidden aspect-square lg:aspect-video relative">
<img className="w-full h-full object-cover" data-alt="abstract stylized topographic map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU5d6FY02SyGBRyi__ZJgajnWRZ3i-blgDeJu2q_XY4F3vDBY9YITTGtcAASxlzMfyU-ceMwEsIR_T1_DB0Msogxk_QWSoxw9Opq1je0o5uB3sEoihoxcw0-NlkHeyPiFnM2Iw5vIk0sZYbg5qns-1e3DdkSpTKuMO8IAa6WSk-ulourw1LtN2sSu2vYbsqXk1i_y3m5-qx_248mDG_Kq2e4GXxOHwZWGhHBAMPAo4mQTgShj3S18tPbtKwRbxc6IXWeydgr-CWz4"/>
<div className="absolute inset-0 bg-emerald-900/10 pointer-events-none"></div>
<div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded-full flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
<span className="font-label-caps text-label-caps text-on-surface">LIVE TRAFFIC</span>
</div>
</div>
</div>

<div className="lg:col-span-8 space-y-6">
<div className="flex items-center justify-between mb-4">
<h2 className="font-headline-sm text-headline-sm">Recommended Routes</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {routes.length > 0 ? routes.map((route, idx) => (
        <div key={idx} className={`glass-panel p-6 rounded-[24px] border-2 ${idx === 0 ? 'border-[#2ECC71]' : 'border-transparent'} relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer`}>
        {idx === 0 && <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container font-label-caps text-[10px] px-3 py-1 rounded-bl-xl">ECO-CHAMPION</div>}
        <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-3xl">directions_transit</span>
        </div>
        <div className="text-right">
        <div className="font-headline-sm text-primary">{route.durationMinutes} min</div>
        <div className="font-label-caps text-outline">{route.distanceKm.toFixed(1)} KM</div>
        </div>
        </div>
        <h3 className="font-headline-sm text-on-surface mb-2">{idx === 0 ? 'Best Eco Option' : 'Alternative Route'}</h3>
        <p className="text-body-md text-outline mb-4">Optimized transit route with minimal transfers.</p>
        <div className="flex items-center gap-2">
        <span className="bg-primary/20 text-primary-container font-label-caps text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        {route.carbonSavedKg.toFixed(2)}kg CO₂ SAVED
                                    </span>
        </div>
        </div>
    )) : (
        <div className="col-span-2 py-10 text-center text-outline glass-panel rounded-3xl">
            {loading ? 'Analyzing eco-friendly paths...' : 'Enter your destination to see sustainable route options.'}
        </div>
    )}
</div>

{routes.length > 0 && (
    <div className="glass-panel p-8 rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-primary-container/30">
    <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="relative">
    <svg className="w-32 h-32 transform -rotate-90">
    <circle className="text-emerald-100" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
    <circle className="text-emerald-500" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351" strokeDashoffset={351 * (1 - routes[0].carbonSavedKg / 2)} strokeWidth="8"></circle>
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
    <span className="font-headline-sm text-primary">High</span>
    <span className="text-[8px] font-label-caps text-outline leading-tight">ECO SCORE</span>
    </div>
    </div>
    <div className="flex-1 text-center md:text-left">
    <h4 className="font-headline-sm text-on-surface mb-2">Excellent Choice!</h4>
    <p className="text-body-md text-outline mb-4">{ecoTips[0] || "By choosing this route, you're significantly reducing your carbon footprint."}</p>
    <a href="/navigation" className="bg-primary text-white font-label-caps py-3 px-8 rounded-full hover:shadow-lg active:scale-95 transition-all inline-block">START NAVIGATING</a>
    </div>
    </div>
    </div>
)}
</div>
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 rounded-t-[20px] shadow-lg">
<a href="/map-discovery" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</a>
<a href="/vendors" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</a>
<a href="/itinerary" className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 transition-all">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</a>
<a href="/impact-dashboard" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</a>
</nav>

        </div>
    );
}
