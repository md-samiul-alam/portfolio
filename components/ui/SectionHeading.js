"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({ title, subtitle, className, align = "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className,
      )}
    >
      {subtitle ? (
        <>
          <p className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-muted">
            {title}
          </p>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-gradient md:text-4xl lg:text-5xl">
            {subtitle}
          </h2>
        </>
      ) : (
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-gradient md:text-4xl lg:text-5xl">
          {title}
        </h2>
      )}
      <div
        className={cn(
          "mt-5 h-0.5 w-20 rounded-full accent-gradient",
          align === "center" && "mx-auto",
        )}
      />
    </motion.div>
  );
}
