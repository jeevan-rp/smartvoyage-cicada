import React from 'react';

export default function MapDiscovery() {
    return (
        <div className="bg-surface font-body-md text-on-surface overflow-hidden">
            

<nav className="fixed top-0 left-0 w-full z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="flex items-center gap-base">
<span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-headline-sm">SmartVoyage</span>
</div>
<div className="hidden md:flex items-center gap-md">
<a className="text-emerald-600 dark:text-emerald-400 font-bold font-body-md" href="#">Map</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="#">Discovery</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="#">Itinerary</a>
<a className="text-slate-600 dark:text-slate-400 hover:bg-white/20 transition-colors px-3 py-1 rounded-lg font-body-md" href="#">Impact</a>
</div>
<div className="flex items-center gap-sm">
<button className="p-2 hover:bg-white/20 transition-colors rounded-full active:opacity-80 active:scale-95 transition-all">
<span className="material-symbols-outlined text-slate-600">notifications</span>
</button>
<button className="p-2 hover:bg-white/20 transition-colors rounded-full active:opacity-80 active:scale-95 transition-all">
<span className="material-symbols-outlined text-slate-600">account_circle</span>
</button>
</div>
</div>
</nav>

<main className="map-container">
<div className="w-full h-full relative">
<img alt="Detailed satellite navigation map of a coastal city showing green spaces, waterways, and urban grid with soft atmospheric haze" className="w-full h-full object-cover grayscale-[0.2] brightness-105" data-location="Stockholm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjxd7Iug3ijMJuRb49qrHYHFDchUHymGXBZL5-ZMmvd9ZsqMUx8QhbB9mBRiIWJeLGu52QTE8_rvqGJtSk5dh2hZ5sjsD7eEf-k46wJQEonlB3B0xwXcNoT3SXqQ2cUsjj7-bIeBwYIlCGVg3mpWoQo0NKK69R1NnoWdT17w4FShSZ4GQC2YPP_3aq4sM_-lJyXYZueVsbbp8b7o5bXiI75oQIEO5unQ7B43OO2u78nybbMAmxR016XtZVNguG0uUZxKMMA6AMTqU"/>


<div className="absolute top-[35%] left-[42%] group cursor-pointer">
<div className="density-ring density-low glass-panel shadow-lg">
<div className="bg-primary w-2 h-2 rounded-full"></div>
</div>
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
<span className="text-label-caps font-label-caps text-on-surface">Royal National Park</span>
</div>
</div>

<div className="absolute top-[52%] left-[58%] group cursor-pointer">
<div className="density-ring density-mid glass-panel shadow-lg">
<div className="bg-tertiary-container w-2 h-2 rounded-full"></div>
</div>
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
<span className="text-label-caps font-label-caps text-on-surface">Old Town Harbor</span>
</div>
</div>

<div className="absolute top-[45%] left-[25%] group cursor-pointer">
<div className="density-ring density-high glass-panel shadow-lg">
<div className="bg-error w-2 h-2 rounded-full"></div>
</div>
<div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass-panel px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
<span className="text-label-caps font-label-caps text-on-surface">Central Metro Terminal</span>
</div>
</div>
</div>
</main>

<div className="fixed bottom-[110px] right-6 z-50 md:bottom-24">
<button className="bg-primary-container text-on-primary-container w-14 h-14 rounded-[20px] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group">
<span className="material-symbols-outlined text-[32px]">directions</span>
<span className="absolute right-full mr-4 bg-primary text-white text-label-caps font-label-caps px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Start Routing</span>
</button>
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

<a className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 active:scale-90 transition-transform duration-150" href="#">
<span className="material-symbols-outlined" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Map</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="#">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Discovery</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="#">
<span className="material-symbols-outlined">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-0.5">Itinerary</span>
</a>

<a className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all" href="#">
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
<div className="glass-panel p-md rounded-[24px] w-64 shadow-lg border-l-4 border-tertiary-container">
<div className="flex items-center gap-base mb-xs">
<span className="material-symbols-outlined text-tertiary-container">workspace_premium</span>
<span className="text-label-caps font-label-caps text-slate-500 uppercase tracking-widest">Hidden Gem</span>
</div>
<h4 className="font-bold text-on-surface">Eco-Cafe Solstice</h4>
<p className="text-[13px] text-slate-600 mt-1">1.2km away • Zero Waste Certified</p>
<button className="mt-base text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
</div>

        </div>
    );
}
