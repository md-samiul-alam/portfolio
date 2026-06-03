"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MaterialIcon from "@/components/MaterialIcon";

function ProjectBlock({ project }) {
  return (
    <div className="mb-4 rounded-xl border border-card-border bg-background/50 p-4">
      <p className="text-sm text-muted">
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:text-foreground transition-colors"
          >
            {project.name}:
          </a>
        ) : (
          <span className="font-semibold text-foreground">{project.name}:</span>
        )}{" "}
        {project.description}
      </p>
      {project.demoUrl && (
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          <span className="inline-flex items-center gap-1">
            View project demo
            <MaterialIcon name="open_in_new" size={16} />
          </span>
        </a>
      )}
    </div>
  );
}

function BulletList({ bullets }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
      {bullets.map((bullet) => (
        <li key={bullet.slice(0, 48)} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

export function TimelineItem({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center">
        <span className="absolute h-4 w-4 animate-ping rounded-full bg-foreground/10" />
        <span className="relative h-3 w-3 rounded-full bg-foreground ring-4 ring-background" />
      </span>
      <div
        className={cn(
          "rounded-2xl glass p-6 transition-shadow hover:shadow-md",
        )}
      >
        <header>
          <h3 className="font-display text-lg font-bold text-foreground md:text-xl">
            {item.companyUrl ? (
              <a
                href={item.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-muted"
              >
                {item.company ?? item.school}
              </a>
            ) : (
              (item.company ?? item.school)
            )}
          </h3>
          <p className="mt-1 font-medium text-muted">
            {item.role ?? item.degree}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
            {item.timeframe}
          </p>
          {item.location && (
            <p className="mt-1 text-sm text-muted">{item.location}</p>
          )}
        </header>

        {item.projects?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Projects worked on
            </p>
            {item.projects.map((project) => (
              <ProjectBlock key={project.name} project={project} />
            ))}
          </div>
        )}

        {item.bullets?.length > 0 && <BulletList bullets={item.bullets} />}

        {item.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}
