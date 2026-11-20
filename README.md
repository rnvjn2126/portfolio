# Premium React Portfolio

A responsive dark portfolio starter built with React, Vite, Motion and React Router.

## Run locally

1. Install Node.js (LTS).
2. Extract this folder and open it in VS Code.
3. In the terminal, run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173).

## Customize first

- Replace `Alex Morgan` in `src/data/site.js` with your name.
- Replace the sample projects in `src/data/projects.js` with your real work.
- Update email and social links in `src/data/site.js`.
- Update services and skills in `src/data/site.js`.

## Included

- Responsive animated homepage
- Reusable navigation, footer, buttons, reveal and project-card components
- Project listing with category filters
- Individual project detail routes
- Admin UI scaffold (not yet connected to authentication/database)
- Contact form UI (connect a real email/form backend before launch)

## Important production notes

The admin page in this starter is only a visual scaffold. It is NOT secure authentication and must not be used to protect private data until Supabase Auth and Row Level Security are configured.

Payment processing is intentionally not enabled yet. For Razorpay, create orders and verify signatures/webhooks on a trusted server (for example, a suitable commercial hosting plan with server functions). Never expose Razorpay Key Secret in frontend code or any `VITE_` environment variable.

Review hosting provider terms for commercial use before accepting freelance payments.
