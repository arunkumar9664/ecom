import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import RosierProductCard from './RosierProductCard';

export default function ProductGrid() {
  const { products, categories } = useShop();
  const items = products || [];
  const filterCats = ['All', ...(categories || []).slice(0, 5).map((c) => c.name)];
  const [selected, setSelected] = React.useState('All');

  const filtered = selected === 'All' ? items : items.filter((p) => p.category === selected || p.categorySlug?.includes(selected.toLowerCase().replace(/\s/g, '-')));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723] mb-8">All Products</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {filterCats.map((cat) => (
            <button key={cat} type="button" onClick={() => setSelected(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${selected === cat ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-[#FFF8E7] border-[#E8DCC8] text-[#3E2723]'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <RosierProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop" className="text-sm font-semibold uppercase tracking-widest text-[#3E2723] border-b-2 border-[#C8960C] pb-1">View All</Link>
        </div>
      </div>
    </section>
  );
}
