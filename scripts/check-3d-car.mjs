import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const root = 'http://127.0.0.1:4173/portfolio/#/'
const assert = (condition, message) => { if (!condition) throw new Error(message) }

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const mobile = viewport.width < 600
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce', hasTouch: mobile, isMobile: mobile })
    const page = await context.newPage()
    const issues = []
    page.on('pageerror', error => issues.push('pageerror: ' + error.message))
    page.on('console', message => {
      if (message.type() === 'error' && !message.text().includes('WebGL: INVALID_ENUM')) {
        issues.push('console: ' + message.text())
      }
    })
    try {
      await page.goto(root, { waitUntil: 'domcontentloaded' })
      const car = page.locator('.hero-car')
      const canvas = car.locator('canvas')
      await car.waitFor({ state: 'visible', timeout: 20000 })
      await page.waitForFunction(() => {
        const label = document.querySelector('.hero-car > .hero-car__status')?.textContent || ''
        return label && !label.startsWith('Loading 3D car')
      }, null, { timeout: 60000 })
      const message = await car.locator('.hero-car__status').innerText()
      console.log('F1 car status', viewport.width, JSON.stringify({
        message,
        errorCount: issues.length,
        firstErrors: issues.slice(0, 3),
      }))
      assert(message.toLowerCase().includes('disassemble'), 'F1 car not loaded: ' + message)
      // The full original glTF is painted before CPU-intensive assembly
      // segmentation; never substitute a poster or low-detail proxy.
      const preload = await page.locator('link[rel="preload"][as="fetch"]').getAttribute('href')
      assert(preload?.endsWith('/portfolio/models/formula-car.glb'),
        'Browser must start downloading the actual car from the initial HTML')
      await page.waitForFunction(() => performance.getEntriesByName('portfolio:f1-exploded-controls-ready').length > 0,
        null, { timeout: 30000 })
      const firstRender = await page.evaluate(() => {
        const visible = performance.getEntriesByName('portfolio:f1-complete-model-rendered')[0]?.startTime
        const controls = performance.getEntriesByName('portfolio:f1-exploded-controls-ready')[0]?.startTime
        const modelFetches = performance.getEntriesByType('resource')
          .filter(entry => entry.name.includes('/models/formula-car.glb'))
          .map(entry => Math.round(entry.startTime))
        return { visible, controls, modelFetches }
      })
      assert(Number.isFinite(firstRender.visible) && firstRender.controls > firstRender.visible,
        'The complete car should be drawn before exploded-view preparation completes')
      console.log('F1 early model render', viewport.width, JSON.stringify(firstRender))
      const pixels = await canvas.evaluate(element => ({
        width: element.width,
        height: element.height,
      }))
      assert(pixels.width > 100 && pixels.height > 50, 'Car canvas is not sized correctly')
      assert(!issues.some(issue => /couldn't load texture|blob:.*violates|unable to (load|prepare)|TypeError|RangeError/i.test(issue)),
        '3D texture/loader problem: ' + issues.slice(0, 4).join('\n'))

      // An existing WebGL canvas does not guarantee a visible car. Compare
      // browser-composited pixels with and without the canvas; no dependency.
      const visiblePng = (await canvas.screenshot()).toString('base64')
      await canvas.evaluate(element => { element.style.opacity = '0' })
      const emptyPng = (await canvas.screenshot()).toString('base64')
      await canvas.evaluate(element => { element.style.opacity = '' })
      const visibleFraction = await page.evaluate(async images => {
        const decode = source => new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = reject
          image.src = 'data:image/png;base64,' + source
        })
        const [visible, empty] = await Promise.all([decode(images.visible), decode(images.empty)])
        const bitmap = document.createElement('canvas')
        bitmap.width = visible.width
        bitmap.height = visible.height
        const context = bitmap.getContext('2d', { willReadFrequently: true })
        context.drawImage(visible, 0, 0)
        const foreground = context.getImageData(0, 0, bitmap.width, bitmap.height).data
        context.clearRect(0, 0, bitmap.width, bitmap.height)
        context.drawImage(empty, 0, 0)
        const background = context.getImageData(0, 0, bitmap.width, bitmap.height).data
        let changed = 0
        for (let index = 0; index < foreground.length; index += 4) {
          const difference = Math.abs(foreground[index] - background[index])
            + Math.abs(foreground[index + 1] - background[index + 1])
            + Math.abs(foreground[index + 2] - background[index + 2])
          if (difference > 45) changed += 1
        }
        return changed / (bitmap.width * bitmap.height)
      }, { visible: visiblePng, empty: emptyPng })
      console.log('F1 model visible pixel fraction', viewport.width, visibleFraction)
      assert(visibleFraction > .005, '3D car is visually blank at ' + viewport.width + 'px')

      if (mobile) {
        await car.tap()
        assert(await car.getAttribute('aria-pressed') === 'true', 'Touch tap must expand the car')
        await car.tap()
        assert(await car.getAttribute('aria-pressed') === 'false', 'Second touch tap must reassemble')
      } else {
        await car.focus()
        await car.press('Enter')
        assert(await car.getAttribute('aria-pressed') === 'true', 'Keyboard Enter must expand the car')
        await car.press('Enter')
        assert(await car.getAttribute('aria-pressed') === 'false', 'Second Enter must reassemble')
      }
      console.log('PASS: F1 car rendered and toggle worked at', viewport.width)
    } finally {
      await context.close()
    }
  }
} finally {
  await browser.close()
}
console.log('PASS: Formula 1 3D car renders and responds on desktop/mobile')
