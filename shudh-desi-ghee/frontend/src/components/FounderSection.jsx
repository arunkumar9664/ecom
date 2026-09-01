import React from 'react';
import { Sparkles, Leaf, Crown, Globe, Scissors, ShieldCheck } from 'lucide-react';
import FOUNDER_INFO from '../data/brand.js';

export default function FounderSection() {
  // Icon mapper helper
  const getIcon = (name) => {
    switch (name) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#d4a373]" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-[#d4a373]" />;
      case 'Needle': return <Crown className="w-5 h-5 text-[#d4a373]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#d4a373]" />;
      case 'Scissors': return <Scissors className="w-5 h-5 text-[#d4a373]" />;
      case 'ShieldCheck': default: return <ShieldCheck className="w-5 h-5 text-[#d4a373]" />;
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#f7f3ee] border-y border-[#e8e2d9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Founder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Founder Portrait Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-[#fcfbfa]">
              <img
                src={FOUNDER_INFO.image}
                alt={FOUNDER_INFO.name}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 glass-dark rounded-xl border border-white/10">
                <p className="font-serif text-lg font-bold">{FOUNDER_INFO.name}</p>
                <p className="text-xs uppercase tracking-widest text-[#d4a373] mt-0.5">{FOUNDER_INFO.role}</p>
              </div>
            </div>

            {/* Decorative Gold Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#d4a373] text-white p-6 rounded-2xl shadow-xl hidden sm:flex flex-col items-center justify-center text-center w-36 h-36">
              <span className="font-serif text-2xl font-bold">100%</span>
              <span className="text-[10px] uppercase tracking-wider font-sans font-semibold mt-1">Authentic Couture</span>
            </div>
          </div>

          {/* Column 2: Brand Story Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
                Our Vision & Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#39322f] mt-2">
                About Our Founder
              </h2>
              <div className="w-16 h-0.5 bg-[#d4a373] mt-4 rounded-full" />
            </div>

            <blockquote className="font-cormorant text-2xl sm:text-3xl text-[#39322f] italic leading-snug font-medium border-l-2 border-[#d4a373] pl-6 py-1">
              {FOUNDER_INFO.quote}
            </blockquote>

            <div className="space-y-4 text-sm sm:text-base text-[#39322f]/80 font-sans font-light leading-relaxed">
              <p>{FOUNDER_INFO.storyParagraph1}</p>
              <p>{FOUNDER_INFO.storyParagraph2}</p>
            </div>
          </div>

        </div>

        {/* 6 Value / Certification Badges Row Below */}
        <div className="mt-20 pt-12 border-t border-[#e8e2d9] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {FOUNDER_INFO.badges.map((badge, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center text-center p-4 bg-[#fcfbfa] rounded-xl border border-[#e8e2d9]/60 hover:border-[#d4a373] transition-all hover:shadow-md group"
            >
              <div className="w-12 h-12 rounded-full bg-[#f7f3ee] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                {getIcon(badge.icon)}
              </div>
              <span className="font-sans text-xs font-semibold text-[#39322f] tracking-wide">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
