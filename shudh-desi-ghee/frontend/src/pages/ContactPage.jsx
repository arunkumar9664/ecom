import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, MessageCircle, MapPin, Globe, Clock, Send, Sparkles, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Question', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10 text-[#39322f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">Contact Us</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-[#d4a373]/30 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageCircle className="w-4 h-4" />
            <span>Customer Support Studio</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2d2624] mb-2">
            Contact Us
          </h1>
          <p className="text-sm text-gray-600 font-sans leading-relaxed max-w-2xl">
            We are here to help with orders, product questions, exchanges, cancellations, customer support, privacy requests, and other website-related concerns.
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#d4a373] to-transparent mt-4 rounded-full" />
        </div>

        {/* Contact Methods Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          
          {/* Card 1: Phone / WhatsApp */}
          <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#d4a373] transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f8f4ee] border border-[#d4a373]/30 flex items-center justify-center text-[#b58349]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#2d2624]">Phone & WhatsApp</h2>
              <p className="text-xs text-gray-500 font-sans">
                Available for instant assistance, order tracking, and exchange queries.
              </p>
            </div>
            <div className="pt-2 border-t border-[#e8e2d9] space-y-2 text-xs">
              <a
                href="https://wa.me/919116655814"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href="tel:+919116655814"
                className="w-full bg-[#f8f4ee] hover:bg-[#e8e2d9] text-[#39322f] font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Phone className="w-4 h-4 text-[#d4a373]" />
                <span>Call +91 9116655814</span>
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#d4a373] transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f8f4ee] border border-[#d4a373]/30 flex items-center justify-center text-[#b58349]">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#2d2624]">Email Support</h2>
              <p className="text-xs text-gray-500 font-sans">
                Send us formal inquiries, cancellation requests, or privacy notices.
              </p>
            </div>
            <div className="pt-2 border-t border-[#e8e2d9]">
              <a
                href="mailto:surangi.naar@gmail.com"
                className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <Mail className="w-4 h-4 text-[#d4a373]" />
                <span>surangi.naar@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Card 3: Business Location */}
          <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#d4a373] transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f8f4ee] border border-[#d4a373]/30 flex items-center justify-center text-[#b58349]">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-lg font-bold text-[#2d2624]">Business Location</h2>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India
              </p>
            </div>
            <div className="pt-2 border-t border-[#e8e2d9] text-xs text-gray-500 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4a373]" />
              <span>Website: <strong className="text-[#39322f]">suranghinaar.com</strong></span>
            </div>
          </div>

        </div>

        {/* Customer Support Guidelines Box */}
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 shadow-xs mb-8 space-y-6 text-sm font-sans">
          
          <div className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-[#2d2624]">
              Customer Support Guidelines
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Customers can contact SURANGHI NAAR through phone/WhatsApp or email for questions, complaints, exchange requests, cancellation requests, order-related issues, privacy requests, and other concerns.
            </p>
          </div>

          <div className="bg-[#f8f4ee] border border-[#d4a373]/30 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#b58349]">
              <AlertCircle className="w-4 h-4 text-[#d4a373]" />
              <span>Important Exchange & Cancellation Notice</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              For exchanges or cancellations, customers should contact us as soon as possible and within the applicable policy period. Please do not send a product back without first contacting SURANGHI NAAR and receiving exchange instructions.
            </p>
          </div>

          {/* Direct Message Form */}
          <div className="pt-4 border-t border-[#e8e2d9] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2d2624]">
              Send Us a Message
            </h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 text-center text-xs font-semibold animate-in fade-in">
                <Sparkles className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl px-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="ananya.sharma@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl px-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl px-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl px-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Exchange Request">Exchange Request</option>
                      <option value="Order Cancellation">Order Cancellation</option>
                      <option value="Privacy Concern">Privacy Concern</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl px-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-8 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
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
  );
}
