import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock, Eye, FileText, Phone, Mail, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10 text-[#39322f]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="bg-white border border-[#d4a373]/30 rounded-3xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Lock className="w-4 h-4" />
            <span>Data Protection Document</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#2d2624] mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500 font-sans">
            Last Updated: <span className="font-semibold text-[#39322f]">18 August 2026</span>
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#d4a373] to-transparent mt-4 rounded-full" />
          <p className="text-sm text-gray-600 font-sans mt-4 leading-relaxed">
            At SURANGHI NAAR, we respect your privacy and are committed to protecting the personal information you provide when you visit or use our website. This Privacy Policy explains what information we collect, how we use it, how we share it, how we protect it, and the choices available to you.
          </p>

          <div className="mt-6 pt-6 border-t border-[#e8e2d9] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700">
            <div><strong>Business Name:</strong> SURANGHI NAAR</div>
            <div><strong>Phone / WhatsApp:</strong> <a href="https://wa.me/919116655814" target="_blank" rel="noreferrer" className="text-[#b58349] font-bold hover:underline">+91 9116655814</a></div>
            <div><strong>Email:</strong> <a href="mailto:surangi.naar@gmail.com" className="text-[#b58349] font-bold hover:underline">surangi.naar@gmail.com</a></div>
            <div><strong>Address:</strong> 13-16, Paras Apartment, Chopra Enclave, Mangyawas, Mansarovar, Jaipur, Rajasthan, India</div>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white border border-[#e8e2d9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs text-sm font-sans leading-relaxed">
          
          <p className="text-gray-700 italic bg-[#f8f4ee] p-4 rounded-2xl border border-[#e8e2d9]">
            By accessing or using our website, creating an account, or placing an order, you acknowledge that you have read and understood this Privacy Policy.
          </p>

          {/* 1. Information We Collect */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Information We Collect
            </h2>
            <ul className="space-y-2.5 pl-2 text-gray-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Full name, email address, mobile/phone number, billing address, shipping/delivery address and PIN code.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Account or login information, order details, product preferences and information provided to customer support.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Information provided through WhatsApp and other information necessary to process and fulfil orders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Automatically collected technical information such as IP address, browser type, device type, operating system, pages visited, date/time, referring source, website interactions, cookies and similar technologies.</span>
              </li>
            </ul>
          </section>

          {/* 2. Payment Information */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Payment Information
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR accepts online payments through <strong>Razorpay</strong>. Payment-related information may be processed by Razorpay and relevant banking/payment networks. SURANGHI NAAR does not intentionally collect or store sensitive payment credentials such as card PIN, CVV, UPI PIN, or complete banking credentials on its own systems.
            </p>
          </section>

          {/* 3. How We Use Information */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              How We Use Information
            </h2>
            <ul className="space-y-2.5 pl-2 text-gray-700">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Process and fulfil orders and deliver products.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Process online payments and manage customer accounts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Provide order-related communication, customer support, exchanges, and complaint handling.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Communicate through WhatsApp where you contact SURANGHI NAAR or where required for support.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Send order, account, service, and permitted marketing communications.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Improve products, website, services, and customer experience; understand website use; detect fraud and security threats.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a373] mt-2 shrink-0" />
                <span>Comply with applicable legal, tax, accounting, regulatory, and law-enforcement requirements and enforce applicable policies.</span>
              </li>
            </ul>
          </section>

          {/* 4. Cookies and Similar Technologies */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Cookies and Similar Technologies
            </h2>
            <p className="text-gray-700">
              The website uses cookies and similar technologies for website functionality, shopping cart and account features, preferences, performance, traffic measurement, advertising performance, relevant advertising, and marketing improvement. Some cookies may be provided by third-party services. Browser settings may allow users to control or delete cookies, although disabling certain cookies may affect functionality.
            </p>
          </section>

          {/* 5. Meta and Advertising */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Meta and Advertising
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR may use Meta advertising and tracking technologies, including Meta Pixel or similar technologies, to measure advertising performance, understand website activity resulting from advertisements, create or measure audiences, improve campaigns, show relevant advertising, and understand customer interactions. Meta may process collected information under its own policies.
            </p>
          </section>

          {/* 6. WhatsApp and Third Parties */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              WhatsApp and Third Parties
            </h2>
            <p className="text-gray-700">
              Customer-support information shared through WhatsApp may include name, phone number, order information, product information, photographs, videos, or other necessary information. WhatsApp and other third-party services operate under their own privacy policies and terms.
            </p>
          </section>

          {/* 7. Sharing Information */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Sharing Information
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR does not sell personal information as a standalone product. Necessary information may be shared with payment providers such as Razorpay, shipping/logistics providers, technology and service providers, advertising/marketing platforms including Meta, and legal or government authorities where required or permitted by applicable law.
            </p>
          </section>

          {/* 8. Data Security and Retention */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Data Security and Retention
            </h2>
            <p className="text-gray-700">
              Reasonable measures are taken to protect personal information against unauthorized access, misuse, loss, alteration, or disclosure. No internet transmission or electronic storage system can be guaranteed completely secure. Information is retained as reasonably necessary for orders, customer support, accounts, exchanges, business records, accounting/tax/legal obligations, disputes, fraud prevention, and protection of legal rights.
            </p>
          </section>

          {/* 9. Privacy Rights */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Privacy Rights
            </h2>
            <p className="text-gray-700">
              Subject to applicable law, customers may have rights to access personal information, request correction or updating, request erasure where permitted, raise grievances, and exercise other rights available under applicable data-protection laws. Identity verification may be required.
            </p>
          </section>

          {/* 10. Children, Third-Party Services, Fraud, and Legal Compliance */}
          <section className="space-y-3 border-b border-[#e8e2d9] pb-6">
            <h2 className="font-serif text-xl font-bold text-[#2d2624] flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
              Children, Third-Party Services, Fraud, and Legal Compliance
            </h2>
            <p className="text-gray-700">
              SURANGHI NAAR does not impose a specific age restriction for browsing or purchasing, but will comply with applicable law regarding children’s data. The website may contain third-party links or integrations, whose privacy practices are outside this policy. Information may be processed for fraud prevention, account security, and compliance with laws, tax/accounting requirements, court orders, government requests, regulatory requirements, and legal proceedings.
            </p>
          </section>

          {/* 11. Changes and Contact */}
          <section className="bg-[#f8f4ee] border border-[#d4a373]/30 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#2d2624]">
              Changes and Contact
            </h3>
            <p className="text-xs text-gray-600">
              This Privacy Policy may be updated to reflect changes in business practices, website features, technology, third-party services, laws, or privacy requirements. The revised version will be published on this page with an updated date.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-2">
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
