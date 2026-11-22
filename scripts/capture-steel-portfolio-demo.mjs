/**
 * Genuine screenshots from the running Django Steel Quotes branch.
 * This script logs in with disposable credentials created in GitHub Actions.
 * It never draws, edits, or fabricates UI and never captures real customer data.
 */
import { chromium } from 'playwright'
import { readFile, mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const credentials = JSON.parse(await readFile('/tmp/steel-portfolio-demo-access.json', 'utf8'))
const base = 'http://127.0.0.1:8765'
const output = 'public/images/screenshots'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1600, height: 1030 },
  deviceScaleFactor: 2,
  colorScheme: 'light',
  reducedMotion: 'reduce',
})
const page = await context.newPage()
const results = []
page.on('pageerror', error => console.warn('Page JavaScript error:', error.message))

async function openPage(path, heading, requiredText) {
  const response = await page.goto(base + path, { waitUntil: 'load', timeout: 35000 })
  if (!response || response.status() !== 200) {
    throw new Error('Django returned HTTP ' + (response?.status() || 'no response') + ' at ' + path)
  }
  await page.getByRole('heading', { name: heading, exact: false }).first().waitFor({ state: 'visible', timeout: 14000 })
  const text = await page.locator('main').innerText()
  for (const phrase of requiredText) {
    if (!text.includes(phrase)) throw new Error('Missing expected real application content: ' + phrase)
  }
}

async function capture(name, scrollToComparison = false) {
  if (scrollToComparison) {
    const element = page.getByRole('heading', { name: 'Requested items and supplier comparison' })
    await element.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy({ top: -92, behavior: 'instant' }))
  } else {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  }
  await page.waitForTimeout(500)
  const filename = join(output, name)
  await page.screenshot({
    path: filename, type: 'png', fullPage: false, animations: 'disabled',
    caret: 'hide',
  })
  const size = (await stat(filename)).size
  if (size < 28000) throw new Error('Refusing suspiciously small screenshot: ' + filename + ' ' + size)
  results.push({ name, bytes: size, page: await page.title(), url: new URL(page.url()).pathname })
  console.log('Captured genuine Django screen', JSON.stringify(results.at(-1)))
}

try {
  const login = await page.goto(base + '/accounts/login/', { waitUntil: 'domcontentloaded' })
  if (!login || login.status() !== 200) throw new Error('Login page unavailable')
  await page.locator('input[name="username"]').fill(credentials.username)
  await page.locator('input[name="password"]').fill(credentials.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await openPage('/', 'Steel quotation workspace', ['Catalogue overview:', 'Next follow-ups'])
  await capture('steel-quotes-workspace.png')
  await openPage('/rfqs/' + credentials.rfq_id + '/', 'ENQ-DEMO-1042', [
    'Requested items and supplier comparison', 'Greenfield Metals (Demo)', 'Harbor Steel Supply (Demo)', 'Landed'
  ])
  await capture('steel-quotes-enquiry.png', true)
  await openPage('/quotes/' + credentials.quote_id + '/', 'Quotation SQ-DEMO-0042', [
    'Quote totals', 'Gross margin', 'Download customer quotation PDF'
  ])
  await capture('steel-quotes-quotation.png')
  console.log('All three screenshots verified from authenticated Django app:', JSON.stringify(results))
} finally {
  await browser.close()
}
