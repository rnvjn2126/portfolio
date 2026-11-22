import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const assert = (condition, message) => {
  if (!condition) throw new Error('Security check failed: ' + message)
}

const html = await readFile('dist/index.html', 'utf8')
const app = await readFile('src/App.jsx', 'utf8')
const policy = html.match(/<meta[^>]+http-equiv="Content-Security-Policy"[^>]*>/)?.[0] || ''
assert(policy.includes("script-src 'self'"), 'CSP must restrict executable scripts to the same origin')
assert(policy.includes("object-src 'none'"), 'object/embed content must be blocked')
assert(policy.includes("base-uri 'self'"), 'base URI must be restricted')
assert(policy.includes("form-action 'none'"), 'unconnected forms must not submit')
assert(!policy.includes("'unsafe-eval'"), 'CSP must not enable unsafe-eval')
assert(html.includes('name="referrer" content="no-referrer"'), 'privacy-preserving referrer policy is missing')
assert(html.includes('viewport-fit=cover'), 'mobile safe-area viewport is missing')
assert(!app.includes('element={<Admin />}'), 'the unauthenticated admin scaffold must not be served')
assert(app.includes('path="/admin/*" element={<Navigate to="/" replace />}'),
  'admin paths should redirect away from the public portfolio')

const files = []
async function collect(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name)
    if (entry.isDirectory()) await collect(child)
    else if (entry.isFile() && (child.endsWith('.js') || child.endsWith('.html') || child.endsWith('.css') || child.endsWith('.json'))) files.push(child)
  }
}
await collect('dist')
assert(files.length > 0, 'build output is missing')
const secrets = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /sk_(?:live|test)_[A-Za-z0-9]{12,}/,
  /rzp_(?:live|test)_[A-Za-z0-9]{10,}/,
  /ghp_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{40,}/,
  /AIza[A-Za-z0-9_-]{30,}/,
]
for (const file of files) {
  if ((await stat(file)).size > 6_000_000) continue
  const content = await readFile(file, 'utf8')
  for (const pattern of secrets) assert(!pattern.test(content), 'possible credential exposed in ' + file)
}
console.log('PASS: CSP restrictions, no-referrer, protected admin route, safe viewport and bundled secret scan')
console.log('Inspected', files.length, 'HTML/JavaScript/CSS/JSON build files')
