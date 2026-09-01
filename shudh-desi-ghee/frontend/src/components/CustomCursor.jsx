import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (desktop mouse)
    const isTouchDevice = !window.matchMedia('(pointer: fine)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if mouse is hovering over interactive clickable elements
      const target = e.target;
      const isInteractive = target.closest(
        'a, button, input, select, textarea, [role="button"], .cursor-pointer'
      );
      setIsHovered(!!isInteractive);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Smooth lerp loop for outer trailing ring
  useEffect(() => {
    if (!isVisible) return;
    let animId;

    const followMouse = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animId = requestAnimationFrame(followMouse);
    };

    animId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Smooth Gold Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border transition-transform duration-200 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-12 h-12 border-[#d4a373] bg-[#d4a373]/15 shadow-[0_0_20px_rgba(212,163,115,0.4)] scale-110'
            : isClicked
            ? 'w-8 h-8 border-[#b58349] bg-[#b58349]/20 scale-90'
            : 'w-9 h-9 border-[#d4a373]/70 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%) scale(${
            isHovered ? 1.25 : isClicked ? 0.85 : 1
          })`,
        }}
      />

      {/* Inner Precision Gold Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered
            ? 'w-2 h-2 bg-[#2d2624]'
            : 'w-2.5 h-2.5 bg-[#d4a373] shadow-[0_0_8px_#d4a373]'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}
