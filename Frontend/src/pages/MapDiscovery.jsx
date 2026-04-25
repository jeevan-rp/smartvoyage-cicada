import React, { useState, useEffect } from 'react';
import { crowdService } from '../services/api';

export default function MapDiscovery() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }, []);

    useEffect(() => {
        const fetchLiveCrowdData = async () => {
            try {
                const response = await crowdService.getLiveCrowd();
                setLocations(response.data.locations || []);
            } catch (error) {
                console.error("Error fetching crowd data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveCrowdData();
    }, []);

    const getDensityClass = (density) => {
        if (density < 0.4) return 'density-low';
        if (density < 0.7) return 'density-mid';
        return 'density-high';
    };

    const getDensityColor = (density) => {
        if (density < 0.4) return 'bg-primary';
        if (density < 0.7) return 'bg-tertiary-container';
        return 'bg-error';
    };

    return (
        <div className="bg-surface font-body-md text-on-surface overflow-hidden">
            

<nav className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="flex items-center gap-base">
<span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-headline-sm">SmartVoyage</span>
</div>
<div className="hidden md:flex items-center gap-md">
<a className="text-emerald-600 dark:text-emerald-400 font-bold font-body-md" href="/map-discovery">Map</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="/vendors">Discovery</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="/itinerary">Itinerary</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="/impact-dashboard">Impact</a>
</div>
<div className="flex items-center gap-sm">
<button className="p-2 hover:bg-white/20 transition-colors rounded-full active:opacity-80 active:scale-95 transition-all">
<span className="material-symbols-outlined text-slate-600">notifications</span>
</button>
<a href="/profile" className="p-2 hover:bg-white/20 transition-colors rounded-full active:opacity-80 active:scale-95 transition-all">
<span className="material-symbols-outlined text-slate-600">account_circle</span>
</a>
</div>
</div>
</nav>

<main className="map-container h-screen relative">
<div className="w-full h-full relative">
<img alt="Detailed satellite navigation map" className="w-full h-full object-cover grayscale-[0.2] brightness-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjxd7Iug3ijMJuRb49qrHYHFDchUHymGXBZL5-ZMmvd9ZsqMUx8QhbB9mBRiIWJeLGu52QTE8_rvqGJtSk5dh2hZ5sjsD7eEf-k46wJQEonlB3B0xwXcNoT3SXqQ2cUsjj7-bIeBwYIlCGVg3mpWoQo0NKK69R1NnoWdT17w4FShSZ4GQC2YPP_3aq4sM_-lJyXYZueVsbbp8b7o5bXiI75oQIEO5unQ7B43OO2u78nybbMAmxR016XtZVNguG0uUZxKMMA6AMTqU"/>

{locations.map((loc, idx) => (
    <div key={idx} className="absolute group cursor-pointer" style={{ top: `${40 + (idx * 5)}%`, left: `${30 + (idx * 8)}%` }}>
    <div className={`density-ring ${getDensityClass(loc.crowdDensity)} glass-panel shadow-lg`}>
    <div className={`${getDensityColor(loc.crowdDensity)} w-2 h-2 rounded-full`}></div>
    </div>
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    <span className="text-label-caps font-label-caps text-on-surface">{loc.name} - {(loc.crowdDensity * 100).toFixed(0)}% busy</span>
    </div>
    </div>
))}
</div>
</main>

<div className="fixed bottom-[110px] right-6 z-50 md:bottom-24">
<a href="/route-planning" className="bg-primary-container text-on-primary-container w-14 h-14 rounded-[20px] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
<span className="material-symbols-outlined text-[32px]">directions</span>
<span className="absolute right-full mr-4 bg-primary text-white text-label-caps font-label-caps px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Start Routing</span>
</a>
</div>

<div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[32rem] px-6 z-40 md:bottom-28">
<div className="glass-panel rounded-[24px] p-2 flex items-center gap-2 shadow-xl border border-white/40">
<div className="flex-1 flex items-center px-4 gap-3">
<span className="material-symbols-outlined text-slate-500">search</span>
<input className="bg-transparent border-none focus:ring-0 text-body-md w-full placeholder-slate-500" placeholder="Where to next, sustainable traveler?" type="text"/>
</div>
<button className="bg-white/60 p-2 rounded-full hover:bg-white/80 transition-colors">
<span className="material-symbols-outlined text-slate-600">tune</span>
</button>
</div>
</div>

<nav className="fixed bottom-0 left-0 w-full z-50 bg-white/40 backdrop-blur-xl border-t border-white/30 rounded-t-[20px] shadow-lg">
<div className="flex justify-around items-center px-4 pb-4 pt-2">

<a className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 active:scale-90 transition-transform duration-150" href="/map-discovery">
<span className="material-symbols-outlined" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Map</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="/vendors">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Discovery</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="/itinerary">
<span className="material-symbols-outlined">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Itinerary</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="/impact-dashboard">
<span className="material-symbols-outlined">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Impact</span>
</a>
</div>
</nav>

<div className="fixed top-24 left-6 z-40 space-y-4 hidden lg:block">
<div className="glass-panel p-md rounded-[24px] w-64 shadow-lg">
<div className="flex items-center justify-between mb-sm">
<h3 className="font-headline-sm text-on-surface text-[18px]">Sustainability</h3>
<span className="material-symbols-outlined text-primary">auto_awesome</span>
</div>
<div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden mb-xs">
<div className="absolute top-0 left-0 h-full bg-primary-container w-[78%]"></div>
</div>
<div className="flex justify-between items-center">
<span className="text-label-caps font-label-caps text-slate-500">Current Score</span>
<span className="text-primary font-bold">78%</span>
</div>
<div className="mt-md p-sm bg-primary/5 rounded-xl border border-primary/10">
<p className="text-[12px] leading-tight text-on-primary-container font-medium">
                    You've saved 4.2kg of CO2 today by choosing green routes.
                </p>
</div>
</div>
</div>

        </div>
    );
}
