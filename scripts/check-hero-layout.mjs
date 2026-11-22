import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const sizes = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
]
const padding = 3
const intersects = (a,b) => a && b &&
  Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>padding &&
  Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>padding
let failed = false
try {
  for (const viewport of sizes) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
    try {
      await page.goto('http://127.0.0.1:4173/portfolio/#/', { waitUntil: 'domcontentloaded' })
      await page.locator('.hero .hero-content h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      const selectors = {
        heading: '.hero .hero-content h1',
        intro: '.hero .hero-intro',
        actions: '.hero .hero-actions',
        feature: '.hero .hero-feature',
        visual: '.hero .hero-visual',
        footer: '.hero .hero-bottom',
      }
      const boxes = {}
      for (const [key, selector] of Object.entries(selectors)) boxes[key] = await page.locator(selector).boundingBox()
      const pairs = [
        ['heading','feature'], ['heading','visual'],
        ['intro','feature'], ['intro','visual'],
        ['actions','feature'], ['actions','visual'],
        ['feature','visual'], ['footer','feature'], ['footer','visual'],
      ]
      const overlapping = pairs.filter(([a,b]) => intersects(boxes[a],boxes[b]))
      const tooWide = Object.entries(boxes).filter(([key,b]) => b && (b.x < -4 || b.x+b.width > viewport.width+4)).map(([key]) => key)
      const show = Object.fromEntries(Object.entries(boxes).map(([key,b]) => [key, b && { x:Math.round(b.x), y:Math.round(b.y), w:Math.round(b.width), h:Math.round(b.height) }]))
      console.log('Viewport:',viewport.width+'x'+viewport.height, JSON.stringify({overlapping,tooWide,boxes:show}))
      if (overlapping.length || tooWide.length) failed = true
      if (!await page.locator('.hero-car canvas').count() || !await page.locator('.coffee-art svg').count()) {
        console.error('3D car or coffee animation missing')
        failed = true
      }
    } catch(error) {
      console.error('Layout check error:',viewport.width,error)
      failed = true
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
if (failed) process.exit(1)
console.log('Responsive hero checks passed for all five viewport sizes.')
