import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, MapPin, Mail, Phone, MessageCircle, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10 text-[#39322f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">About Us</span>
        </nav>

        {/* Hero Banner Box */}
        <div className="bg-white border border-[#d4a373]/30 rounded-3xl p-6 sm:p-12 mb-8 shadow-xs text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 mb-4 shadow-xs">
            <Sparkles className="w-7 h-7 text-[#d4a373]" />
          </div>
          <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#d4a373] font-bold block mb-2">
            Jaipur, Rajasthan
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2d2624] mb-4">
            SURANGHI NAAR
          </h1>
          <p className="text-sm text-gray-600 font-sans max-w-2xl mx-auto leading-relaxed">
            An Indian clothing brand based in Jaipur, Rajasthan, offering high-quality cotton kurtis and fashion apparel designed for style and comfort.
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4a373] to-transparent mx-auto mt-6 rounded-full" />
        </div>

        {/* Brand Core Story */}
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs text-sm font-sans leading-relaxed">
          
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#2d2624]">
              Our Brand Approach
            </h2>
            <p className="text-gray-700 leading-relaxed">
              SURANGHI NAAR is an Indian clothing brand based in Jaipur, Rajasthan. Our approach is centered on offering customers an easy online shopping experience with clear product information, secure online payments, reliable order processing, customer support, and delivery across India.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We focus on delivering beautifully crafted apparel with authentic design details, premium fabrics, and trusted service for customers looking for quality Indian fashion.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-5 text-center space-y-2">
              <ShoppingBag className="w-6 h-6 text-[#d4a373] mx-auto" />
              <h3 className="font-serif font-bold text-xs uppercase text-[#2d2624]">Clear Info</h3>
              <p className="text-xs text-gray-600">Accurate product descriptions and sizing guidance.</p>
            </div>
            <div className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-5 text-center space-y-2">
              <CreditCard className="w-6 h-6 text-[#d4a373] mx-auto" />
              <h3 className="font-serif font-bold text-xs uppercase text-[#2d2624]">Secure Payments</h3>
              <p className="text-xs text-gray-600">Protected online payment processing via Razorpay.</p>
            </div>
            <div className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-5 text-center space-y-2">
              <Truck className="w-6 h-6 text-[#d4a373] mx-auto" />
              <h3 className="font-serif font-bold text-xs uppercase text-[#2d2624]">Reliable Delivery</h3>
              <p className="text-xs text-gray-600">Order processing & delivery across India.</p>
            </div>
            <div className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-5 text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#d4a373] mx-auto" />
              <h3 className="font-serif font-bold text-xs uppercase text-[#2d2624]">Customer Care</h3>
              <p className="text-xs text-gray-600">Dedicated phone, WhatsApp, and email support.</p>
            </div>
          </div>

          {/* Business Details Box */}
          <div className="bg-[#f8f4ee] border border-[#d4a373]/30 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2d2624] border-b border-[#e8e2d9] pb-3">
              Official Business Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <span className="font-bold text-[#2d2624] block mb-0.5">Business Name</span>
                <span>SURANGHI NAAR</span>
              </div>
              <div>
                <span className="font-bold text-[#2d2624] block mb-0.5">Location Base</span>
                <span>Jaipur, Rajasthan, India</span>
              </div>
              <div>
                <span className="font-bold text-[#2d2624] block mb-0.5">Website</span>
                <span className="text-[#b58349] font-medium">suranghinaar.com</span>
              </div>
              <div>
                <span className="font-bold text-[#2d2624] block mb-0.5">Customer Support</span>
                <a href="tel:+919116655814" className="text-[#b58349] font-bold hover:underline">+91 9116655814</a> (Phone / WhatsApp)
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-[#2d2624] block mb-0.5">Email Support</span>
                <a href="mailto:surangi.naar@gmail.com" className="text-[#b58349] font-bold hover:underline">surangi.naar@gmail.com</a>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-[#2d2624] block mb-0.5">Registered Address</span>
                <span>13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
