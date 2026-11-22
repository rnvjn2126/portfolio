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
      // Symmetrical white-beige-green cards: first half of each desktop row
      // fades left-to-right and the second half mirrors green-beige-white.
      const serviceGradients = await page.locator('#services .service-tile').evaluateAll(elements =>
        elements.map(element => getComputedStyle(element).backgroundImage)
      )
      const leftPositions = viewport.width > 1120 ? [0, 1, 4, 5] : [0, 2, 4, 6]
      const rightPositions = viewport.width > 1120 ? [2, 3, 6, 7] : [1, 3, 5, 7]
      const leftGradient = serviceGradients[leftPositions[0]]
      const rightGradient = serviceGradients[rightPositions[0]]
      assert(serviceGradients.length === 8 && leftGradient.includes('linear-gradient') &&
        rightGradient.includes('linear-gradient') && leftGradient !== rightGradient &&
        leftPositions.every(index => serviceGradients[index] === leftGradient) &&
        rightPositions.every(index => serviceGradients[index] === rightGradient),
        'Service cards do not maintain their mirrored left/right color patterns')

      // The site's existing hero animations and assets must remain intact.
      assert(await page.locator('.hero-car canvas').count() === 1, 'Original 3D car is missing')
      assert(await page.locator('.coffee-art svg').count() === 1, 'Original coffee art is missing')

      // Three finished projects in a two-column grid, with no fourth placeholder.
      const cards = page.locator('#work .work-four-grid > *')
      assert(await cards.count() === 3, 'Homepage should have exactly three project grid items')
      assert(await page.locator('#work .work-four-grid .home-project-card').count() === 3,
        'Homepage should show exactly three compact project cards')
      assert(await page.locator('#work .work-future-card').count() === 0,
        'The fourth position must remain completely blank')
      const names = await page.locator('#work .work-four-grid .home-project-copy h3').allInnerTexts()
      assert(names.join(' | ') === 'AJ Overseas | Career AI Pro | ERP Software Demo',
        'Unexpected homepage featured projects: ' + names.join(' | '))
      const wipPreview = page.locator('#work .home-wip-entry')
      assert(await wipPreview.count() === 1, 'Homepage needs one small Work in Progress preview')
      assert((await wipPreview.innerText()).includes('Steel Trading Quotes'),
        'Homepage WIP preview does not show the current B2B project')
      const cardHeights = await page.locator('#work .home-project-card').evaluateAll(
        elements => elements.map(element => element.getBoundingClientRect().height)
      )
      assert(cardHeights.every(height => height <= 350),
        'Homepage cards have not been reduced in height: ' + cardHeights.join(', '))
      const arrows = await page.locator('#services .service-arrow.lucide-arrow-up-right').count()
      assert(arrows === 0, 'Decorative service arrows were not replaced with meaningful icons')

      const rectangles = await Promise.all([0,1,2].map(index => cards.nth(index).boundingBox()))
      assert(rectangles.every(Boolean), 'A homepage project has no layout box')
      const same = (a,b) => Math.abs(a-b) < 6
      if (viewport.width >= 761) {
        assert(same(rectangles[0].y,rectangles[1].y) &&
               same(rectangles[0].x,rectangles[2].x) &&
               rectangles[2].y > rectangles[0].y,
          'Homepage projects should occupy top left, top right, and bottom left')
      } else {
        assert(rectangles[0].y < rectangles[1].y &&
               rectangles[1].y < rectangles[2].y,
          'Homepage project cards do not stack correctly on mobile')
      }


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
      // Every listing card must put its primary and secondary actions in
      // identical positions despite varying descriptions, research or notes.
      const listingActionLayout = await page.locator('.project-grid--listing .project-card').evaluateAll(cards => (
        cards.map(card => {
          const cardBounds = card.getBoundingClientRect()
          const primary = card.querySelector('.project-actions-primary')
          const secondary = card.querySelector('.project-actions-secondary')
          const details = card.querySelector('.project-details-button')
          const action = primary?.querySelector('a,button')
          const rect = element => element?.getBoundingClientRect()
          return {
            title: card.querySelector('.project-title-link h3')?.textContent?.trim(),
            cardBottom: cardBounds.bottom,
            primaryTop: rect(primary)?.top,
            secondaryTop: rect(secondary)?.top,
            detailsBottom: rect(details)?.bottom,
            detailsHeight: rect(details)?.height,
            primaryHeight: rect(action)?.height,
            hasPrimaryAction: Boolean(action),
            hasSource: Boolean(card.querySelector('.project-source-button'))
          }
        })
      ))
      assert(listingActionLayout.every(item =>
        item.hasPrimaryAction && Math.abs(item.primaryHeight - 47) < 2 &&
        Math.abs(item.detailsHeight - 47) < 2
      ), 'Project action button heights or primary links are inconsistent: ' +
        JSON.stringify(listingActionLayout))
      const alignment = (items, property) =>
        Math.max(...items.map(item => item[property])) -
        Math.min(...items.map(item => item[property]))
      if (viewport.width >= 1120) {
        assert(alignment(listingActionLayout, 'primaryTop') < 3 &&
               alignment(listingActionLayout, 'secondaryTop') < 3,
          'Desktop listing action rows do not line up: ' + JSON.stringify(listingActionLayout))
      }
      assert(alignment(listingActionLayout.map(item => ({
        bottomGap: item.cardBottom - item.detailsBottom
      })), 'bottomGap') < 3,
        'Project details buttons have inconsistent distance from card bottoms')
      assert(listingActionLayout[1].hasSource && !listingActionLayout[0].hasSource &&
             !listingActionLayout[2].hasSource,
        'Project source links must retain their individual permissions')
      await page.locator('.project-grid--listing .project-consult-button').click()
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'visible' })
      await page.keyboard.press('Escape')
      const text = await page.locator('.projects-wip-card').innerText()
      assert(text.includes('Steel Trading Quotes'), 'B2B prototype not listed in Work in Progress')
      await page.getByRole('button', { name: 'Work in progress', exact: true }).click()
      assert(await page.locator('.project-grid--listing .project-card').count() === 0, 'WIP filter still shows core projects')
      assert(await page.locator('.projects-wip-card').count() === 1, 'WIP filter hides the B2B project')
      await page.getByRole('button', { name: 'All', exact: true }).click()
      assert(await page.locator('.project-grid--listing .project-card').count() === 3, 'All filter missing core projects')

      await page.goto(root + '#/projects/ERP-Software-Demo', { waitUntil: 'domcontentloaded' })
      await page.locator('.erp-custom-banner').waitFor({ state: 'visible' })
      const capabilityGradients = await page.locator('.detail-capability').evaluateAll(elements =>
        elements.map(element => getComputedStyle(element).backgroundImage)
      )
      assert(capabilityGradients.length === 4 &&
        capabilityGradients[0] === leftGradient &&
        capabilityGradients[2] === leftGradient &&
        capabilityGradients[1] === rightGradient &&
        capabilityGradients[3] === rightGradient,
        'ERP capability cards do not match the mirrored service card colors')
      const erpActions = await page.locator('.detail-bottom-actions > *').evaluateAll(actions =>
        actions.map(action => ({
          width: action.getBoundingClientRect().width,
          height: action.getBoundingClientRect().height,
          top: action.getBoundingClientRect().top,
          left: action.getBoundingClientRect().left,
        }))
      )
      assert(erpActions.length === 2, 'ERP details need two consistently placed actions')
      assert(erpActions.every(item => Math.abs(item.height - 50) < 2),
        'ERP details buttons should be 50px high')
      if (viewport.width > 530) {
        assert(Math.abs(erpActions[0].width - erpActions[1].width) < 2 &&
          Math.abs(erpActions[0].top - erpActions[1].top) < 2,
          'ERP detail buttons should align in equally sized columns')
      } else {
        assert(Math.abs(erpActions[0].width - erpActions[1].width) < 2 &&
          erpActions[1].top > erpActions[0].top,
          'ERP detail buttons should be equal width and stacked on narrow screens')
      }

      assert((await page.locator('.erp-custom-banner h2').innerText()).includes('built to your specifications'),
        'ERP customization promise not highlighted')
      assert(await page.locator('.detail-back').isVisible(), 'Back to all projects link missing')
      await page.locator('.erp-custom-cta').click()
      await page.locator('[role="dialog"][data-email-dialog]').waitFor({ state: 'visible' })
      await page.keyboard.press('Escape')

      await page.goto(root + '#/projects/Steel-Quotes', { waitUntil: 'domcontentloaded' })
      await page.locator('h1.page-heading').waitFor({ state: 'visible' })
      assert(await page.locator('.detail-gallery-item').count() === 3, 'B2B prototype screenshot walkthrough missing')
      assert(await page.locator('.detail-bottom-actions > *').count() === 2,
        'The B2B case study should have the same two bottom action positions')
      const b2bSizes = await page.locator('.detail-bottom-actions > *').evaluateAll(actions =>
        actions.map(action => action.getBoundingClientRect().height)
      )
      assert(b2bSizes.every(height => Math.abs(height - 50) < 2),
        'B2B detail action heights should match the ERP')

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
