"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="ページトップへ戻る"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white/90 text-slate-700 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-400 hover:bg-white hover:text-rose-600 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-rose-500"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
