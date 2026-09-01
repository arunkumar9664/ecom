import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import HeroSplitSection from '../components/HeroSplitSection';
import CategoryPills from '../components/CategoryPills';
import ProductCarousel from '../components/ProductCarousel';
import ComboCarousel from '../components/ComboCarousel';
import ExperienceSection from '../components/ExperienceSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  return (
    <div className="space-y-0 pb-safe">
      <HeroCarousel />
      <HeroSplitSection />
      <CategoryPills />
      <ProductCarousel />
      <ComboCarousel />
      <ExperienceSection />
      <TestimonialsSection />
      <Newsletter />
    </div>
  );
}
