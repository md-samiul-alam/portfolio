"use client";

import { motion } from "framer-motion";
import { demosSection } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import MaterialIcon from "@/components/MaterialIcon";

export function Demos() {
  return (
    <section id="demos" className="section-pad bg-background/80">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title={demosSection.title}
          subtitle={demosSection.subtitle}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="glass mx-auto flex max-w-2xl flex-col items-center rounded-2xl px-8 py-12 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-card-border bg-background/60">
            <MaterialIcon name="construction" size={28} />
          </div>
          <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
            Under development
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Interactive demos for Highcharts.js, Konva.js, and Yjs are coming
            soon. Each sample will highlight hands-on experience from production
            work.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {demosSection.planned.map((library) => (
              <li
                key={library}
                className="rounded-full border border-card-border bg-background/60 px-3 py-1 text-sm text-foreground"
              >
                {library}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
