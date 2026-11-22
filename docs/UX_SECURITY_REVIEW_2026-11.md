# Portfolio UX and Security Review

Reviewed 23 November 2026. Project: https://rnvjn2126.github.io/portfolio/

**Scope:** public React 19 / Vite site deployed to GitHub Pages, not the
independent applications linked from the portfolio. Reused current React,
Motion, CSS and Playwright infrastructure; no new runtime library added.
Original Formula 1 model and coffee animation retained.

## Twenty UX checks

| # | Status | Finding, files, and verification |
|---|---|---|
| 1. Delayed skeleton loaders | **Built** | `src/components/ProgressiveImage.jsx`, `Home.jsx`, `Projects.jsx`, `ProjectCard.jsx`, `polish.css`. Screenshots keep their aspect-size box. Only after a loading delay of 300 ms, a neutral skeleton appears; it disappears on load. Simulated slow-image browser check validates no movement. |
| 2. Optimistic updates | **Skipped** | Public portfolio has no persistent likes, tasks, records, or mutation API; adding an optimistic UI would invent a non-existent service. |
| 3. Command menu | **Skipped** | Portfolio has a simple three-link navigation, not a frequently used workspace needing keyboard search of many commands. |
| 4. Shortcut hints | **Skipped** | No command menu or substantial keyboard shortcut system exists; fake shortcut badges would mislead visitors. |
| 5. Undo toasts | **Skipped** | No public delete, archive, or reversible server-backed action. Email copying already gives live status feedback. |
| 6. Stale-while-revalidate | **Skipped** | Project and service data is bundled locally, not requested from a remote data endpoint. |
| 7. Prerender/speculation rules | **Skipped** | This site uses React HashRouter and client-side routes in a single document. Speculative document prerender would not meaningfully speed these links. |
| 8. BlurHash/ThumbHash | **Skipped** | Screenshots are static checked-in assets, not user-uploaded media with thumbnail hash metadata. The delayed, sized image skeletons address slow loading without introducing hashing infrastructure. |
| 9. View transitions | **Built** | `src/pages/Projects.jsx`, `src/polish.css`. Filters use `document.startViewTransition` when available, with graceful fallback, under-300-ms CSS transitions, and no motion under reduced-motion preferences. Use the category filters on the Projects page. |
| 10. Swipe-to-dismiss sheets | **Skipped** | Contact options use an accessible centered dialog, not a native bottom sheet. Escape, outside click, and a visible close button are supported. |
| 11. Interruptible animations | **Built** | `src/polish.css` replaces restart-prone navigation hover waterfall animation with reversible transitions. Existing Motion springs in `src/components/MotionPrimitives.jsx` and `Button.jsx` are preserved. Reduced motion is honored. |
| 12. Android predictive back | **Skipped** | Native Android-only API; this is a browser site using standard history and HashRouter. |
| 13. Hit slop/tap sizes | **Built** | `src/polish.css`. Link and small icon controls get at least 44px high targets, increased to 48px on coarse pointers; avoids changing visible icons or overlapping neighbors. Try mobile navigation and email dialog close button. |
| 14. Safe-area insets | **Built** | `index.html` adds `viewport-fit=cover`; `src/polish.css` uses safe-area inset values for body, header, footer and dialog. Inspect on notched or landscape phones. |
| 15. OTP autofill | **Skipped** | No login, signup, verification code, or SMS service on this public site. |
| 16. Tabular numbers | **Built** | `src/polish.css`. Dates, section numbers, counter displays and project metadata use `font-variant-numeric: tabular-nums`; browser test covers service numbers. |
| 17. Balanced headlines | **Built** | `src/polish.css` extends existing balanced hero headings to section/card headings, with `text-wrap: pretty` for supporting paragraphs. |
| 18. Continuous corners | **Built** | `src/polish.css`. Progressive `corner-shape: squircle` on major cards where supported, falling back to the original `border-radius` everywhere else. |
| 19. Idempotency keys | **Skipped** | Public site has no real payment/record creation endpoint. The old admin UI was an unconnected scaffold and is now redirected away. Real payment systems require server-side idempotency. |
| 20. Safe triangle menus | **Skipped** | Navigation has no flyout submenu or diagonal pointer-path problem. |

## Security controls verified

- **Dependencies:** `npm audit` on the current repository reported **0 info, low, moderate, high, or critical advisories** during the 23 November 2026 run. This is a point-in-time advisory check, not proof that unknown vulnerabilities do not exist.
- **Build safeguards:** `scripts/security-check.mjs` checks built output for known secret patterns, restrictive HTML Content Security Policy, referrer privacy and removal of public admin access.
- **Browser checks:** `scripts/check-security-browser.mjs` tests four encoded malicious-looking route strings against a local copy, verifies CSP blocks inline-script execution, confirms external links have opener protection, and checks the admin route redirects. The checks are deliberately non-destructive.
- **Live hosting:** `scripts/check-live-headers.mjs` verified HTTPS 200, the expected HTML policy and `Strict-Transport-Security: max-age=31556952`. The host did **not** provide a CSP HTTP header, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers on the inspected response.
- **Privacy:** `src/pages/Privacy.jsx` and the Footer link provide a plain-language notice about email contact, hosting, Google Fonts and external destinations. The site has no authenticated public dashboard, contact database form, analytics tracker or payment collection.
- **Automation safeguards:** `.github/workflows/security-audit.yml` runs audits on relevant updates and weekly with read-only repository permission. Screenshot capture has narrower triggers and no unnecessary Actions-write permission.
- **Disclosure:** `SECURITY.md` provides private vulnerability-reporting instructions.

**Known limitation:** GitHub Pages does not let this repository define all HTTP
response headers. The HTML meta CSP is useful, but `frame-ancestors` and
header-level clickjacking defenses cannot be enabled by that mechanism. For
full custom headers, migrate to a host with response header configuration
(e.g. Cloudflare Pages or Netlify), re-run these checks, and validate them
with an independent security review. Third-party live applications and
infrastructure are outside this portfolio audit.

## India: business sharing and legal readiness

This is a private professional portfolio rather than a government website
or an online marketplace. The Guidelines for Indian Government Websites
primarily address public-sector sites and should not be represented as a
mandatory certification for this portfolio.

The DPDP Act, 2023 and DPDP Rules, 2025 have a phased commencement. Core
obligations for personal-data processing are scheduled to apply from May
2027; the website's new privacy notice is a readiness step, not a complete
legal compliance determination. Review notice, consent, processing,
retention, grievance handling and cross-border processing as the law
becomes applicable or new data-collection features are added.

If using this portfolio for bulk SMS or telemarketing, follow TRAI's
TCCCPR rules, recipient preferences and consent requirements. CERT-In
incident reporting requirements may apply to covered entities; these
depend on the actual business and incident, not just the static site code.
Tax/GST registration, business registration, contractual disclosures,
trademark/brand permissions and customer outreach practices require
their own factual and professional review.

Official references:
- https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655&lang=1&reg=3
- https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf
- https://www.trai.gov.in/advice-to-senders
- https://guidelines.india.gov.in/scope-and-objective/
- https://owasp.org/projects/web-security-testing-guide

**No security test or automated check can guarantee the absence of
vulnerabilities or certify compliance with every law.** Before moving
real client operations, forms, accounts or payments to this site, commission
a targeted penetration test and an India-qualified legal review.
