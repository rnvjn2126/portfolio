import { chromium } from 'playwright'

const browser = await chromium.launch({
  headless: true,
  args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const root = 'http://127.0.0.1:4173/portfolio/#/'
const assert = (condition, message) => { if (!condition) throw new Error(message) }

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' })
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
      await car.waitFor({ state: 'visible', timeout: 20000 })
      const status = car.locator('.hero-car__status')
      await page.waitForFunction(() => {
        const label = document.querySelector('.hero-car > .hero-car__status')?.textContent || ''
        return !label.startsWith('Loading 3D car')
      }, null, { timeout: 60000 })
      const message = await status.innerText()
      console.log('3D car status', viewport.width, JSON.stringify({ message, issues }))
      assert(message.toLowerCase().includes('disassemble'), 'Car not loaded: ' + message + '\n' + issues.join('\n'))
      const pixels = await car.locator('canvas').evaluate(canvas => {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
        if (!gl) return { width: canvas.width, height: canvas.height, hasWebGL: false }
        const buffer = new Uint8Array(4)
        gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buffer)
        return { width: canvas.width, height: canvas.height, hasWebGL: true, centerPixel: [...buffer] }
      })
      console.log('3D car canvas', viewport.width, JSON.stringify(pixels))
      assert(pixels.width > 100 && pixels.height > 50, 'Car canvas is not correctly sized')
      assert(!issues.some(issue => /Unable to (load|prepare)|TypeError|RangeError/.test(issue)), issues.join('\n'))
    } finally {
      await page.close()
    }
  }
} finally {
  await browser.close()
}
console.log('3D car loads and renders at desktop and mobile widths')
