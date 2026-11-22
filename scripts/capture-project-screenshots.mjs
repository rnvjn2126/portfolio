import { chromium } from 'playwright'
import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Genuine desktop screenshots only; unavailable websites retain their existing illustrations.
const directory = 'public/images/screenshots'
await mkdir(directory, { recursive: true })
const sites = [
  { name: 'AJ Overseas', file: 'aj-overseas.png', urls: ['https://aj-overseas.in', 'https://www.aj-overseas.in'] },
  { name: 'Career AI Pro', file: 'career-ai-pro.png', urls: ['https://resumeproject123.streamlit.app'] },
]
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5, colorScheme: 'light', reducedMotion: 'reduce' })
try {
  for (const site of sites) {
    let saved = false
    for (const url of site.urls) {
      const page = await context.newPage()
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 80000 })
        if (response && response.status() >= 400) throw new Error('HTTP ' + response.status())
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
        if (site.name === 'Career AI Pro') {
          for (let i = 0; i < 4; i++) {
            const wake = page.getByRole('button', { name: /get this app back up|wake.*app|yes.*back up/i }).first()
            if (await wake.count()) {
              await wake.click({ timeout: 10000 }).catch(() => {})
              await page.waitForTimeout(16000)
            } else {
              await page.waitForTimeout(8000)
            }
          }
        } else {
          await page.waitForTimeout(4500)
        }
        const body = (await page.locator('body').innerText({ timeout: 10000 })).trim()
        const title = await page.title()
        if (body.length < 90) throw new Error('No usable rendered content')
        if (/this app has gone to sleep|this site can.t be reached|application error|404 not found|502 bad gateway|403 forbidden/i.test(body.slice(0,2000))) throw new Error('Unavailable website')
        if (/just a moment|checking your browser/i.test(title + ' ' + body.slice(0,160))) throw new Error('Anti-bot challenge')
        const output = join(directory, site.file)
        await page.screenshot({ path: output, fullPage: false, animations: 'disabled' })
        if ((await stat(output)).size < 15000) throw new Error('Image too small to trust')
        console.log('Captured genuine screenshot:', site.name, output)
        saved = true
        break
      } catch (error) {
        console.warn('Screenshot unavailable:', site.name, url, String(error))
      } finally {
        await page.close()
      }
    }
    if (!saved) console.warn('Retaining illustrated fallback for', site.name)
  }
} finally {
  await browser.close()
}
