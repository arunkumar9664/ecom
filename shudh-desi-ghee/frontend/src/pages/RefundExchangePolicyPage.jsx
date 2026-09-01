import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, ShieldCheck, Truck, Clock, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function RefundExchangePolicyPage() {
  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10 text-[#39322f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">Refund & Exchange Policy</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-[#d4a373]/30 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Policy Document</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2d2624] mb-2">
            Refund & Exchange Policy
          </h1>
          <p className="text-xs text-gray-500 font-sans">
            Last Updated: <span className="font-semibold text-[#39322f]">18 August 2026</span>
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#d4a373] to-transparent mt-4 rounded-full" />
          <p className="text-sm text-gray-600 font-sans mt-4 leading-relaxed">
            This page summarizes the refund, cancellation, return, and exchange terms contained in the supplied SURANGHI NAAR Terms & Conditions. It is written as website-ready copy while keeping the supplied policy position.
          </p>
        </div>

        {/* Policy Details Container */}
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs text-sm font-sans leading-relaxed">
          
          {/* Section 1: Returns */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Returns
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR does not offer returns as a standard policy. Customers should carefully review product details, size information, product description, and other relevant information before placing an order.
            </p>
            <p className="text-gray-700 font-medium bg-[#f8f4ee] p-4 rounded-2xl border border-[#e8e2d9]">
              A product cannot ordinarily be returned simply because the customer changed their mind, selected the wrong size, or no longer wishes to keep the product.
            </p>
            <p className="text-xs text-gray-500 italic">
              This does not restrict any rights or remedies available to consumers under applicable law.
            </p>
          </section>

          {/* Section 2: Exchanges */}
          <section className="space-y-4 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Exchanges
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR offers exchange within <strong className="text-[#39322f]">3 days of delivery</strong>, subject to the conditions below. Customers should contact SURANGHI NAAR within the applicable exchange period through the contact details listed on this page.
            </p>
            <ul className="space-y-2.5 pl-2 text-gray-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>The product must be unused and unworn.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>The product must be in its original condition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Original tags and packaging should remain intact, where applicable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>The product must not have been washed, altered, stained, damaged, or otherwise used.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Exchange Shipping */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Exchange Shipping
            </h2>
            <p className="text-gray-700">
              For an eligible exchange, SURANGHI NAAR will bear the applicable exchange shipping cost. Customers should not send products back without first contacting SURANGHI NAAR and receiving instructions regarding the exchange process.
            </p>
          </section>

          {/* Section 4: Discounted and Sale Products */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Discounted and Sale Products
            </h2>
            <p className="text-gray-700">
              Discounted and sale products are eligible for exchange, subject to the same applicable exchange conditions and exchange period. Discounted products are not eligible for a return or cash refund under the standard policy, except where a refund or other remedy is required under applicable law.
            </p>
          </section>

          {/* Section 5: Damaged, Defective, or Incorrect Products */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Damaged, Defective, or Incorrect Products
            </h2>
            <p className="text-gray-700">
              If you receive a damaged, defective, incorrect, or different product, please contact SURANGHI NAAR as soon as possible and within the applicable exchange period. You may be asked to provide photographs or videos of the product and packaging so the issue can be verified. Once verified, SURANGHI NAAR will arrange an eligible exchange or other appropriate remedy in accordance with applicable law and the applicable policies.
            </p>
          </section>

          {/* Section 6: Order Cancellation */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Order Cancellation
            </h2>
            <p className="text-gray-700">
              Customers may request cancellation within <strong className="text-[#39322f]">24 hours</strong> of placing an order. Cancellation requests should be made as soon as possible through WhatsApp/Phone at <a href="tel:+919116655814" className="text-[#b58349] font-bold hover:underline">+91 9116655814</a> or email at <a href="mailto:surangi.naar@gmail.com" className="text-[#b58349] font-bold hover:underline">surangi.naar@gmail.com</a>.
            </p>
            <p className="text-gray-700">
              Once an order has been processed, packed, or dispatched, cancellation may no longer be possible. Any eligible refund arising from an approved cancellation will be handled according to the applicable payment and refund process.
            </p>
          </section>

          {/* Section 7: No Refund Policy */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              No Refund Policy
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR follows a no-refund policy for ordinary product returns and exchanges. An exchange, rather than a monetary refund, will generally be provided where an exchange is permitted under this policy. Nothing in this clause is intended to exclude or limit any refund or other consumer remedy required by applicable law.
            </p>
          </section>

          {/* Section 8: Contact for Exchanges and Cancellations */}
          <section className="bg-[#f8f4ee] border border-[#d4a373]/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#2d2624]">
              Contact for Exchanges and Cancellations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 pt-1">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#d4a373] shrink-0" />
                <span>
                  Phone / WhatsApp: <a href="https://wa.me/919116655814" target="_blank" rel="noreferrer" className="text-[#b58349] font-bold hover:underline">+91 9116655814</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#d4a373] shrink-0" />
                <span>
                  Email: <a href="mailto:surangi.naar@gmail.com" className="text-[#b58349] font-bold hover:underline">surangi.naar@gmail.com</a>
                </span>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="w-4 h-4 text-[#d4a373] shrink-0 mt-0.5" />
                <span>
                  Address: 13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India
                </span>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
