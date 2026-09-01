import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Subscribed! Welcome to Shudh Desi Ghee.');
    setEmail('');
  };

  return (
    <section className="py-14 bg-[#FFF8E7] border-t border-[#E8DCC8]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#3E2723]">Subscribe to Our Newsletter</h2>
        <p className="text-sm text-[#5D4037] mt-2">Get updates on new products, offers & wellness tips.</p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D6E63]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#E8DCC8] bg-white text-sm focus:outline-none focus:border-[#C8960C]"
              required
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-[#3E2723] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#C8960C] transition-colors cursor-pointer">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
