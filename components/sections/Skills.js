"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="section-pad bg-background/80">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Technical Skills" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass rounded-2xl p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted">
                {category.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-card-border bg-background/60 px-3 py-1 text-sm text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
