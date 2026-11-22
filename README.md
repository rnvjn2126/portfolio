# Aarnav Jain — Portfolio

Personal portfolio built with React, Vite and Motion, showcasing selected business website and AI application projects.

## Design

Warm whites, beige and olive green are the site's core colors. The project art in `public/images` consists of original, scalable editorial illustrations of the work. **They are not screenshots of the live applications.** Use the **View live project** links on the Projects page to see the actual projects.

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
