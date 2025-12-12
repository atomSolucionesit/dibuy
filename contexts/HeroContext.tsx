"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface HeroContextType {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  currentGradient: string;
  setCurrentGradient: (gradient: string) => void;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

const gradients = [
  "from-magenta to-zafiro",
  "from-zafiro to-amatista",
  "from-amatista to-oro",
  "from-oro to-magenta",
];

export function HeroProvider({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentGradient, setCurrentGradient] = useState("from-magenta to-zafiro");

  // Timer global para cambiar colores cuando no hay Hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const nextSlide = (prev + 1) % gradients.length;
        setCurrentGradient(gradients[nextSlide]);
        return nextSlide;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContext.Provider value={{
      currentSlide,
      setCurrentSlide,
      currentGradient,
      setCurrentGradient
    }}>
      {children}
    </HeroContext.Provider>
  );
}

export function useHero() {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
}