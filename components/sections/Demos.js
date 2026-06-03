"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { demosSection } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import MaterialIcon from "@/components/MaterialIcon";

const demoLoading = (label) => (
  <div className="glass flex min-h-[320px] items-center justify-center rounded-2xl">
    <span className="text-sm text-muted">{label}</span>
  </div>
);

const HighchartsWeatherDemo = dynamic(
  () => import("@/components/demos/HighchartsWeatherDemo"),
  {
    ssr: false,
    loading: () => demoLoading("Loading chart…"),
  },
);

const KonvaRoomPlannerDemo = dynamic(
  () => import("@/components/demos/KonvaRoomPlannerDemo"),
  {
    ssr: false,
    loading: () => demoLoading("Loading room planner…"),
  },
);

const SHIPPED_DEMOS = ["Highcharts.js", "Konva.js"];

export function Demos() {
  const comingSoon = demosSection.planned.filter(
    (lib) => !SHIPPED_DEMOS.includes(lib),
  );

  return (
    <section id="demos" className="section-pad bg-background/80">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title={demosSection.title}
          subtitle={demosSection.subtitle}
        />

        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <HighchartsWeatherDemo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <KonvaRoomPlannerDemo />
          </motion.div>

          {comingSoon.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass mx-auto flex max-w-2xl flex-col items-center rounded-2xl px-8 py-10 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-background/60">
                <MaterialIcon name="construction" size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                More demos coming soon
              </h3>
              <p className="mt-2 text-sm text-muted">
                Interactive samples for additional libraries are in progress.
              </p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {comingSoon.map((library) => (
                  <li
                    key={library}
                    className="rounded-full border border-card-border bg-background/60 px-3 py-1 text-sm text-foreground"
                  >
                    {library}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
