import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Flame, Shield, Users } from 'lucide-react';
import { EXPERIENCE_PILLARS, BRAND_STATS } from '../data/rosierContent';

const icons = [Leaf, Flame, Shield, Users];

export default function ExperienceSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E2723]">More Than a Brand, A Family</h2>
          <p className="text-[#5D4037] mt-2 font-medium">जड़ों से जुड़े लोग, असली बदलाव</p>
          <p className="text-xs uppercase tracking-widest text-[#C8960C] mt-4 font-semibold">Every Number Tells a Story</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {BRAND_STATS.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl bg-[#FFF8E7] border border-[#E8DCC8]">
              <div className="text-2xl sm:text-3xl font-bold text-[#C8960C]">{stat.value}</div>
              <div className="text-xs sm:text-sm text-[#5D4037] mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <h3 className="font-serif text-2xl font-bold text-[#3E2723]">The Shudh Desi Ghee Experience</h3>
          <p className="text-sm text-[#5D4037] mt-1">असली स्वाद की एक सच्ची यात्रा</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCE_PILLARS.map((pillar, i) => {
            const Icon = icons[i] || Leaf;
            return (
              <div key={pillar.title} className="p-6 rounded-xl border border-[#E8DCC8] bg-[#FFF8E7]/50 hover:shadow-md transition-shadow">
                <Icon className="w-8 h-8 text-[#C8960C] mb-4" />
                <h4 className="font-serif text-lg font-bold text-[#3E2723] mb-2">{pillar.title}</h4>
                <p className="text-sm text-[#5D4037] leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/our-story" className="inline-block px-6 sm:px-8 py-3 rounded-full bg-[#3E2723] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C8960C] transition-colors touch-manipulation">
            Explore Our Heritage
          </Link>
        </div>
      </div>
    </section>
  );
}
