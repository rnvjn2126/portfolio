# Security policy

This repository contains a public, static React portfolio deployed with GitHub Pages.

## Report an issue privately

Please email **jainaarnav2126@gmail.com** with a brief description,
the affected portfolio URL, steps to reproduce, and any non-sensitive
supporting evidence. Do not include passwords, access tokens, or another
person's private information.

Please use non-destructive tests and avoid automated high-volume scanning
of the public site or third-party services.

## Scope

The portfolio at https://rnvjn2126.github.io/portfolio/ and its repository
are in scope. Linked external websites, live applications, social media,
GitHub infrastructure, and private ERP deployments are managed separately
and are **not** covered by permission to test this site.

## Current safeguards

- HTTPS hosting with a browser-level Content Security Policy.
- No publicly accessible authenticated admin, payments, or form backend.
- Browser checks for injection, external-link opener protection, and routes.
- Weekly dependency scans and secret scanning of generated build artifacts.
- A privacy notice describing visitor data and business email contact.

Header-only controls such as `frame-ancestors`, `X-Frame-Options`,
`Permissions-Policy`, and custom server response headers cannot be set
through repository HTML on GitHub Pages. They require hosting with
configurable HTTP response headers.

This policy is not a warranty that the website is free of vulnerabilities.
