import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const sizes = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]
const root = 'http://127.0.0.1:4173/portfolio/'
const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}
try {
  for (const viewport of sizes) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    try {
      await page.goto(root + '#/', { waitUntil: 'domcontentloaded' })
      await page.locator('#services .service-tile').first().waitFor({ state: 'visible' })
      const services = await page.locator('#services .service-tile').count()
      assert(services === 8, 'Expected eight service cards, saw ' + services)
      const serviceGrid = await page.locator('.service-compact-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)
      assert(serviceGrid === (viewport.width < 530 ? 1 : 4),
        'Unexpected service grid at ' + viewport.width + 'px: ' + serviceGrid)

      // The site's existing hero animations and assets must remain intact.
      assert(await page.locator('.hero-car canvas').count() === 1, 'Original 3D car is missing')
      assert(await page.locator('.coffee-art svg').count() === 1, 'Original coffee art is missing')

      await page.locator('#contact .email-card').click()
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'visible' })
      assert(await page.getByRole('button', { name: 'Copy email address' }).isVisible(), 'Copy email choice missing')
      assert(await page.getByRole('button', { name: 'Open email app' }).isVisible(), 'Open app email choice missing')
      await page.keyboard.press('Escape')
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'hidden' })

      await page.locator('.footer-mail').click()
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'visible' })
      await page.keyboard.press('Escape')

      await page.goto(root + '#/projects', { waitUntil: 'domcontentloaded' })
      await page.locator('.project-grid--listing .project-card').first().waitFor({ state: 'visible' })
      const mainCount = await page.locator('.project-grid--listing .project-card').count()
      const wipCount = await page.locator('.projects-wip-card').count()
      assert(mainCount === 3, 'Expected three core projects, saw ' + mainCount)
      assert(wipCount === 1, 'Expected one B2B Work in Progress project, saw ' + wipCount)
      const text = await page.locator('.projects-wip-card').innerText()
      assert(text.includes('Steel Trading Quotes'), 'B2B prototype not listed in Work in Progress')
      await page.getByRole('button', { name: 'Work in progress', exact: true }).click()
      assert(await page.locator('.project-grid--listing .project-card').count() === 0, 'WIP filter still shows core projects')
      assert(await page.locator('.projects-wip-card').count() === 1, 'WIP filter hides the B2B project')
      await page.getByRole('button', { name: 'All', exact: true }).click()
      assert(await page.locator('.project-grid--listing .project-card').count() === 3, 'All filter missing core projects')

      await page.goto(root + '#/projects/ERP-Software-Demo', { waitUntil: 'domcontentloaded' })
      await page.locator('.erp-custom-banner').waitFor({ state: 'visible' })
      assert((await page.locator('.erp-custom-banner h2').innerText()).includes('built to your specifications'),
        'ERP customization promise not highlighted')
      assert(await page.locator('.detail-back').isVisible(), 'Back to all projects link missing')
      await page.locator('.erp-custom-cta').click()
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'visible' })
      await page.keyboard.press('Escape')

      await page.goto(root + '#/projects/Steel-Quotes', { waitUntil: 'domcontentloaded' })
      await page.locator('h1.page-heading').waitFor({ state: 'visible' })
      assert(await page.locator('.detail-gallery-item').count() === 3, 'B2B prototype screenshot walkthrough missing')
      console.log('PASS:', viewport.width+'x'+viewport.height,
        'original car and coffee, 8 services, 3 main projects, 1 WIP, email modal and ERP customization')
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
console.log('All new portfolio experience checks passed.')
