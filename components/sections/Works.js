"use client";

import { experience, education } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";

export function Works() {
  return (
    <section id="works" className="section-pad">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading title="Professional Experience" />
            <div className="relative border-l border-card-border ml-2">
              {experience.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>

          <div>
            <SectionHeading title="Education" />
            <div className="relative border-l border-card-border ml-2">
              {education.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
