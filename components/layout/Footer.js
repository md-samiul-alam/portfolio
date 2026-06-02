import { site } from "@/data/portfolio";
import MaterialIcon from "@/components/MaterialIcon";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border px-6 py-8 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>© {year} {site.name}</p>
        <a
          href="#intro"
          className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-muted"
        >
          Back to top
          <MaterialIcon name="arrow_upward" size={16} />
        </a>
      </div>
    </footer>
  );
}
