import React from 'react';

export default function AITravelItinerary() {
    return (
        <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen pb-32">
            

<header className="sticky top-0 z-50 bg-white/40 backdrop-blur-lg border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-primary tracking-tight font-headline-sm">
                SmartVoyage
            </div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="#">Map</a>
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="#">Discovery</a>
<a className="text-primary font-bold font-body-md" href="#">Itinerary</a>
<a className="text-slate-600 font-body-md font-semibold hover:text-primary transition-colors" href="#">Impact</a>
</div>
<div className="flex items-center gap-4">
<button className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">notifications</span>
</button>
<button className="p-2 rounded-full hover:bg-white/20 transition-all active:scale-95">
<span className="material-symbols-outlined text-primary">account_circle</span>
</button>
</div>
</div>
</header>
<main className="max-w-4xl mx-auto px-6 pt-10">

<div className="mb-12">
<h1 className="text-secondary font-display-lg text-display-lg mb-2">My Itinerary</h1>
<p className="text-on-surface-variant font-body-lg">Kyoto Eco-Exploration • Oct 12 - 15</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
<span className="text-label-caps font-label-caps text-on-surface-variant mb-4">SUSTAINABILITY SCORE</span>
<div className="flex items-end gap-2">
<span className="text-headline-md font-headline-md text-primary">94</span>
<span className="text-body-md font-body-md mb-1.5">/100</span>
</div>
</div>
<div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
<span className="text-label-caps font-label-caps text-on-surface-variant mb-4">DISTANCE TRAVELLED</span>
<div className="flex items-end gap-2">
<span className="text-headline-md font-headline-md text-secondary">12.4</span>
<span className="text-body-md font-body-md mb-1.5">km</span>
</div>
</div>
<div className="glass-panel rounded-[20px] p-6 flex flex-col justify-between">
<span className="text-label-caps font-label-caps text-on-surface-variant mb-4">GEMS DISCOVERED</span>
<div className="flex items-end gap-2">
<span className="text-headline-md font-headline-md text-tertiary">08</span>
<span className="text-body-md font-body-md mb-1.5">locations</span>
</div>
</div>
</div>

<div className="relative space-y-12">

<div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 timeline-line -translate-x-1/2 hidden md:block"></div>

<div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
<div className="md:text-right md:pr-12">
<div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps mb-4">
                        09:00 AM
                    </div>
<h3 className="font-headline-sm text-headline-sm text-secondary mb-2">Arashiyama Bamboo Grove</h3>
<p className="text-on-surface-variant mb-4">Morning walk through the iconic towering bamboo stalks. Recommended entry before crowds arrive.</p>
<div className="flex gap-2 md:justify-end">
<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">ECO-CERTIFIED</span>
<span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-bold border border-tertiary-container/30">HIDDEN GEM</span>
</div>
</div>
<div className="md:pl-12">

<div className="glass-panel rounded-[24px] p-6 border-l-4 border-l-primary-container">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">GEMINI TIP</span>
</div>
<p className="text-body-md text-on-surface italic">"Visit the Tenryu-ji Temple north gate nearby for the most photogenic light filtering through the bamboo at this hour."</p>
</div>
</div>

<div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-white border-2 border-primary -translate-x-1/2 z-10 hidden md:block"></div>
</div>

<div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
<div className="md:order-2 md:pl-12">
<div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps mb-4">
                        12:30 PM
                    </div>
<h3 className="font-headline-sm text-headline-sm text-secondary mb-2">Omen Udon Noodles</h3>
<p className="text-on-surface-variant mb-4">Traditional handmade udon focused on local seasonal vegetables. High sustainability sourcing.</p>
<div className="flex gap-2">
<span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">LOW CARBON</span>
</div>
</div>
<div className="md:text-right md:pr-12 md:order-1">
<div className="glass-panel rounded-[24px] p-2 overflow-hidden aspect-video">
<img className="w-full h-full object-cover rounded-[18px]" data-alt="Traditional Japanese udon noodles served with fresh seasonal vegetables in a rustic ceramic bowl on a wooden table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvI1YIVRmJmz37nTHDxPkl_DAE2tmMr7h8Zvuj3Ot78-mStheU2iUxcrkZa_IdEOR4Fw6P1aWoZ-8pt5HCdr51_W9DG_JXKUmZcDZxZQml-uSAnejhQprW3ytcTxtpBWbrzOVlRy1Z18Uelzukn6xkVIwR3MpvJgRxvrGOq5gOkBxRyyDAojThKLN4nHSECBDx-wrk3KNRuIhdRPhQpWpGDx8eEtJ9-skPiMR_vqJZrlnZxGEArlQOdjSb-97KKWpS5WNlojQtROw"/>
</div>
</div>

<div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-white border-2 border-primary -translate-x-1/2 z-10 hidden md:block"></div>
</div>

<div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
<div className="md:text-right md:pr-12">
<div className="inline-block px-4 py-1.5 rounded-full bg-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps mb-4">
                        03:00 PM
                    </div>
<h3 className="font-headline-sm text-headline-sm text-secondary mb-2">Saga-Toriimoto Preserved Street</h3>
<p className="text-on-surface-variant mb-4">Walk through the historical preserved district with traditional thatched-roof houses.</p>
<div className="flex gap-2 md:justify-end">
<span className="px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-bold border border-tertiary-container/30">CULTURAL HERITAGE</span>
</div>
</div>
<div className="md:pl-12">
<div className="glass-panel rounded-[24px] p-6 border-l-4 border-l-primary-container">
<div className="flex items-center gap-2 mb-3">
<span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
<span className="font-label-caps text-label-caps text-on-surface-variant">GEMINI TIP</span>
</div>
<p className="text-body-md text-on-surface italic">"The local artisans here use sustainable cypress. Look for the small workshop near Adashino Nenbutsu-ji for authentic, low-impact souvenirs."</p>
</div>
</div>

<div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary ring-4 ring-white border-2 border-primary -translate-x-1/2 z-10 hidden md:block"></div>
</div>
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-lg rounded-t-[20px] md:hidden">
<button className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Map</span>
</button>
<button className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Discovery</span>
</button>
<button className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 rounded-2xl px-4 py-1.5 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Itinerary</span>
</button>
<button className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all active:scale-90 duration-150">
<span className="material-symbols-outlined">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold mt-1">Impact</span>
</button>
</nav>

<button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform z-40 hover:bg-primary/90">
<span className="material-symbols-outlined text-2xl">add</span>
</button>

        </div>
    );
}
