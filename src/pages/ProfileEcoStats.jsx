import React from 'react';

export default function ProfileEcoStats() {
    return (
        <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen pb-32">
            

<header className="bg-white/40 backdrop-blur-lg fixed top-0 w-full z-50 border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-['Plus_Jakarta_Sans']">
                SmartVoyage
            </div>
<div className="flex items-center gap-4">
<button className="p-2 text-slate-600 hover:bg-white/20 transition-colors rounded-full">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="p-2 text-emerald-600 font-bold hover:bg-white/20 transition-colors rounded-full border-2 border-emerald-500/20">
<span className="material-symbols-outlined" data-icon="account_circle" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
</button>
</div>
</div>
</header>
<main className="pt-24 px-6 max-w-7xl mx-auto">

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-gutter">

<div className="md:col-span-8 glass-panel rounded-[32px] p-md flex flex-col md:flex-row items-center md:items-start gap-md">
<div className="relative">
<img className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" data-alt="portrait of a confident woman traveler in modern urban attire with soft sunlight and blurred city street background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZkGgDoop8AlM21EGAhPKUse6jxnQxpPFnRbHGqkooFjUWajj2Iw3yTdQSOdZ2JgLYvxoQJc68kAiE2XTGx_T1ar7TjbsBZn_eJVRT-FnAM6SachlKj15ScgdKML8LDSzYLtMOOFg2ACnFfYkA4Ck3zGQLKX3IUe1aq34vKU0bL6AmLezYseG5HTkg6gOsyX_rMmHl85kJOZdoHw307-XScgCK3cxd8rSKUKPTVZ4gMmhcan9MvH5rGhbjQkVScZqHdVMXsq67pOs"/>
<div className="absolute bottom-1 right-1 bg-primary-container p-1 rounded-full border-2 border-white">
<span className="material-symbols-outlined text-white text-sm" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
</div>
</div>
<div className="flex-1 text-center md:text-left">
<h1 className="font-headline-md text-headline-md text-on-surface mb-xs">Elena Rivers</h1>
<p className="font-body-md text-on-surface-variant mb-md flex items-center justify-center md:justify-start gap-2">
<span className="material-symbols-outlined text-sm" data-icon="location_on">location_on</span>
                        Sustainable Voyager • Platinum Member
                    </p>

<div className="inline-flex items-center gap-3 bg-white/30 rounded-full px-4 py-2 border border-white/50">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Home City</span>
<div className="flex items-center gap-1 font-body-md font-bold text-primary">
<span>Amsterdam, NL</span>
<span className="material-symbols-outlined text-sm cursor-pointer" data-icon="expand_more">expand_more</span>
</div>
</div>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-24 h-24 rounded-full circular-progress relative flex items-center justify-center shadow-inner">
<div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
<span className="font-display-lg text-headline-sm text-primary">75</span>
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
<span className="font-display-lg text-display-lg text-primary">12,450</span>
<span className="material-symbols-outlined text-token-gold" data-icon="eco" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
</div>
</div>
<div className="mt-md">
<div className="w-full bg-white/30 h-2 rounded-full mb-2">
<div className="bg-primary-container h-full rounded-full w-[80%]"></div>
</div>
<div className="flex justify-between font-label-caps text-[10px] text-on-surface-variant">
<span>1500 XP to next tier</span>
<span>80% Complete</span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

<div className="md:col-span-2 glass-panel rounded-[32px] p-md">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm">Achievement Badges</h3>
<button className="text-primary font-label-caps hover:underline">View All</button>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
<div className="flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-16 h-16 rounded-2xl bg-token-gold/10 flex items-center justify-center border border-token-gold/30 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-token-gold text-3xl" data-icon="forest" style={{ fontVariationSettings: "'FILL' 1" }}>forest</span>
</div>
<span className="font-label-caps text-center">Forest Protector</span>
</div>
<div className="flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-16 h-16 rounded-2xl bg-token-gold/10 flex items-center justify-center border border-token-gold/30 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-token-gold text-3xl" data-icon="train" style={{ fontVariationSettings: "'FILL' 1" }}>train</span>
</div>
<span className="font-label-caps text-center">Rail Pioneer</span>
</div>
<div className="flex flex-col items-center gap-2 group cursor-pointer opacity-40">
<div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center border border-slate-300">
<span className="material-symbols-outlined text-slate-500 text-3xl" data-icon="lock">lock</span>
</div>
<span className="font-label-caps text-center">Sea Guardian</span>
</div>
<div className="flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-16 h-16 rounded-2xl bg-token-gold/10 flex items-center justify-center border border-token-gold/30 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-token-gold text-3xl" data-icon="volunteer_activism" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
</div>
<span className="font-label-caps text-center">Community Lead</span>
</div>
</div>
</div>

<div className="glass-panel rounded-[32px] p-md bg-secondary/10">
<h3 className="font-headline-sm text-headline-sm mb-md">Trip Stats</h3>
<div className="space-y-md">
<div className="flex justify-between items-center border-b border-white/20 pb-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="public">public</span>
<span className="font-body-md">Countries Visited</span>
</div>
<span className="font-bold text-headline-sm">14</span>
</div>
<div className="flex justify-between items-center border-b border-white/20 pb-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="co2">co2</span>
<span className="font-body-md">CO2 Saved (kg)</span>
</div>
<span className="font-bold text-headline-sm">285</span>
</div>
<div className="flex justify-between items-center pb-2">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="hotel">hotel</span>
<span className="font-body-md">Eco-Stays</span>
</div>
<span className="font-bold text-headline-sm">42</span>
</div>
</div>
</div>

<div className="md:col-span-3 glass-panel rounded-[32px] p-md">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm">Sustainable Itinerary History</h3>
<div className="flex gap-2">
<span className="px-3 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-bold">2024</span>
<span className="px-3 py-1 rounded-full bg-white/30 text-on-surface-variant text-xs font-bold">2023</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="bg-white/40 p-4 rounded-2xl border border-white/30">
<img className="w-full h-32 object-cover rounded-xl mb-3" data-alt="serene coastal beach with crystal clear turquoise water and sustainable bamboo eco-resort cabins nestled in lush palm trees" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBycmHsPS8TAXRTMlzV3r-mZ01_sbjUFbU9-AUKdvhxLgRAdfrRkuJd2FXxw1_S-tN-pGeBLn6p77lwAdOeDW8m9lBnGTSkIcBeS2gkjE_vD1K375P8EbnxHUeKCDuSSNtioI4og90yY-LlQnAVSTspp1-86aJTvNwtm512QQfj4PzaRTCkMgQCsBNO3P9jZJFh6r9hzGaTG3LuTvGl27havlDP2iyLCMlPSvL3bxutYTCBO6kRHfoCNthJQebtt98H_nghWlAUEXI"/>
<div className="flex justify-between items-start">
<div>
<h4 className="font-bold">Bali Eco-Retreat</h4>
<p className="text-xs text-on-surface-variant">Sept 2024</p>
</div>
<span className="text-primary-container material-symbols-outlined" data-icon="leaf" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
</div>
</div>
<div className="bg-white/40 p-4 rounded-2xl border border-white/30">
<img className="w-full h-32 object-cover rounded-xl mb-3" data-alt="modern electric high-speed train cutting through the snowy swiss alps mountains under a clear blue winter sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCTSf139Se7OfsKsBr57nnn22JrYaPkGZXjZ-R4CNoY6OhNzA2JF4F06pRoiAC4NTVjqelaB0q6biONhxYbEO9a2LnQ9Zky_B29tRk-j8YkqBonuzVvIb78EUDXa_RsDctyQXCHTxz0Vn0AH2v0rBliDdA2Z3T4pCc4Wb8pEUKWR0wgw7gKfnYoKHdsltmgoFUEqExjJdpqHBpXPnjEgtDq7mlshNB67lcM8aW9JFGDWQUqgySn2TW1WWrdh5n2CRYT76WwnLYQdI"/>
<div className="flex justify-between items-start">
<div>
<h4 className="font-bold">Swiss Rail Tour</h4>
<p className="text-xs text-on-surface-variant">July 2024</p>
</div>
<span className="text-primary-container material-symbols-outlined" data-icon="leaf" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
</div>
</div>
<div className="bg-white/40 p-4 rounded-2xl border border-white/30">
<img className="w-full h-32 object-cover rounded-xl mb-3" data-alt="cozy sustainable wooden cabin in the dense scandinavian forest with morning mist and soft northern lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoHIqp-S5VFgU3kmjW5mhtyAXTTpmKXXC90UMcOMlemB0J-pqvgtv7F-tTDkCbNmN7-WNLQnDzS9kfHdIVPyJsUastoUN5aAiKyp3TlLy2wtp0X-YUg3RNSctcc1A3DdORY40vDg0YEjai1JRXfvNrPKoi2WNCjO0XXc5o_q_VOV5ORAblWw_6cmYmXCZqmYohzpyaf5UFclVWtTM4FZaQcEjcifE8VKakMS7RerlFeNu0CNUF31-ETfYFKLzaAQc9sgHqXAZeloo"/>
<div className="flex justify-between items-start">
<div>
<h4 className="font-bold">Oslo Low Impact</h4>
<p className="text-xs text-on-surface-variant">May 2024</p>
</div>
<span className="text-primary-container material-symbols-outlined" data-icon="leaf" style={{ fontVariationSettings: "'FILL' 1" }}>energy_savings_leaf</span>
</div>
</div>
<div className="bg-white/40 p-4 rounded-2xl border border-white/30 flex flex-col items-center justify-center border-dashed border-primary/30 min-h-[200px]">
<div className="p-3 bg-primary-container rounded-full text-white mb-2">
<span className="material-symbols-outlined" data-icon="add">add</span>
</div>
<p className="font-label-caps text-primary">Log New Trip</p>
</div>
</div>
</div>
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-lg rounded-t-[20px]">
<div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="map">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="explore">explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</div>
<div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 px-4 py-1.5 hover:bg-emerald-500/10 transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="event_note">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</div>

<div className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-2xl px-4 py-1.5 scale-95 transition-transform duration-150">
<span className="material-symbols-outlined" data-icon="eco" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</div>
</nav>

        </div>
    );
}
