import Link from "next/link";
import { cn } from "@/lib/utils";

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  download,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";

  const variants = {
    primary:
      "bg-foreground text-background shadow-md hover:scale-[1.02] hover:opacity-90",
    secondary:
      "glass text-foreground hover:border-foreground/20 hover:shadow-md",
    ghost: "text-foreground hover:text-muted",
  };

  const classes = cn(base, variants[variant], className);

  if (href) {
    if (external || download) {
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          download={download}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
