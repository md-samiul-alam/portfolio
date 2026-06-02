# Portfolio — Md Samiul Alam

Modern personal portfolio built with **Next.js**, **JavaScript**, **Tailwind CSS v4**, and **Framer Motion**. Deployed to GitHub Pages at [md-samiul-alam.github.io/portfolio](https://md-samiul-alam.github.io/portfolio/).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) locally.

For a GitHub Pages–compatible build (served under `/portfolio`):

```bash
npm run build:pages
```

Or on CI, set `NEXT_PUBLIC_BASE_PATH=/portfolio` before `npm run build`.

## Production build

```bash
npm run build
```

Static output is written to `out/`.

## Deploy to GitHub Pages

1. Push to `main` or `master`
2. In repo **Settings → Pages**, set source to **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` builds and publishes `out/`

## Project structure

- `app/` — layout, global styles, home page
- `components/` — header, sections, UI primitives
- `data/portfolio.js` — all site content and links
- `public/` — images, CV, favicons
