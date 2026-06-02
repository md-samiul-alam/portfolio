"use client";

import { motion } from "framer-motion";
import { featuredProjects } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import MaterialIcon from "@/components/MaterialIcon";

export function Projects() {
  return (
    <section id="projects" className="section-pad bg-background/80">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Featured Projects" />

        <div className="grid gap-8 lg:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass flex flex-col rounded-2xl p-8 transition-shadow hover:shadow-md ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <header>
                <div className="flex flex-wrap items-center gap-3">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-2xl font-bold text-foreground transition-colors hover:text-muted"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {project.name}
                    </h3>
                  )}
                  {project.company && (
                    <span className="rounded-full border border-card-border bg-background/60 px-3 py-1 text-xs font-medium text-muted">
                      {project.company}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-accent hover:text-foreground transition-colors"
                  >
                    <span className="inline-flex items-center gap-1">
                      View project demo
                      <MaterialIcon name="open_in_new" size={16} />
                    </span>
                  </a>
                )}
              </header>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Tools
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              {project.domains?.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Domain expertise
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {project.domains.map((domain) => (
                      <li
                        key={domain}
                        className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted"
                      >
                        {domain}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Key contributions
                </p>
                <ul className="mt-2 space-y-2">
                  {project.contributions.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm text-muted"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
