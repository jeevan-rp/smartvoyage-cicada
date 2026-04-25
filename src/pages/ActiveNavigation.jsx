import React from 'react';

export default function ActiveNavigation() {
    return (
        <div className="bg-background font-body-md text-on-surface overflow-hidden h-screen flex flex-col">
            
<header className="fixed top-0 left-0 right-0 z-40 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="flex items-center gap-base">
<span className="text-xl font-black text-emerald-600 tracking-tight font-display-lg">SmartVoyage</span>
</div>
<div className="flex items-center gap-gutter">
<div className="hidden md:flex gap-md">
<button className="text-emerald-600 font-bold font-body-md">Map</button>
<button className="text-slate-600 hover:bg-white/20 transition-colors font-body-md">Discovery</button>
<button className="text-slate-600 hover:bg-white/20 transition-colors font-body-md">Itinerary</button>
<button className="text-slate-600 hover:bg-white/20 transition-colors font-body-md">Impact</button>
</div>
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-slate-600 p-xs rounded-full hover:bg-white/20 transition-all cursor-pointer">notifications</span>
<span className="material-symbols-outlined text-slate-600 p-xs rounded-full hover:bg-white/20 transition-all cursor-pointer">account_circle</span>
</div>
</div>
</div>
</header>
<main className="relative flex-grow w-full h-full">
<div className="absolute inset-0 z-0">
<div className="w-full h-full bg-slate-200" data-location="San Francisco Coastline" style={{  }}>
<img alt="Detailed minimalist city map with green navigation path" className="w-full h-full object-cover grayscale-[20%] opacity-80" data-alt="Modern minimalist city map view from top down with a vibrant neon green polyline path winding through urban grid and coastal park" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJIhEY5OGVXneYa7hMUlJGzSxwVa_vh12bBATH0ElfYfRo1Bdu_NCjAzCg5YhrmgCOnC7zfazL9lawlkk2vjKYwq-rzXkxNQRwX7PM3WQ-2azBxRoNZt6uPEU8w85hHDgKPMA_BfxfhUNNFmHHwjFj2LLWTYAaVIZnF_lqfvJ9K3meoZi4pHAjDgEHfszwJDCqeQOdy0ejGrT16VSYjZ6WUWPFmhkc-RkQJPMsJpFg3bFlKZM61VvNp4vqf-T9zAY80i6LnzgLMpI"/>
<svg className="absolute inset-0 w-full h-full pointer-events-none" preserveaspectratio="none" viewbox="0 0 1000 1000">
<path className="drop-shadow-[0_0_10px_rgba(46,204,113,0.8)]" d="M200,800 L350,650 L450,680 L600,450 L750,400 L850,250" fill="none" stroke="#2ecc71" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></path>
<circle cx="200" cy="800" fill="white" r="10" stroke="#2ecc71" stroke-width="3"></circle>
<circle className="animate-pulse" cx="850" cy="250" fill="#2ecc71" r="12"></circle>
</svg>
</div>
</div>
<div className="absolute top-margin left-1/2 -translate-x-1/2 z-20 w-full max-w-[28rem] px-md pt-lg">
<div className="glass-panel rounded-full px-md py-sm flex items-center justify-between shadow-lg">
<div className="flex items-center gap-sm">
<div className="bg-primary-container p-xs rounded-full flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
</div>
<div>
<p className="text-label-caps text-on-surface-variant opacity-70">CO2 SAVINGS</p>
<p className="font-headline-sm text-primary leading-none">1.24 kg</p>
</div>
</div>
<div className="h-base w-px bg-white/30 self-stretch"></div>
<div className="text-right">
<p className="text-label-caps text-on-surface-variant opacity-70">EST. ARRIVAL</p>
<p className="font-body-lg font-bold text-on-surface">14:20</p>
</div>
</div>
</div>
<div className="absolute top-[160px] left-margin z-20 w-80 space-y-md">
<div className="glass-panel rounded-xl p-md shadow-xl border-l-4 border-l-primary-container">
<div className="flex items-start gap-md">
<div className="bg-primary/10 p-sm rounded-lg">
<span className="material-symbols-outlined text-primary text-[32px]">turn_right</span>
</div>
<div>
<p className="text-body-lg font-bold text-on-surface">Turn right</p>
<p className="text-body-md text-on-surface-variant">onto Coastal Boulevard</p>
<p className="text-label-caps text-primary mt-xs">IN 450 METERS</p>
</div>
</div>
</div>
<div className="glass-panel rounded-xl p-md shadow-lg opacity-80 scale-95 origin-top">
<div className="flex items-center gap-md">
<div className="bg-secondary-container/30 p-sm rounded-lg">
<span className="material-symbols-outlined text-secondary">local_library</span>
</div>
<div>
<p className="text-body-md font-semibold text-on-surface">Eco-Fact Nearby</p>
<p className="text-label-caps text-on-surface-variant">THE HISTORIC PIER USES 100% SOLAR</p>
</div>
</div>
</div>
</div>
<div className="absolute bottom-margin left-1/2 -translate-x-1/2 z-30 w-full max-w-[24rem] px-md pb-xl">
<div className="bg-on-surface text-surface rounded-2xl p-md shadow-2xl flex items-center justify-between emerald-glow">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
</div>
<div>
<p className="font-bold font-body-md">Points Earned!</p>
<p className="text-sm opacity-80">You just earned +15 EcoTokens</p>
</div>
</div>
<span className="material-symbols-outlined text-surface-container-highest cursor-pointer hover:rotate-90 transition-transform">close</span>
</div>
</div>
<div className="absolute right-margin bottom-[120px] z-20 flex flex-col gap-sm">
<button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center shadow-lg hover:bg-white/60 transition-all">
<span className="material-symbols-outlined text-on-surface">my_location</span>
</button>
<button className="w-12 h-12 glass-panel rounded-full flex items-center justify-center shadow-lg hover:bg-white/60 transition-all">
<span className="material-symbols-outlined text-on-surface">layers</span>
</button>
<button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
</button>
</div>
</main>
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 rounded-t-[20px] shadow-lg">
<div className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 rounded-2xl px-4 py-1.5 transition-all">
<span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined text-[24px]">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined text-[24px]">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined text-[24px]">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</div>
</nav>

        </div>
    );
}
