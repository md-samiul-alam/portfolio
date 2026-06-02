"use client";

import { motion } from "framer-motion";
import { contact, site, socialLinks } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import MaterialIcon from "@/components/MaterialIcon";
import { SimpleIcon } from "@/components/ui/SimpleIcon";

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const contactMethods = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: "mail",
  },
  {
    label: "Phone",
    value: site.phoneDisplay,
    href: `tel:${site.phone}`,
    icon: "call",
  },
  {
    label: "Portfolio",
    value: site.portfolioUrl.replace("https://", ""),
    href: site.portfolioUrl,
    external: true,
    icon: "language",
  },
];

function ContactMethod({ method }) {
  return (
    <a
      href={method.href}
      target={method.external ? "_blank" : undefined}
      rel={method.external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-xl border border-transparent p-3 -mx-3 transition-all hover:border-card-border hover:bg-background/40"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-card-border bg-background/50 text-muted transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
        <MaterialIcon name={method.icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          {method.label}
        </span>
        <span className="block truncate text-sm font-medium text-foreground transition-colors group-hover:text-muted">
          {method.value}
        </span>
      </span>
    </a>
  );
}

function SocialLink({ link }) {
  return (
    <li>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit my ${link.name} profile`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-card-border bg-background/50 text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      >
        <SimpleIcon slug={link.slug} size={20} />
        <span
          role="tooltip"
          className="pointer-events-none absolute -bottom-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {link.name}
        </span>
      </a>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-pad mesh-bg">
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading title={contact.title} align="center" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl lg:text-4xl"
        >
          {contact.headline}
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            {...cardMotion}
            transition={{ duration: 0.4 }}
            className="rounded-2xl glass p-8"
          >
            <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Reach me at
            </h3>
            <div className="space-y-1">
              {contactMethods.map((method) => (
                <ContactMethod key={method.label} method={method} />
              ))}
            </div>
          </motion.div>

          <motion.div
            {...cardMotion}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="rounded-2xl glass p-8"
          >
            <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Social
            </h3>
            <p className="mb-6 text-sm text-muted">
              Connect with me on these platforms.
            </p>
            <ul className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <SocialLink key={link.name} link={link} />
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          {...cardMotion}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="relative mt-6 overflow-hidden rounded-2xl glass p-8 md:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, var(--accent-subtle), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="max-w-xl">
              <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                {contact.ctaTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                {contact.ctaDescription}
              </p>
            </div>
            <Button href={`mailto:${site.email}`} variant="primary" className="shrink-0">
              <MaterialIcon name="mail" size={16} />
              {contact.ctaButton}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
