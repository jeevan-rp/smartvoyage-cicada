import React, { useState, useEffect } from 'react';
import { authService, gamificationService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileEcoStats() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    authService.getProfile(),
                    gamificationService.getDashboard()
                ]);
                setProfile(profileRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/onboarding');
    };

    return (
        <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen pb-32">
            

<header className="bg-white/40 backdrop-blur-lg fixed top-0 w-full z-50 border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 tracking-tight font-['Plus_Jakarta_Sans']">
                SmartVoyage
            </div>
<div className="flex items-center gap-4">
<button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
    Logout
</button>
<button className="p-2 text-emerald-600 font-bold hover:bg-white/20 transition-colors rounded-full border-2 border-emerald-500/20">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
</button>
</div>
</div>
</header>
<main className="pt-24 px-6 max-w-7xl mx-auto">

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-gutter">

<div className="md:col-span-8 glass-panel rounded-[32px] p-md flex flex-col md:flex-row items-center md:items-start gap-md">
<div className="relative">
<img className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" alt="profile" src={profile?.photoURL || "https://lh3.googleusercontent.com/a/default-user"}/>
</div>
<div className="flex-1 text-center md:text-left">
<h1 className="font-headline-md text-headline-md text-on-surface mb-xs">{profile?.displayName || "Sustainable Voyager"}</h1>
<p className="font-body-md text-on-surface-variant mb-md flex items-center justify-center md:justify-start gap-2">
<span className="material-symbols-outlined text-sm">mail</span>
                        {profile?.email}
                    </p>

<div className="inline-flex items-center gap-3 bg-white/30 rounded-full px-4 py-2 border border-white/50">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Member Since</span>
<div className="flex items-center gap-1 font-body-md font-bold text-primary">
<span>{new Date(profile?.createdAt).getFullYear() || 2024}</span>
</div>
</div>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-24 h-24 rounded-full circular-progress relative flex items-center justify-center shadow-inner">
<div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
<span className="font-display-lg text-headline-sm text-primary">{stats?.level || 1}</span>
<span className="font-label-caps text-[10px] text-on-surface-variant">LVL</span>
</div>
</div>
<span className="font-label-caps text-label-caps text-on-surface-variant">Impact Level</span>
</div>
</div>

<div className="md:col-span-4 glass-panel rounded-[32px] p-md flex flex-col justify-between overflow-hidden relative">
<div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/20 blur-3xl rounded-full"></div>
<div>
<h2 className="font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">EcoPoints Total</h2>
<div className="flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-primary">{stats?.tokens || 0}</span>
<span className="material-symbols-outlined text-token-gold" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
</div>
</div>
<div className="mt-md">
<div className="w-full bg-white/30 h-2 rounded-full mb-2">
<div className="bg-primary-container h-full rounded-full" style={{ width: `${(stats?.exp % 1000) / 10}%` }}></div>
</div>
<div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
<span>{1000 - (stats?.exp % 1000)} XP to next level</span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

<div className="md:col-span-2 glass-panel rounded-[32px] p-md">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm">Achievement Badges</h3>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
{stats?.badges?.map((badge, idx) => (
    <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className="w-16 h-16 rounded-2xl bg-token-gold/10 flex items-center justify-center border border-token-gold/30 group-hover:scale-110 transition-transform">
    <span className="material-symbols-outlined text-token-gold text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
    </div>
    <span className="font-label-caps text-center">{badge}</span>
    </div>
)) || <p className="text-on-surface-variant text-sm">Start your journey to earn badges!</p>}
</div>
</div>

<div className="glass-panel rounded-[32px] p-md bg-secondary/10">
<h3 className="font-headline-sm text-headline-sm mb-md">Trip Stats</h3>
<div className="space-y-md">
<div className="flex justify-between items-center border-b border-white/20 pb-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">co2</span>
<span className="font-body-md">CO2 Saved (kg)</span>
</div>
<span className="font-bold text-headline-sm">{stats?.carbonSaved?.toFixed(1) || 0}</span>
</div>
<div className="flex justify-between items-center pb-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">explore</span>
<span className="font-body-md">Locations Explored</span>
</div>
<span className="font-bold text-headline-sm">{(stats?.exp / 50).toFixed(0)}</span>
</div>
</div>
</div>
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-lg rounded-t-[20px]">
<a href="/map-discovery" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</a>
<a href="/vendors" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</a>
<a href="/itinerary" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</a>
<a href="/impact-dashboard" className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</a>
</nav>

        </div>
    );
}
