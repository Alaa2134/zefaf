"use client";

import { motion } from "framer-motion";
import { AnimationStyle } from "@/lib/templates";

export function TemplateAnimation({ style, color }: { style: AnimationStyle; color: string }) {
  switch (style) {
    case "petals":
      return <Petals color={color} />;
    case "hearts":
      return <Hearts color={color} />;
    case "sparkle":
      return <Sparkle color={color} />;
    case "curtain":
      return <Curtain color={color} />;
    case "fireworks":
      return <Fireworks color={color} />;
    case "fade":
    default:
      return null;
  }
}

function Petals({ color }: { color: string }) {
  const petals = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {petals.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            color,
            left: `${(i * 73) % 100}%`,
            top: "-10%",
          }}
          initial={{ y: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0%", "120vh"],
            rotate: [0, 360],
            opacity: [0, 0.7, 0],
            x: [0, i % 2 === 0 ? 30 : -30, 0],
          }}
          transition={{
            duration: 8 + (i % 4),
            delay: i * 0.6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ❀
        </motion.div>
      ))}
    </div>
  );
}

function Hearts({ color }: { color: string }) {
  const hearts = Array.from({ length: 10 });
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ color, left: `${(i * 91) % 100}%`, bottom: "-10%" }}
          initial={{ y: 0, scale: 0.6, opacity: 0 }}
          animate={{
            y: ["0%", "-120vh"],
            scale: [0.6, 1.1, 0.6],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 7 + (i % 3),
            delay: i * 0.7,
            repeat: Infinity,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
}

function Sparkle({ color }: { color: string }) {
  const sparkles = Array.from({ length: 20 });
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {sparkles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            color,
            left: `${(i * 47) % 100}%`,
            top: `${(i * 71) % 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2 + (i % 3),
            delay: i * 0.15,
            repeat: Infinity,
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}

function Curtain({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ background: `linear-gradient(270deg, ${color}55, transparent)` }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ background: `linear-gradient(90deg, ${color}55, transparent)` }}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

function Fireworks({ color }: { color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            background: color,
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 20}%`,
            boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          }}
          animate={{
            scale: [0, 4, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      ))}
    </div>
  );
}
