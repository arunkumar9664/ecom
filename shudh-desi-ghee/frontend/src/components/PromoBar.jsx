import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

export default function PromoBar() {
  const { promoMessages } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const messages = promoMessages?.length ? promoMessages : ['✨ Festive Sale Is Live! Get Up to 17% OFF 🎉'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((p) => (p + 1) % messages.length), 4500);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="bg-[#2E7D32] text-white text-xs font-sans tracking-wide py-2.5 px-4 text-center relative z-30">
      <span className="font-medium">{messages[currentIndex % messages.length]}</span>
    </div>
  );
}
