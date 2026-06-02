"use client";

import MaterialIcon from "@/components/MaterialIcon";
import { motion } from "framer-motion";
import { achievements, certifications } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Achievements() {
  return (
    <section id="achievements" className="section-pad">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading title="Achievements & Awards" />
            <ul className="space-y-4">
              {achievements.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start gap-4 rounded-xl glass p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <MaterialIcon name="emoji_events" size={20} />
                  </span>
                  <span className="font-medium text-foreground">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading title="Certifications" />
            <ul className="space-y-4">
              {certifications.map((cert, index) => (
                <motion.li
                  key={cert.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 rounded-xl glass p-5 transition-all hover:border-foreground/20 hover:shadow-md"
                  >
                    <span className="font-medium text-foreground">
                      {cert.name}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted">
                      View
                      <MaterialIcon name="open_in_new" size={16} />
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
