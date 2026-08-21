// ============================================
// TYPEWRITER EFFECT - Framer Motion
// ============================================
// This component creates a typewriter text effect
// where text appears one character at a time

"use client";

import { motion } from "framer-motion";

interface TypewriterEffectProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TypewriterEffect({
  text,
  className = "",
  delay = 0,
}: TypewriterEffectProps) {
  // Split text into characters
  const characters = text.split("");

  // Animation variants for each character
  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    }),
  };
  const child = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
