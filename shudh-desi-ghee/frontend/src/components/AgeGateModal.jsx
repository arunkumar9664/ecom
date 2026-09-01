import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck } from 'lucide-react';


export default function AgeGateModal() {
  const { isAgeVerified, handleConfirmAge } = useShop();

  if (isAgeVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#fcfbfa] rounded-2xl shadow-2xl p-8 border border-[#e8e2d9] text-center space-y-6">
        
        {/* Header Icon */}
        <div className="w-16 h-16 bg-[#f7f3ee] border border-[#d4a373]/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8 text-[#d4a373]" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
            Age Verification
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#39322f] mt-1">
            Welcome to Shudh Desi Ghee
          </h3>
          <p className="text-xs uppercase tracking-widest text-[#39322f]/60 font-sans mt-0.5">
            SURANGHI NAAR
          </p>
        </div>

        <p className="text-sm font-sans text-[#39322f]/80 font-light leading-relaxed">
          Please confirm your age to enter our luxury fashion studio. Are you 18 years of age or older?
        </p>


        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => handleConfirmAge(true)}
            className="w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer"
          >
            Yes, I am 18+
          </button>

          <button
            onClick={() => handleConfirmAge(false)}
            className="w-full bg-[#f7f3ee] hover:bg-gray-200 text-[#39322f] py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all border border-[#e8e2d9] cursor-pointer"
          >
            No, Exit
          </button>
        </div>

        <p className="text-[10px] text-[#39322f]/50 font-sans">
          By clicking Yes, you agree to our Terms of Use and Privacy Policy.
        </p>

      </div>
    </div>
  );
}
