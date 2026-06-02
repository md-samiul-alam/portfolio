"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SkillCard({ skill, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300",
        index === 0 && "md:col-span-2 md:row-span-2 md:flex md:items-end",
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-foreground/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />
      <span
        className={cn(
          "relative font-display font-semibold text-foreground",
          index === 0 ? "text-2xl md:text-3xl" : "text-lg md:text-xl",
        )}
      >
        {skill}
      </span>
    </motion.li>
  );
}
