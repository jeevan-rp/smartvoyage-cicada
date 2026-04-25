import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/vendors');
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const handleGetStarted = () => {
        navigate('/vendors');
    };

    return (
        <div className="bg-frosted-slate min-h-screen flex flex-col font-body-md text-on-surface antialiased">
            
<header className="w-full px-6 py-8 max-w-7xl mx-auto flex justify-center items-center">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container text-4xl" data-icon="eco" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
<h1 className="text-display-lg font-display-lg tracking-tight text-primary">SmartVoyage</h1>
</div>
</header>
<main className="flex-1 flex flex-col items-center justify-center px-6 pb-xl max-w-7xl mx-auto w-full">
<div className="text-center mb-12">
<h2 className="text-headline-md font-headline-md text-secondary mb-4">Journey with purpose</h2>
<p className="text-body-lg font-body-lg text-outline max-w-[32rem] mx-auto">Explore the world while minimizing your footprint and maximizing your impact.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
<div className="glass-card p-0 overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-all duration-300">
<div className="deep-azure-header px-6 py-4">
<h3 className="text-white font-headline-sm text-headline-sm flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="route">route</span>
                        Eco-routing
                    </h3>
</div>
<div className="p-6 flex-1">
<div className="aspect-video rounded-xl mb-6 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="winding mountain road surrounded by dense green pine forests in misty morning atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcgcAXzjkHEbLfTue0TJ4A8ch0S2q1CHzoPDX3SHThQhbRhmASKNWFdik54GhqHOzv0MkmSTvhmze2bl4ix5BAU6Bm1GyeUAb3qRTuXNHu2MLIp2UaLvCOoxoqVhmsZbodqRwugisLHRMh18HUT9vflK60EMI1k1AkII82WeOVGQ5p_tWxJm9_vXDB9A81bm7WHM6pPuj3aLmSLYP6T5QOQLaa8dEats24FZVIL4n8EznLFOR3Mx9nFhMOFvPGPZy3yxxXjIJMTzI"/>
</div>
<p className="text-body-md font-body-md text-on-surface-variant">Intelligent paths that prioritize low-carbon transportation and high-efficiency travel modes.</p>
</div>
</div>
<div className="glass-card p-0 overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-all duration-300">
<div className="deep-azure-header px-6 py-4">
<h3 className="text-white font-headline-sm text-headline-sm flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="explore">explore</span>
                        Local Gems
                    </h3>
</div>
<div className="p-6 flex-1">
<div className="aspect-video rounded-xl mb-6 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="vibrant local market street in Southeast Asia with colorful tropical fruits and authentic wooden storefronts" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbJrTakxGIYKrFbDNeUr-LxEVUuC2HwQr2THmYK94nz9q4825vHF-mhv6mdVTIQ5JK9NEhweCcf8IJVlqzKxclSwK0uJeT0I-IC8-ArOOISfJTsfKXTVwqP52nzwobsqPWuLiRApHvSVg0Ri14ia3SfI1G-lqLCFaWqKgbLb2ePOBbaTnStOHzh-Rj2BD938Drb4RA02IOERV76ok2MtIsCKSJYgsPHa3uyOj5vD8UkcwKxRRJ0Sb1xuQ7KA22lu9nBpC-J2nY00c"/>
</div>
<p className="text-body-md font-body-md text-on-surface-variant">Support local communities with curated hidden destinations that tourists usually miss.</p>
</div>
</div>
<div className="glass-card p-0 overflow-hidden flex flex-col group hover:translate-y-[-4px] transition-all duration-300">
<div className="deep-azure-header px-6 py-4">
<h3 className="text-white font-headline-sm text-headline-sm flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="stars" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                        Rewards
                    </h3>
</div>
<div className="p-6 flex-1">
<div className="aspect-video rounded-xl mb-6 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="close-up of digital gold tokens with futuristic glowing green circuits floating in soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3qL1XuhoWcy16TeXRLYN6PHUvHPGq5ubDDQkZgwmcDnWHH86GHYerEh26J0AtckwMGY5M4vxAftqm5wKGk2HbIFTW4ptraZh6POwiUn36dzJouXz1SMhjeb7UbDnw9LgUmzoQodKyqZ7vZ3-G6SKglELvlHcb1Lkv-2G9Wg27gMPMyJSgbRmRKrfASZyv_2UN0_QADGr6bBt7uiwTHf7xHb6S8jXPmQZjIlIkD6rEfNPpNH07E7ptiA4Rb4DM4082zSLCv3TgfLM"/>
</div>
<p className="text-body-md font-body-md text-on-surface-variant">Earn sustainability tokens for every eco-conscious choice and redeem them for future adventures.</p>
</div>
</div>
</div>
<div className="mt-16 w-full max-w-[24rem]">
<button onClick={handleGetStarted} className="w-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm py-4 px-8 rounded-[20px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-lg mb-4">
                Get Started
                <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
<button onClick={handleGoogleLogin} className="w-full bg-white text-on-surface font-body-lg text-body-lg py-4 px-8 rounded-[20px] flex items-center justify-center gap-3 border border-outline-variant hover:bg-surface-container-low transition-all">
<svg className="w-6 h-6" viewBox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
</svg>
                Continue with Google
            </button>
</div>
</main>
<footer className="w-full py-8 text-center border-t border-white/30 glass-card rounded-none">
<p className="text-label-caps font-label-caps text-outline uppercase tracking-widest">Sustainable Travel Network • 2024</p>
</footer>

        </div>
    );
}
