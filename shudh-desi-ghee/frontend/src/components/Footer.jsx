import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const { storeSettings } = useShop();
  const contact = storeSettings || {};

  return (
    <footer className="bg-[#3E2723] text-[#FFF8E7] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#C8960C]/20">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Shudh Desi Ghee" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="font-serif text-xl font-bold">Shudh Desi Ghee</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#C8960C]">Pure | Traditional</p>
              </div>
            </div>
            <p className="text-xs text-[#FFF8E7]/70 leading-relaxed">
              Bringing the wisdom and flavors of Old Bharat to today&apos;s tables.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-[#C8960C]">Helpful Links</h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80">
              <li><Link to="/our-story" className="hover:text-[#C8960C]">Our Story</Link></li>
              <li><Link to="/shop" className="hover:text-[#C8960C]">All Products</Link></li>
              <li><Link to="/lab-reports" className="hover:text-[#C8960C]">Lab Reports</Link></li>
              <li><Link to="/contact" className="hover:text-[#C8960C]">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-[#C8960C]">Policies</h4>
            <ul className="space-y-2 text-xs text-[#FFF8E7]/80">
              <li><Link to="/refund-policy" className="hover:text-[#C8960C]">Refund Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#C8960C]">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-[#C8960C]">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-[#C8960C]">Contact Us</h4>
            <ul className="space-y-2.5 text-xs text-[#FFF8E7]/80">
              <li className="flex gap-2"><MapPin className="w-4 h-4 text-[#C8960C] shrink-0" />{contact.address}</li>
              <li className="flex gap-2"><Mail className="w-4 h-4 text-[#C8960C] shrink-0" />{contact.email}</li>
              <li className="flex gap-2"><Phone className="w-4 h-4 text-[#C8960C] shrink-0" />{contact.displayPhone || contact.phone}</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-[#FFF8E7]/50 pt-8">© {new Date().getFullYear()} Shudh Desi Ghee. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
