/**
 * Passive, single-page check of the deployed portfolio. No fuzzing or
 * intrusive requests are directed at GitHub's hosting infrastructure.
 */
const url = 'https://rnvjn2126.github.io/portfolio/'
const response = await fetch(url, {
  method: 'GET',
  redirect: 'follow',
  signal: AbortSignal.timeout(15000),
})
if (!response.ok) throw new Error('Portfolio is not reachable over HTTPS: ' + response.status)
if (!response.url.startsWith('https://')) throw new Error('Live site was not served over HTTPS')
const html = await response.text()
if (!html.includes('Content-Security-Policy') || !html.includes('name="referrer"')) {
  throw new Error('The deployed HTML does not include the expected client-side safeguards')
}
const fields = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
  'permissions-policy',
]
console.log('Live HTTPS status:', response.status, response.url)
for (const key of fields) {
  const value = response.headers.get(key)
  console.log(key + ':', value || '(not supplied by GitHub Pages HTTP response)')
}
if (!response.headers.has('content-security-policy')) {
  console.log('NOTE: CSP is enforced by the HTML meta tag; header-only frame-ancestors cannot be controlled on this host.')
}
console.log('PASS: public site is reachable using TLS, and expected HTML protections are deployed')
