import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, FileText, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10 text-[#39322f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">Disclaimer</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-[#d4a373]/30 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 text-xs font-bold uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4" />
            <span>Legal Statement</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2d2624] mb-2">
            Disclaimer
          </h1>
          <p className="text-xs text-gray-500 font-sans">
            Last Updated: <span className="font-semibold text-[#39322f]">18 August 2026</span>
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#d4a373] to-transparent mt-4 rounded-full" />
          <p className="text-sm text-gray-600 font-sans mt-4 leading-relaxed">
            The following website disclaimer is derived from the supplied SURANGHI NAAR Terms & Conditions and Privacy Policy.
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs text-sm font-sans leading-relaxed">
          
          {/* Section 1: General Information */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              General Information
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR makes reasonable efforts to keep website information, product descriptions, photographs, colour details, sizes, fabric details, availability, and other content accurate. However, information may contain errors, may change, or may not reflect every real-world condition.
            </p>
          </section>

          {/* Section 2: Product Appearance */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Product Appearance
            </h2>
            <ul className="space-y-2.5 pl-2 text-gray-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Actual colours may vary depending on device settings, screen quality, lighting, and photography.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Minor variations in print, texture, colour, or appearance may occur because of the nature of fabrics and manufacturing processes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Product availability is subject to stock availability.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>SURANGHI NAAR may modify, discontinue, or update products without prior notice.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Website Availability */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Website Availability
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR makes reasonable efforts to keep the website available and functioning properly, but does not guarantee that the website will always be uninterrupted, error-free, secure, or available at all times. Temporary unavailability may occur because of maintenance, technical issues, server problems, internet connectivity, or other circumstances beyond reasonable control.
            </p>
          </section>

          {/* Section 4: Third-Party Services */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Third-Party Services
            </h2>
            <p className="text-gray-700">
              The website may use payment gateways, courier/logistics providers, hosting providers, analytics services, advertising technologies, and other third-party services. These third parties may operate under their own terms and privacy policies. SURANGHI NAAR does not control independent third-party policies or failures except where applicable law requires otherwise.
            </p>
          </section>

          {/* Section 5: Payments and Security */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Payments and Security
            </h2>
            <p className="text-gray-700">
              Online payments are processed through third-party payment service providers such as <strong>Razorpay</strong>. Payment processing and security practices are subject to the applicable provider policies. No internet transmission or electronic storage system can be guaranteed completely secure.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Limitation of Liability
            </h2>
            <p className="text-gray-700">
              To the extent permitted by applicable law, SURANGHI NAAR will not be responsible for losses arising from circumstances beyond reasonable control, including courier delays, payment gateway failures, internet disruptions, natural events, technical failures, or other unforeseen circumstances. Nothing in this disclaimer is intended to exclude or limit consumer rights or remedies that cannot legally be excluded or limited.
            </p>
          </section>

          {/* Section 7: Applicable Law */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Applicable Law
            </h2>
            <p className="text-gray-700">
              The supplied Terms & Conditions state that the terms are governed by the laws of India and disputes are subject to the jurisdiction of competent courts in Jaipur, Rajasthan, subject to applicable law.
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-[#f8f4ee] border border-[#d4a373]/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#2d2624]">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4a373] shrink-0" />
                <span>Phone / WhatsApp: <a href="https://wa.me/919116655814" target="_blank" rel="noreferrer" className="text-[#b58349] font-bold hover:underline">+91 9116655814</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4a373] shrink-0" />
                <span>Email: <a href="mailto:surangi.naar@gmail.com" className="text-[#b58349] font-bold hover:underline">surangi.naar@gmail.com</a></span>
              </div>
              <div className="flex items-start gap-2.5 sm:col-span-2">
                <MapPin className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                <span>Address: 13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
