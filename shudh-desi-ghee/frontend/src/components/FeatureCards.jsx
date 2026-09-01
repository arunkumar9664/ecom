import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EXCLUSIVE_COLLECTION = [
  {
    id: "ex1",
    title: "Handcrafted Kurtis Collection",
    tagline: "Timeless motifs block-printed and embroidered by master craftsmen of Jaipur.",
    categorySlug: "kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg"
  },
  {
    id: "ex2",
    title: "Short Kurtis",
    tagline: "Fluid resort silhouettes woven with pure Mulberry silk and organic linen.",
    categorySlug: "short-kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg"
  },
  {
    id: "ex3",
    title: "Royal Festive Wear Edit",
    tagline: "Intricate Zardosi & Gota Patti handcrafted for grand celebrations.",
    categorySlug: "festive-wear",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png"
  }
];

export default function FeatureCards() {
  return (
    <section id="exclusive-section" className="py-20 sm:py-24 bg-[#f7f3ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
            Haute Couture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] mt-2">
            Exclusive Collection
          </h2>
          <div className="w-12 h-0.5 bg-[#d4a373] mx-auto mt-4 rounded-full" />
        </div>

        {/* 3-Column Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EXCLUSIVE_COLLECTION.map((item) => (
            <div 
              key={item.id}
              className="group relative flex flex-col bg-[#fcfbfa] rounded-lg overflow-hidden border border-[#e8e2d9]/70 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Card Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7f3ee]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Content Overlay at Bottom of Image */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white flex flex-col justify-end">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#d4a373] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-200 mt-2 font-light line-clamp-2">
                    {item.tagline}
                  </p>
                  
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <Link
                      to={`/category/${item.categorySlug}`}
                      className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold text-white group-hover:text-[#d4a373] transition-colors"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
