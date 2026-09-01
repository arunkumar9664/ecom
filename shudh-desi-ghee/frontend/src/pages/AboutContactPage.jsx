import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FounderSection from '../components/FounderSection';
import { useShop } from '../context/ShopContext';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';


export default function AboutContactPage() {
  const { storeSettings } = useShop();
  const BRAND_CONTACT = storeSettings || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">About Us & Contact</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#231f1e] text-white p-6 sm:p-12 lg:p-16 text-center space-y-4 sm:space-y-6">
          <img
            src="/images/products/real_product_14.jpg"
            alt="Suranghi Naar Atelier"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231f1e] via-black/40 to-transparent" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <img 
              src="/logo.jpg" 
              alt="Suranghi Naar Monogram" 
              loading="lazy"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover mx-auto border-2 border-[#d4a373] shadow-2xl" 
            />
            <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold block">
              Jaipur Haute Couture & Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold">
              About Suranghi Naar
            </h1>
            <p className="font-cormorant text-lg sm:text-xl text-gray-200 italic font-light">
              “Fusing centuries of Royal Rajasthani textile artistry with contemporary global grace.”
            </p>
          </div>
        </div>

        {/* Founder Story Component */}
        <FounderSection />

        {/* Craftsmanship Highlights Grid */}
        <div className="bg-[#fcfbfa] border border-[#e8e2d9] rounded-3xl p-8 sm:p-14 space-y-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
              Artisan Techniques
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#39322f] mt-1">
              Handcrafted in Jaipur
            </h2>
            <div className="w-12 h-0.5 bg-[#d4a373] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-[#f7f3ee]/60 p-6 rounded-2xl border border-[#e8e2d9]/60">
              <h3 className="font-serif font-bold text-xl text-[#39322f]">Jaipur Block Prints</h3>
              <p className="text-xs text-[#39322f]/80 font-sans font-light leading-relaxed">
                Carved wooden blocks dipped in natural organic dyes, hand-stamped onto pure chiffons and mulmul cottons by third-generation master artisans.
              </p>
            </div>

            <div className="space-y-3 bg-[#f7f3ee]/60 p-6 rounded-2xl border border-[#e8e2d9]/60">
              <h3 className="font-serif font-bold text-xl text-[#39322f]">Royal Zardozi & Dabka</h3>
              <p className="text-xs text-[#39322f]/80 font-sans font-light leading-relaxed">
                Intricate metallic threadwork, sequins, cutdana, and gota patti sewn with precision onto Mulberry silk and velvet drapes.
              </p>
            </div>

            <div className="space-y-3 bg-[#f7f3ee]/60 p-6 rounded-2xl border border-[#e8e2d9]/60">
              <h3 className="font-serif font-bold text-xl text-[#39322f]">Bespoke Tailoring</h3>
              <p className="text-xs text-[#39322f]/80 font-sans font-light leading-relaxed">
                Every ensemble can be customized to your precise measurements to guarantee effortless fit and royal elegance for your special occasions.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-[#39322f] hover:bg-[#d4a373] text-white px-10 py-4 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-lg"
            >
              <span>Explore Studio Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Contact Concierge & Interactive Form Section */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
              Concierge Service
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f]">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-[#39322f]/70 font-sans font-light">
              Our couture stylists are delighted to assist with custom fittings, order inquiries, and bridal consultations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left Column: Direct Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#39322f] border-b border-[#e8e2d9] pb-4">
                  Studio Contact Details
                </h3>

                <ul className="space-y-5 text-xs font-sans text-[#39322f]">

                  {/* Phone */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f3ee] border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">Call Concierge</span>
                      <a href={`tel:${BRAND_CONTACT.phone}`} className="font-semibold text-sm hover:text-[#d4a373] transition-colors">
                        {BRAND_CONTACT.displayPhone}
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f3ee] border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">Official Email</span>
                      <a href={`mailto:${BRAND_CONTACT.email}`} className="font-semibold text-sm hover:text-[#d4a373] transition-colors">
                        {BRAND_CONTACT.email}
                      </a>
                    </div>
                  </li>

                  {/* Instagram */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f3ee] border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] shrink-0">
                      <svg className="w-5 h-5 fill-current text-[#d4a373]" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">Instagram</span>
                      <a href={BRAND_CONTACT.instagram} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-[#d4a373] transition-colors">
                        {BRAND_CONTACT.instagramHandle}
                      </a>
                    </div>
                  </li>

                  {/* Facebook */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f3ee] border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] shrink-0">
                      <svg className="w-5 h-5 fill-current text-[#d4a373]" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">Facebook</span>
                      <a href={BRAND_CONTACT.facebook} target="_blank" rel="noreferrer" className="font-semibold text-sm hover:text-[#d4a373] transition-colors">
                        Suranghi Naar Official
                      </a>
                    </div>
                  </li>

                  {/* WhatsApp */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">WhatsApp Concierge</span>
                      <a href={BRAND_CONTACT.whatsapp} target="_blank" rel="noreferrer" className="font-semibold text-sm text-emerald-700 hover:underline">
                        Chat on WhatsApp (+91 9116655814)
                      </a>
                    </div>
                  </li>

                  {/* Address */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#f7f3ee] border border-[#d4a373]/30 flex items-center justify-center text-[#d4a373] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#39322f]/60 font-semibold uppercase tracking-wider block">Suranghi Naar Atelier</span>
                      <a href={BRAND_CONTACT.googleMaps} target="_blank" rel="noreferrer" className="font-medium text-xs leading-relaxed text-[#39322f] hover:text-[#d4a373] transition-colors block">
                        {BRAND_CONTACT.address}
                      </a>
                    </div>
                  </li>

                </ul>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-10 border border-[#e8e2d9] shadow-xs space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#39322f] border-b border-[#e8e2d9] pb-4">
                  Send Us a Message
                </h3>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-serif font-bold text-lg">Message Sent Successfully</h4>
                    <p className="text-xs font-sans text-emerald-700">Thank you! Our couture concierge team will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#39322f] font-semibold mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Priya Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl focus:outline-none focus:border-[#d4a373]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#39322f] font-semibold mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 91166 55814"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl focus:outline-none focus:border-[#d4a373]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#39322f] font-semibold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="surangi.naar@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#39322f] font-semibold mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="Custom Fitting / Festive Wear Order Inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#39322f] font-semibold mb-1">Your Message *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your requirements or event dates..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-4 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
