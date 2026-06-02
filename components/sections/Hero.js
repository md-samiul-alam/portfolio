"use client";

import { motion } from "framer-motion";
import { hero } from "@/data/portfolio";
import MaterialIcon from "@/components/MaterialIcon";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section
      id="intro"
      className="mesh-bg relative flex min-h-screen flex-col items-center justify-center section-pad pt-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-6 font-mono text-sm uppercase tracking-[0.25em] text-muted"
          >
            {hero.pretitle}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {hero.lines.map((line, i) => (
              <span key={line} className="block">
                {i === 0 ? (
                  <span className="text-foreground">{line}</span>
                ) : (
                  <span className="text-gradient">{line}</span>
                )}
              </span>
            ))}
          </motion.h1>
        </motion.div>

        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted transition-colors hover:text-foreground"
          aria-label="Scroll to about section"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <MaterialIcon
            name="keyboard_arrow_down"
            size={24}
            className="animate-bounce"
          />
        </motion.a>
      </div>
    </section>
  );
}
