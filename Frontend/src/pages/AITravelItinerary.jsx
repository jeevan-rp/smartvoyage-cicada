import React, { useState, useEffect } from 'react';
import { crowdService } from '../services/api';

export default function AITravelItinerary() {
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                // For demo, we optimize for a specific location
                const response = await crowdService.optimizeItinerary({
                    destination: 'Bangalore',
                    preferences: ['eco', 'hidden_gems']
                });
                setItinerary(response.data);
            } catch (error) {
                console.error("Error fetching itinerary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItinerary();
    }, []);

    return (
        <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen pb-32">
            

<header className="sticky top-0 z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-primary tracking-tight font-headline-sm">
                SmartVoyage
            </div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="/map-discovery">Map</a>
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="/vendors">Discovery</a>
<a className="text-primary font-bold font-body-md" href="/itinerary">Itinerary</a>
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="/impact-dashboard">Impact</a>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
<a href="/profile" className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">account_circle</span>
</a>
</div>
</div>
</header>
<main className="max-w-4xl mx-auto px-6 pt-10">

<div className="mb-12">
<h1 className="text-secondary font-display-lg text-display-lg mb-2">My Itinerary</h1>
<p className="text-on-surface-variant font-body-lg">{itinerary?.tripName || "Sustainable Exploration"}</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
<span className="text-label-caps font-label-caps text-on-surface-variant mb-4">SUSTAINABILITY SCORE</span>
<div className="flex items-end gap-2">
<span className="text-headline-md font-headline-md text-primary">{itinerary?.overallScore || "92"}</span>
<span className="text-body-md font-body-md mb-1.5">/100</span>
</div>
</div>
<div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
<span className="text-label-caps font-label-caps text-on-surface-variant mb-4">SUGGESTED SPOTS</span>
<div className="flex items-end gap-2">
<span className="text-headline-md font-headline-md text-secondary">{itinerary?.timeline?.length || "0"}</span>
<span className="text-body-md font-body-md mb-1.5">locations</span>
</div>
</div>
</div>

<div className="relative space-y-12">
<div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 timeline-line -translate-x-1/2 hidden md:block"></div>

{loading ? (
    <div className="text-center py-20 text-outline">Generating your eco-optimized itinerary...</div>
) : itinerary?.timeline?.map((item, idx) => (
    <div key={idx} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div className={`${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'}`}>
    <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps mb-4">
        {item.time}
    </div>
    <h3 className="font-headline-sm text-headline-sm text-secondary mb-2">{item.location}</h3>
    <p className="text-on-surface-variant mb-4">{item.activity}</p>
    <div className={`flex gap-2 ${idx % 2 === 0 ? 'md:justify-end' : ''}`}>
    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">ECO-FRIENDLY</span>
    </div>
    </div>
    <div className={`${idx % 2 === 0 ? 'md:pl-12' : 'md:text-right md:pr-12 md:order-1'}`}>
    <div className="glass-panel rounded-[24px] p-6 border-l-4 border-l-primary-container">
    <div className="flex items-center gap-2 mb-3">
    <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
    <span className="font-label-caps text-label-caps text-on-surface-variant">SUSTAINABILITY TIP</span>
    </div>
    <p className="text-body-md text-on-surface italic">"{item.sustainabilityTip || "Choose local transit to reach this spot."}"</p>
    </div>
    </div>
    <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-white border-2 border-primary -translate-x-1/2 z-10 hidden md:block"></div>
    </div>
))}
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-lg rounded-t-[20px] md:hidden">
<a href="/map-discovery" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Map</span>
</a>
<a href="/vendors" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Discovery</span>
</a>
<a href="/itinerary" className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 rounded-2xl px-4 py-1.5 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Itinerary</span>
</a>
<a href="/impact-dashboard" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Impact</span>
</a>
</nav>

<button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:bg-primary/90">
<span className="material-symbols-outlined text-2xl">add</span>
</button>

        </div>
    );
}
