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
      // Regression: both headline lines must exist on the first rendered frame.
      // The previous per-word entrance animation hid the second line on refresh.
      const headlineState = await page.locator('.hero .hero-content h1').evaluate(heading => {
        const secondLine = heading.querySelector('.gradient-text')
        const rect = secondLine?.getBoundingClientRect()
        return {
          text: heading.textContent.replace(/\\s+/g, ' ').trim(),
          secondLine: secondLine?.textContent?.trim(),
          visible: Boolean(rect && rect.width > 0 && rect.height > 0),
          hiddenAnimatedWords: heading.querySelectorAll('[style*="opacity: 0"], [style*="blur("]').length,
          secondLineOpacity: secondLine ? getComputedStyle(secondLine).opacity : '0'
        }
      })
      if (!headlineState.text.includes('Thoughtful design.') ||
          headlineState.secondLine !== 'Purposeful development.' ||
          !headlineState.visible ||
          headlineState.hiddenAnimatedWords > 0 ||
          headlineState.secondLineOpacity === '0') {
        console.error('Incomplete headline on initial render:', viewport.width, headlineState)
        failed = true
      }
      await page.evaluate(() => document.fonts.ready)
      // The large hero wrapper should remain visually unboxed.
      // Its two inner cards (Ideas and the F1 car) stay styled separately.
      const heroSurface = await page.locator('.hero.shell').evaluate(element => {
        const style = getComputedStyle(element)
        return {
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImage,
          boxShadow: style.boxShadow,
          borderRadius: style.borderTopLeftRadius,
        }
      })
      if (heroSurface.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          heroSurface.backgroundImage !== 'none' ||
          heroSurface.boxShadow !== 'none' ||
          heroSurface.borderRadius !== '0px') {
        console.error('Unwanted large hero background panel:', viewport.width, heroSurface)
        failed = true
      }
      // The hero uses a distinct complementary cream-and-olive palette,
      // with a dark olive car stage and light text for contrast.
      const palette = await page.locator('.hero.shell').evaluate(hero => {
        const feature = hero.querySelector('.hero-feature')
        const visual = hero.querySelector('.hero-visual')
        const heading = visual?.querySelector('.hero-visual__heading')
        return {
          page: getComputedStyle(hero).backgroundImage,
          feature: feature ? getComputedStyle(feature).backgroundImage : '',
          carStage: visual ? getComputedStyle(visual).backgroundImage : '',
          label: heading ? getComputedStyle(heading).color : '',
        }
      })
      if (!palette.page.includes('linear-gradient') ||
          !palette.feature.includes('linear-gradient') ||
          !palette.carStage.includes('linear-gradient') ||
          palette.feature === palette.carStage ||
          palette.label !== 'rgb(255, 253, 244)') {
        console.error('Complementary hero palette is missing:',viewport.width,palette)
        failed = true
      }
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
