"use client";

import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/portfolio";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import MaterialIcon from "@/components/MaterialIcon";
import { cn } from "@/lib/utils";

const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

export function Header() {
  const [activeSection, setActiveSection] = useState("intro");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((o) => o?.disconnect());
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full nav-glass transition-all duration-300",
        scrolled && "shadow-sm",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12 lg:px-20">
        <a
          href="#intro"
          className="font-display text-lg font-bold tracking-tight text-foreground hover:text-muted transition-colors"
          onClick={handleNavClick}
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeSection === id
                    ? "bg-accent-subtle text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card text-foreground md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MaterialIcon name={menuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-[72px] z-40 glass md:hidden transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col gap-2 p-8">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={cn(
                  "rounded-xl px-4 py-4 font-display text-xl font-semibold transition-colors",
                  activeSection === id
                    ? "text-gradient"
                    : "text-foreground hover:text-muted",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
