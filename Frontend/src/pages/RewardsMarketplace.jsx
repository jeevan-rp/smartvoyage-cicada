import React, { useState, useEffect } from 'react';
import { gamificationService } from '../services/api';

export default function RewardsMarketplace() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await gamificationService.getDashboard();
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching rewards stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleRedeem = async (rewardId, points) => {
        try {
            await gamificationService.redeemPoints({ vendorId: rewardId, pointsToRedeem: points });
            alert("Reward redeemed successfully!");
            // Refresh stats
            const response = await gamificationService.getDashboard();
            setStats(response.data);
        } catch (error) {
            console.error("Error redeeming reward", error);
            alert("Failed to redeem reward. Please check your token balance.");
        }
    };

    return (
        <div className="font-body-md text-on-surface">
            
<nav className="bg-white/40 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 tracking-tight">SmartVoyage</div>
<div className="hidden md:flex items-center space-x-8">
<a className="text-slate-600 font-body-md text-body-md hover:bg-white/20 transition-colors" href="/map-discovery">Map</a>
<a className="text-slate-600 font-body-md text-body-md hover:bg-white/20 transition-colors" href="/vendors">Discovery</a>
<a className="text-slate-600 font-body-md text-body-md hover:bg-white/20 transition-colors" href="/itinerary">Itinerary</a>
<a className="text-emerald-600 font-bold font-body-md text-body-md" href="/impact-dashboard">Impact</a>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-white/20 transition-all active:opacity-80 active:scale-95">
<span className="material-symbols-outlined text-slate-600">notifications</span>
</button>
<a href="/profile" className="p-2 rounded-full hover:bg-white/20 transition-all active:opacity-80 active:scale-95">
<span className="material-symbols-outlined text-slate-600">account_circle</span>
</a>
</div>
</div>
</nav>
<main className="max-w-7xl mx-auto px-6 pt-base md:pt-md pb-xl">
<header className="mb-md">
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Impact Rewards</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Redeem your sustainability points for exclusive discounts at eco-certified local gems. Every choice shapes the journey.</p>
</header>
<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-lg">
<div className="md:col-span-4 glass-card rounded-[20px] p-md flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps text-on-primary-container bg-primary-container/20 px-3 py-1 rounded-full mb-base inline-block">YOUR BALANCE</span>
<div className="flex items-baseline gap-2 mt-xs">
<span className="text-display-lg font-display-lg text-token-gold token-glow">{stats?.tokens || 0}</span>
<span className="material-symbols-outlined text-token-gold" style={{ fontVariationSettings: "'FILL' 1" }}>generating_tokens</span>
</div>
</div>
<div className="mt-md">
<div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{ width: `${(stats?.exp % 1000) / 10}%` }}></div>
</div>
<p className="text-label-caps font-label-caps text-outline mt-sm">{1000 - (stats?.exp % 1000)} PTS UNTIL NEXT LEVEL</p>
</div>
</div>
<div className="md:col-span-8 glass-card rounded-[20px] overflow-hidden relative group">
<div className="absolute inset-0 z-0">
<img alt="lush green forest canopy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCM7rATRL2eL8-c-AbmS4OQGH_LAHcGi_RpRiEBxf-QSsRXYjYjI3fgDnKbIOMmcjj-xrTPa_aTnrM_OIDnwqXprqdxxHWLh6NvDZelOJRjrTMsaSWPjiuRGq2DQKj-5WDBuxvgFAKY_LI1tY2UVOijvgIQsvSr4jPsCiuk4d3dpuP0OKJ2rB6S6F7RlYobZIO7LI8rE3ufx98j3_SeAc39pFIQ7jBWo5jAFCADG0s2tz9GKPb9SrThA5fr-dSMvqB6ZoICZF2m-U"/>
<div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-transparent"></div>
</div>
<div className="relative z-10 p-md h-full flex flex-col justify-center text-white max-w-[28rem]">
<span className="font-label-caps text-label-caps bg-token-gold text-on-tertiary-fixed px-3 py-1 rounded-full w-fit mb-base">FEATURED PARTNER</span>
<h2 className="font-headline-md text-headline-md mb-xs">The Conscious Roastery</h2>
<p className="font-body-md text-body-md opacity-90 mb-md">Redeem 1,500 points for a free zero-waste brewing kit and specialty coffee flight.</p>
<button onClick={() => handleRedeem('featured_roastery', 1500)} className="bg-primary text-white px-6 py-3 rounded-[20px] font-bold w-fit hover:brightness-110 active:scale-95 transition-all">Redeem Now</button>
</div>
</div>
</section>
<div className="flex items-center justify-between mb-md">
<h3 className="font-headline-sm text-headline-sm">Local Redemption Store</h3>
</div>
<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
<div className="glass-card rounded-[20px] overflow-hidden group">
<div className="h-48 relative">
<img alt="organic local produce" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4XkMBc4OuDHoOyDd4GwrCnxp90eW5qMSVsFX5dCNF9GmQpDv8kKbZZqUmkUdmH_cg_egX0kDK6hc_b9DKtAruk9EVpAri8N3w_XqyVrdPZMSKPIFG5C3zo7NrdClqt7kAOPvxqS8DpCQuhgbjRYZWOaEugRcHDRUQGlm3fCuXKdob5ZU5Xoe3E7pcEiY4-XOv_xT5I96A1ErLqPGes6n-0bfrBojiNcRZM8oqF9RqG3UcECTserhYp20HbncCvtHDTYs11kK-6e0"/>
</div>
<div className="p-md">
<h4 className="font-headline-sm text-[18px] mb-xs">Farm-to-Table Voucher</h4>
<p className="text-sm text-slate-500 mb-md line-clamp-2">25% discount on all seasonal courses at Green Earth Bistro.</p>
<div className="flex justify-between items-center">
<div className="flex items-center gap-1 text-token-gold font-bold">
<span>850</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>generating_tokens</span>
</div>
<button onClick={() => handleRedeem('voucher_25', 850)} className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-colors">Redeem</button>
</div>
</div>
</div>
<div className="glass-card rounded-[20px] overflow-hidden group">
<div className="h-48 relative">
<img alt="yoga at sunrise" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq4vcf4KnXSG1ZFCyabhCCoLvQaCiK27sv3rnHcdO5HQbuOKUueAPGjss_6LWEgHU-vPgSbgUC2cGa6dHquC92Ezl7yX5abzvzca4UT-cQ_khgz1hEw4QwPFa5XioczHAznbFg4yVUUpIhbltoNUR7RZlHDXnA2d9lxnWQzriT5_9Qj93Yr7igRpNOYWwGLzGAUDG8jRuypu5r_pMqGEP5Zrh7K3CqyPYLLY-2pTNJYMgkLk0Tv2XYrHzz-le24meOeV-GLdXACXc"/>
</div>
<div className="p-md">
<h4 className="font-headline-sm text-[18px] mb-xs">Wellness Day Pass</h4>
<p className="text-sm text-slate-500 mb-md line-clamp-2">Full access to solar-powered spa and guided meditation session.</p>
<div className="flex justify-between items-center">
<div className="flex items-center gap-1 text-token-gold font-bold">
<span>2,200</span>
<span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>generating_tokens</span>
</div>
<button onClick={() => handleRedeem('wellness_pass', 2200)} className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-colors">Redeem</button>
</div>
</div>
</div>
</section>
<section className="mt-lg">
<div className="glass-card rounded-[24px] p-lg flex flex-col md:flex-row items-center gap-md border-emerald-500/20">
<div className="flex-shrink-0 w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
</div>
<div className="flex-grow">
<h3 className="font-headline-sm text-headline-sm mb-xs">Tree Planting Initiative</h3>
<p className="text-body-md text-on-surface-variant">Don't need a discount? Donate 5,000 points to plant a mangrove tree in coastal ecosystems.</p>
</div>
<button onClick={() => handleRedeem('tree_planting', 5000)} className="bg-token-gold text-on-surface-variant px-8 py-4 rounded-[20px] font-bold hover:scale-105 transition-transform">Donate Points</button>
</div>
</section>
</main>
<div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/40 backdrop-blur-xl flex justify-around items-center px-4 pb-4 pt-2 border-t border-white/30 rounded-t-[20px] shadow-lg">
<a className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150" href="/map-discovery">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150" href="/vendors">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</a>
<a className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150" href="/itinerary">
<span className="material-symbols-outlined">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</a>
<a className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 rounded-2xl px-4 py-1.5 active:scale-90 transition-all duration-150" href="/impact-dashboard">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</a>
</div>

        </div>
    );
}
