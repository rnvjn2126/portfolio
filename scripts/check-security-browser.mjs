import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const root = 'http://127.0.0.1:4173/portfolio/'
const assert = (value, message) => { if (!value) throw new Error(message) }

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  try {
    await page.goto(root + '#/', { waitUntil: 'domcontentloaded' })
    await page.locator('.hero .hero-content h1').waitFor({ state: 'visible' })
    const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')
    assert(policy?.includes("script-src 'self'"), 'Script CSP not present')
    assert(policy?.includes("object-src 'none'"), 'Active plugin objects should be blocked')
    assert(policy?.includes("base-uri 'self'"), 'Base URL should be constrained')

    const injected = await page.evaluate(() => {
      window.__securityInlineWasExecuted = false
      const script = document.createElement('script')
      script.textContent = 'window.__securityInlineWasExecuted = true'
      document.body.appendChild(script)
      script.remove()
      return window.__securityInlineWasExecuted
    })
    assert(!injected, 'CSP should block injected inline scripts')

    // Use harmless markers in encoded hash routes to test rendering and
    // string escaping; never send exploit requests to third-party services.
    const payloads = [
      '<img src=x onerror=window.__securityXss=1>',
      '<svg onload=window.__securityXss=1>',
      '</h1><script>window.__securityXss=1</script>',
      'javascript:alert(1)',
    ]
    for (const payload of payloads) {
      await page.goto(root + '#/projects/' + encodeURIComponent(payload), { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { name: 'Project not found.' }).waitFor({ state: 'visible' })
      assert(await page.locator('script[src^="javascript:"]').count() === 0,
        'A suspicious script URL was rendered')
      assert(!(await page.evaluate(() => window.__securityXss === 1)),
        'Untrusted route text was executed')
    }
    console.log('PASS: four malformed route payloads handled safely')

    await page.goto(root + '#/admin', { waitUntil: 'domcontentloaded' })
    await page.locator('.hero .hero-content h1').waitFor({ state: 'visible' })
    assert(await page.locator('.admin-shell').count() === 0, 'Admin UI must not be public')

    for (const route of ['#/', '#/projects', '#/projects/Career%20AI%20Pro', '#/privacy']) {
      await page.goto(root + route, { waitUntil: 'domcontentloaded' })
      await page.locator('.site-header').waitFor({ state: 'visible' })
      const links = await page.locator('a[target="_blank"]').evaluateAll(anchors =>
        anchors.map(a => ({ href: a.href, rel: a.rel, target: a.target }))
      )
      for (const link of links) {
        assert(link.rel.split(' ').some(token => token === 'noopener' || token === 'noreferrer'),
          'External link missing opener protection: ' + link.href)
      }
    }
    console.log('PASS: external links protect opener, private admin disabled and CSP enforced')
  } finally {
    await page.close()
  }
} finally {
  await browser.close()
}
console.log('PASS: non-destructive local browser security checks complete')
