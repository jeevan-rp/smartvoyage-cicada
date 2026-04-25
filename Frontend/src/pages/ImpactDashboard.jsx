import React, { useState, useEffect } from 'react';
import { gamificationService } from '../services/api';

export default function ImpactDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await gamificationService.getDashboard();
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading your impact...</div>;

    const { impact, gamification, activity } = dashboardData || {
        impact: { carbonSavedKg: 0, treesEquivalent: 0, localSpendINR: 0 },
        gamification: { totalPoints: 0, level: 1, achievements: [] },
        activity: { totalRoutes: 0, totalVendors: 0 }
    };

    return (
        <div className="bg-background font-body-md text-on-surface min-h-screen">
            
<header className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">SmartVoyage</div>
<nav className="hidden md:flex items-center gap-8">
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/map-discovery">Map</a>
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/vendors">Discovery</a>
<a className="text-slate-600 dark:text-slate-400 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/itinerary">Itinerary</a>
<a className="text-emerald-600 dark:text-emerald-400 font-bold font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/impact-dashboard">Impact</a>
</nav>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-slate-600 hover:bg-white/20 p-2 rounded-full transition-all">notifications</button>
<button className="material-symbols-outlined text-slate-600 hover:bg-white/20 p-2 rounded-full transition-all">account_circle</button>
</div>
</div>
</header>
<main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
<div className="mb-lg">
<h1 className="font-display-lg text-display-lg text-on-surface text-shadow-sm mb-xs">Your Green Legacy</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Tracking your sustainable footprints across the globe.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<section className="md:col-span-8 flex flex-col gap-gutter">
<div className="glass-panel rounded-[24px] p-md">
<div className="flex justify-between items-center mb-md">
<div>
<h2 className="font-headline-sm text-headline-sm text-on-surface">Carbon Offset Analytics</h2>
<p className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Net Savings (kg CO2e)</p>
</div>
<div className="flex gap-2">
<span className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold">Live Data</span>
</div>
</div>
<div className="relative h-64 w-full mb-md">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
<defs>
<linearGradient id="lineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" stopColor="#2ecc71" stopOpacity="0.3"></stop>
<stop offset="100%" stopColor="#2ecc71" stopOpacity="0"></stop>
</linearGradient>
</defs>
<path d="M0,150 Q100,140 200,120 T400,80 T600,40 T800,20" fill="none" stroke="#2ecc71" strokeLinecap="round" strokeWidth="4"></path>
<path d="M0,150 Q100,140 200,120 T400,80 T600,40 T800,20 V200 H0 Z" fill="url(#lineGradient)"></path>
<circle cx="200" cy="120" fill="#2ecc71" r="6"></circle>
<circle cx="400" cy="80" fill="#2ecc71" r="6"></circle>
<circle cx="600" cy="40" fill="#2ecc71" r="6"></circle>
</svg>
<div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-outline font-label-caps">
<span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
</div>
</div>
<div className="grid grid-cols-3 gap-md">
<div className="text-center">
<p className="font-label-caps text-label-caps text-outline">Total Saved</p>
<p className="font-headline-md text-headline-md text-primary">{impact.carbonSavedKg.toFixed(1)}<span className="text-sm ml-1">kg</span></p>
</div>
<div className="text-center">
<p className="font-label-caps text-label-caps text-outline">Routes</p>
<p className="font-headline-md text-headline-md text-secondary">{activity.totalRoutes}</p>
</div>
<div className="text-center">
<p className="font-label-caps text-label-caps text-outline">Vendors</p>
<p className="font-headline-md text-headline-md text-tertiary">{activity.totalVendors}</p>
</div>
</div>
</div>
<div className="glass-panel rounded-[24px] p-md">
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Sustainability Badges</h3>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
{gamification.achievements.map((badge, idx) => (
    <div key={idx} className="flex flex-col items-center group">
    <div className="w-16 h-16 rounded-full bg-primary-container/20 border-2 border-primary-container flex items-center justify-center mb-sm shadow-[0_0_15px_rgba(46,204,113,0.3)] group-hover:scale-110 transition-transform">
    <span className="text-3xl">{badge.icon}</span>
    </div>
    <p className="font-label-caps text-label-caps text-center">{badge.name}</p>
    </div>
))}
{gamification.achievements.length === 0 && <p className="col-span-4 text-center text-outline">Complete activities to earn badges!</p>}
</div>
</div>
</section>
<aside className="md:col-span-4 flex flex-col gap-gutter">
<div className="glass-panel rounded-[24px] overflow-hidden">
<div className="p-md bg-primary-container text-on-primary-container flex justify-between items-center">
<h3 className="font-headline-sm text-headline-sm">Stewardship Score</h3>
<span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
</div>
<div className="p-md text-center">
<div className="relative inline-flex items-center justify-center mb-md">
<svg className="w-32 h-32 transform -rotate-90">
<circle className="text-surface-container-highest" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="8"></circle>
<circle className="text-primary-container" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset={364.4 - (gamification.totalPoints % 500) / 500 * 364.4} strokeWidth="8"></circle>
</svg>
<div className="absolute flex flex-col items-center">
<span className="text-3xl font-extrabold text-on-surface">{gamification.level}</span>
<span className="text-[10px] font-label-caps text-outline uppercase">Level</span>
</div>
</div>
<p className="font-body-md text-body-md text-on-surface-variant mb-md">You're making a real difference in the community.</p>
<button className="w-full bg-primary py-3 rounded-full text-on-primary font-bold hover:opacity-90 active:scale-95 transition-all">Claim Rewards</button>
</div>
</div>
<div className="glass-panel rounded-[24px] p-md">
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Token Rewards</h3>
<div className="flex items-center gap-md p-sm bg-white/20 rounded-xl mb-sm border border-white/40">
<div className="w-12 h-12 bg-gradient-to-tr from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg">
<span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm text-on-surface leading-none">{gamification.totalPoints}</p>
<p className="font-label-caps text-label-caps text-outline uppercase tracking-tight">Eco-Tokens Earned</p>
</div>
</div>
<div className="space-y-sm">
<div className="flex items-center justify-between text-sm">
<span className="text-on-surface-variant">Eco Points</span>
<span className="font-bold text-primary">+{gamification.ecoPoints}</span>
</div>
<div className="flex items-center justify-between text-sm">
<span className="text-on-surface-variant">Community Points</span>
<span className="font-bold text-primary">+{gamification.communityPoints}</span>
</div>
<hr className="border-white/30"/>
<a className="text-secondary font-label-caps text-xs hover:underline flex items-center justify-center gap-1" href="/rewards">VIEW REDEMPTION OPTIONS <span className="material-symbols-outlined text-xs">arrow_forward</span></a>
</div>
</div>
<div className="rounded-[24px] overflow-hidden relative h-48 shadow-lg">
<img alt="Environmental Conservation" className="w-full h-full object-cover" data-alt="Close-up of a young green seedling sprouting from rich dark soil with soft bokeh forest background and morning sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3xqbLwVoxq4t56BUjxyoDtJYnybREW6kprYXZ4HPEczdTzXCBrDTOiSBVgEjs3rVp2DjLqM7N--_rBmL4X4-ey3I_6QEIKH6J5zlFyWCsYUYMHSTfjDjnljW9UStc9_s-vyM7bEH24XhPMLKI4baUfEukwPxNMOXpjdRhIx3X-avyEyF7q_3qIvsdZ_LzwG_6w2cvF4f6vGhL9__Ha5xg9ysJcPrFTe-23w3xLmwGAxQw4AXZKHknj5Nt04BY4G5pD0Z6xRC3sNc"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-md">
<p className="text-white font-label-caps text-[10px] uppercase mb-1">Your Direct Impact</p>
<p className="text-white font-bold text-lg">{impact.treesEquivalent} Trees planted through your eco-efforts.</p>
</div>
</div>
</aside>
</div>
</main>
<footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 rounded-t-[20px] shadow-lg">
<a href="/map-discovery" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined" data-icon="map">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</a>
<a href="/vendors" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined" data-icon="explore">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</a>
<a href="/itinerary" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined" data-icon="event_note">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</a>
<a href="/impact-dashboard" className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 active:scale-90 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="eco" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</a>
</footer>

        </div>
    );
}
