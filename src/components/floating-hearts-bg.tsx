"use client";

import { useEffect, useState } from "react";

type FloatingHeart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  color: string;
};

const HEART_COUNT = 16;
const COLORS = ["var(--primary)", "var(--seal)", "var(--seal-foreground)"];

function generateHearts(count: number): FloatingHeart[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.8,
    duration: 14 + Math.random() * 14,
    delay: -Math.random() * 20,
    opacity: 0.1 + Math.random() * 0.2,
    drift: -24 + Math.random() * 48,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

export function FloatingHeartsBg() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // Random positions must be generated client-side only, after the
    // hydration-matching empty render, to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHearts(generateHearts(HEART_COUNT));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <svg
          key={heart.id}
          viewBox="0 0 24 24"
          className="absolute bottom-0 animate-float-heart"
          style={
            {
              left: `${heart.left}%`,
              width: `${heart.size}rem`,
              height: `${heart.size}rem`,
              color: heart.color,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              "--heart-opacity": heart.opacity,
              "--heart-drift": `${heart.drift}px`,
            } as React.CSSProperties
          }
        >
          <path
            fill="currentColor"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      ))}
    </div>
  );
}
