'use client';

import { motion } from 'motion/react';

export default function NexusLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      whileHover="hover"
      initial="idle"
      title="NexusBuilder Logo"
    >
      {/* Central Node */}
      <motion.div 
        className="absolute w-1/3 h-1/3 bg-accent-primary rounded-full z-10"
        animate={{
          boxShadow: [
            "0 0 10px var(--accent-primary)",
            "0 0 20px var(--accent-primary)",
            "0 0 10px var(--accent-primary)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Orbiting Particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent-highlight rounded-full"
          animate={{
            rotate: 360,
            x: [15, 20, 15],
            y: [0, 5, 0]
          }}
          style={{ originX: "0px", originY: "0px", left: "50%", top: "50%" }}
          transition={{
            rotate: { duration: 4 + i, repeat: Infinity, ease: "linear" },
            x: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      ))}

      {/* Connecting Lines */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 30 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 30 * Math.sin((angle * Math.PI) / 180)}
            stroke="var(--accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            variants={{
              hover: {
                pathLength: 1,
                opacity: 1,
                x2: 50 + 45 * Math.cos((angle * Math.PI) / 180),
                y2: 50 + 45 * Math.sin((angle * Math.PI) / 180),
              }
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
        {/* Outer Nodes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={50 + 30 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 30 * Math.sin((angle * Math.PI) / 180)}
            r="3"
            fill="var(--accent-secondary)"
            variants={{
              hover: {
                cx: 50 + 45 * Math.cos((angle * Math.PI) / 180),
                cy: 50 + 45 * Math.sin((angle * Math.PI) / 180),
                r: 4,
                fill: "var(--accent-highlight)"
              }
            }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </svg>
      
      {/* Rotating Ring */}
      <motion.div 
        className="absolute inset-0 border border-accent-primary/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
