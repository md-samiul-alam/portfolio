import { Space_Grotesk, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { site } from "@/data/portfolio";
import { basePath } from "@/lib/paths";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: site.title,
  description: site.description,
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${basePath}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: `${basePath}/apple-touch-icon.png`,
  },
  manifest: `${basePath}/site.webmanifest`,
};

const materialSymbolsStylesheet =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href={materialSymbolsStylesheet} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
