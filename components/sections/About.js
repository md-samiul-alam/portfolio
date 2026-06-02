"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { about } from "@/data/portfolio";
import { assetPath } from "@/lib/paths";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import MaterialIcon from "@/components/MaterialIcon";

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={about.title} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="absolute -inset-4 rounded-3xl bg-foreground/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-card-border glass aspect-[4/5]">
              <Image
                src={assetPath(about.photoPath)}
                alt="Md Samiul Alam"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg leading-relaxed text-muted md:text-xl">
              {about.bio}
            </p>
            <div className="mt-8">
              <Button
                href={assetPath(about.cvPath)}
                external
                download
                variant="primary"
              >
                Download Resume
                <MaterialIcon name="download" size={16} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
