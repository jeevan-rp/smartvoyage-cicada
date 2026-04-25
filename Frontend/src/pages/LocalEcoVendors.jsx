import React, { useState, useEffect } from 'react';
import { discoveryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LocalEcoVendors() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Default to Bangalore

    useEffect(() => {
        if (!user) {
            navigate('/onboarding');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Try to get actual location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const response = await discoveryService.searchVendors({
                    lat: location.lat,
                    lng: location.lng,
                    category: category || undefined,
                    radius: 20
                });
                setVendors(response.data.vendors);
            } catch (error) {
                console.error("Error fetching vendors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, [location, category]);

    const [selectedVendor, setSelectedVendor] = useState(null);

    return (
        <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen pb-24 md:pb-0">
            

<header className="sticky top-0 z-50 glass-panel border-b border-white/30">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
<div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-['Plus_Jakarta_Sans']">
                SmartVoyage
            </div>
<div className="hidden md:flex items-center gap-8">
<a className="text-slate-600 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/map-discovery">Map</a>
<a className="text-emerald-600 font-bold font-body-md px-3 py-1 rounded-lg" href="/vendors">Discovery</a>
<a className="text-slate-600 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/itinerary">Itinerary</a>
<a className="text-slate-600 font-body-md hover:bg-white/20 transition-colors px-3 py-1 rounded-lg" href="/impact-dashboard">Impact</a>
</div>
<div className="flex items-center gap-4">
<button className="material-symbols-outlined text-slate-600 hover:bg-white/20 p-2 rounded-full transition-colors">notifications</button>
<a href="/profile" className="material-symbols-outlined text-slate-600 hover:bg-white/20 p-2 rounded-full transition-colors">account_circle</a>
</div>
</div>
</header>
<main className="max-w-7xl mx-auto px-6 py-8">

<div className="mb-8">
<h1 className="font-display-lg text-display-lg text-on-surface mb-2">Discovery Hub</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Support local artisans and eco-certified vendors on your journey.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-4 space-y-gutter order-2 md:order-1">
<div className="glass-panel rounded-[24px] p-6 sticky top-24">
<div className="flex items-center gap-3 mb-4">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
<h2 className="font-headline-sm text-headline-sm">Impact Insight</h2>
</div>
<div className="space-y-4">
<div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
<p className="font-body-md text-on-surface leading-relaxed">
    {selectedVendor ? (
        <>
        <span className="font-bold text-primary">{selectedVendor.name}</span> {selectedVendor.impactDescription || "is a leader in sustainability."} By shopping here, you support <span className="font-bold">local economy</span> and environmental conservation.
        </>
    ) : "Select a vendor to see their direct impact on the community and environment."}
                            </p>
</div>
<div className="flex flex-col gap-2">
<div className="flex justify-between items-center text-xs font-label-caps uppercase text-on-surface-variant">
<span>Local Economic Boost</span>
<span>{selectedVendor?.stats?.localImpact || "90"}%</span>
</div>
<div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{ width: `${selectedVendor?.stats?.localImpact || 90}%` }}></div>
</div>
</div>
<button className="w-full py-3 bg-primary text-on-primary rounded-[20px] font-body-md font-bold hover:opacity-90 active:scale-95 transition-all">
                            Visit Website
                        </button>
</div>
</div>

<div className="glass-panel rounded-[24px] p-6">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-tertiary">diamond</span>
<h3 className="font-headline-sm text-[18px]">Local Gems nearby</h3>
</div>
<div className="space-y-3">
    {vendors.filter(v => v.isLocallyOwned).slice(0, 2).map((vendor, idx) => (
        <div key={idx} onClick={() => setSelectedVendor(vendor)} className={`flex items-center gap-3 p-3 hover:bg-white/20 rounded-xl cursor-pointer transition-colors ${selectedVendor?.vendorId === vendor.vendorId ? 'border border-primary/20 bg-white/30' : ''}`}>
        <img className="w-12 h-12 rounded-lg object-cover" data-alt={vendor.name} src={vendor.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBPmKpw6hV1Uj-M-p4XK9EXoeXXMBQvZKdwKdgC3rnILWvj-K4SpRg_9RELvU_QeCSvpflr1UMdDKmz2HpXGi16vW4DZMT81udmJGDfVi0KQdZA9IrzueUairib6nCsHPjGe8a8g3hf1RG1l3XfnRmXRDPkQgUwtzRqBAG0nLt_twt1p1SkwphS8GLL9OwLDNqar7_gYKLfssjM0si4MH8BvN6eGdbtgCj1HPej98Hw0HtuYEYCOx7WycyS5edGdymNIuHwKsnoCfY"}/>
        <div>
        <p className="font-bold text-body-md">{vendor.name}</p>
        <span className="hidden-gem-badge text-[10px] px-2 py-0.5 rounded-full font-label-caps">LOCAL FAVORITE</span>
        </div>
        </div>
    ))}
</div>
</div>
</div>

<div className="md:col-span-8 space-y-6 order-1 md:order-2">

<div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
<button onClick={() => setCategory('')} className={`px-5 py-2 rounded-full font-body-md font-semibold shrink-0 ${category === '' ? 'bg-primary text-on-primary' : 'glass-panel text-on-surface-variant'}`}>All Vendors</button>
<button onClick={() => setCategory('restaurant')} className={`px-5 py-2 rounded-full font-body-md shrink-0 ${category === 'restaurant' ? 'bg-primary text-on-primary' : 'glass-panel text-on-surface-variant'}`}>Dining</button>
<button onClick={() => setCategory('shopping')} className={`px-5 py-2 rounded-full font-body-md shrink-0 ${category === 'shopping' ? 'bg-primary text-on-primary' : 'glass-panel text-on-surface-variant'}`}>Shopping</button>
<button onClick={() => setCategory('experience')} className={`px-5 py-2 rounded-full font-body-md shrink-0 ${category === 'experience' ? 'bg-primary text-on-primary' : 'glass-panel text-on-surface-variant'}`}>Experiences</button>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {loading ? (
        <div className="col-span-2 py-20 text-center text-outline">Finding nearby eco-vendors...</div>
    ) : vendors.length > 0 ? vendors.map((vendor, idx) => (
        <div key={idx} onClick={() => setSelectedVendor(vendor)} className="glass-panel rounded-[24px] overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <div className="relative h-48">
        <img className="w-full h-full object-cover" data-alt={vendor.name} src={vendor.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBBGRrs6p_CSZibxSB5-EWhAELk_WCJZFqTyUfVZyeaHN3uw9udUL2NshJbJOpfhslgD8W71ZS0eCV-DN_VpMZhW3SBoZM0FdySFeQIzfQ6YrO7CE1Ee-umwMaKVx71CTGytNk0iBTtGCFqCi_eHWCc9IFLZ0x7_oV9PUPxAvFP9wWquP5UjMLOtgwpjfmgFjaBmTzlqnrtMnqKu5mLlSXykgYr-Tbo3_0RGUbbEXt7fYZI0d-L2TVbvSruYKcZirXrbzAxr6oDx4o"}/>
        {vendor.isLocallyOwned && <div className="absolute top-4 right-4 hidden-gem-badge px-3 py-1 rounded-full font-label-caps text-xs">LOCALLY OWNED</div>}
        </div>
        <div className="p-6">
        <div className="flex justify-between items-start mb-2">
        <h3 className="font-headline-sm text-[20px]">{vendor.name}</h3>
        <div className="flex items-center text-primary font-bold">
        <span className="material-symbols-outlined text-[18px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        <span>{vendor.avgRating || "4.5"}</span>
        </div>
        </div>
        <p className="text-on-surface-variant text-body-md mb-4 line-clamp-2">{vendor.description}</p>
        <div className="space-y-2">
        <div className="flex justify-between text-xs font-label-caps text-on-surface-variant">
        <span>Sustainability Score</span>
        <span className="text-primary font-bold">{vendor.sustainabilityScore || "85"}/100</span>
        </div>
        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
        <div className="h-full sustainability-gradient" style={{ width: `${vendor.sustainabilityScore || 85}%` }}></div>
        </div>
        </div>
        </div>
        </div>
    )) : (
        <div className="col-span-2 py-20 text-center text-outline">No eco-vendors found in this area. Try a different category!</div>
    )}
</div>
</div>
</div>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 glass-panel md:hidden rounded-t-[24px] shadow-lg">
<div className="flex justify-around items-center px-4 pb-4 pt-2">
<a href="/map-discovery" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">map</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Map</span>
</a>
<a href="/vendors" className="flex flex-col items-center justify-center bg-emerald-500/20 text-emerald-600 rounded-2xl px-4 py-1.5 transition-all">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Discovery</span>
</a>
<a href="/itinerary" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">event_note</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Itinerary</span>
</a>
<a href="/impact-dashboard" className="flex flex-col items-center justify-center text-slate-500 px-4 py-1.5 hover:bg-emerald-500/10 transition-all">
<span className="material-symbols-outlined">eco</span>
<span className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold">Impact</span>
</a>
</div>
</nav>

<button className="fixed right-6 bottom-24 md:bottom-12 z-40 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_location_alt</span>
</button>

        </div>
    );
}
