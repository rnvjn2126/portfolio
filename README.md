# Aarnav Jain — Portfolio

Personal portfolio built with React, Vite and Motion, showcasing selected business website and AI application projects.

## Design

Warm whites, beige and olive green are the site's core colors. Real project screenshots are captured with GitHub Actions from the live websites whenever available. Existing original SVG illustrations remain as fallbacks. Each project has a prominent **View live project** button on the Projects page.

## Local development

```sh
npm ci
npm run dev
npm run build
```

The Vite base path is `/portfolio/` for GitHub Pages. The site uses `HashRouter` so project routes work on Pages refreshes.

## Projects

Project metadata, live demo and source URLs are maintained in `src/data/projects.js`. Site information and services are in `src/data/site.js`.

## Deployment

Pushing to the `main` branch runs the GitHub Pages deployment workflow in `.github/workflows/deploy.yml`. The build must succeed before Pages can publish. Public website: https://rnvjn2126.github.io/portfolio/

## Production considerations

The `/admin` page is a UI scaffold, not a secured backend. Do not store private information in it. Any future server-side integration should use authenticated APIs and suitable access controls.

## Live project screenshots

The `.github/workflows/capture-project-screenshots.yml` workflow uses Chromium to visit both live applications, save desktop screenshots in `public/images/screenshots/`, and commit them to the repository. It runs on changes to the site or via manual dispatch. If an application is asleep or unreachable, the original SVG illustration remains visible. The 3D Formula 1 car and animated latte art remain part of the home page.
