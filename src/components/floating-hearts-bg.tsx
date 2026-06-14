"use client";

import { useEffect, useState } from "react";

type FloatingHeart = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const HEART_COUNT = 16;

function generateHearts(count: number): FloatingHeart[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.8,
    duration: 14 + Math.random() * 14,
    delay: -Math.random() * 20,
    opacity: 0.12 + Math.random() * 0.22,
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
        <span
          key={heart.id}
          className="absolute bottom-0 animate-float-heart text-primary"
          style={
            {
              left: `${heart.left}%`,
              fontSize: `${heart.size}rem`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              "--heart-opacity": heart.opacity,
            } as React.CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </div>
  );
}
