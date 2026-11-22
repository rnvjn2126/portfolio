import { chromium } from 'playwright'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { mkdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// Screenshots are captured only from real, rendered project pages.
// Sample resume data is explicitly fictional; no real personal details are uploaded.
const directory = 'public/images/screenshots'
await mkdir(directory, { recursive: true })

async function fictionalResume() {
  const pdf = await PDFDocument.create()
  pdf.setTitle('Fictional candidate - portfolio demonstration only')
  pdf.setSubject('Synthetic example resume for software demonstration')
  const page = pdf.addPage([612, 792])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const dark = rgb(.14,.22,.18), green = rgb(.29,.40,.27), grey = rgb(.31,.35,.33)
  let y = 744
  function line(text, opts = {}) {
    page.drawText(text, { x: 48, y, size: opts.size || 11, font: opts.bold ? bold : regular, color: opts.green ? green : grey })
    y -= opts.spacing || 20
  }
  line('MAYA BENNETT', { size: 23, bold: true, spacing: 30 })
  line('Fictional demo candidate | maya.bennett@example.com | 202-555-0142', { size: 10, spacing: 27 })
  line('PROFESSIONAL SUMMARY', { bold: true, green: true, spacing: 22 })
  line('Software developer with experience building accessible React applications,', { spacing: 17 })
  line('Python APIs, data dashboards, and cloud-based services.', { spacing: 25 })
  line('TECHNICAL SKILLS', { bold: true, green: true, spacing: 21 })
  line('Python, JavaScript, React, TypeScript, SQL, Git, Docker, AWS, HTML, CSS', { spacing: 27 })
  line('EXPERIENCE', { bold: true, green: true, spacing: 22 })
  line('Software Developer | Example Analytics Studio | 2023 - 2026', { bold: true, spacing: 19 })
  line('- Developed reusable React components for data visualization dashboards.', { spacing: 18 })
  line('- Built Python services and SQL queries for reliable reporting workflows.', { spacing: 18 })
  line('- Improved application testing, accessibility, and response times.', { spacing: 25 })
  line('PROJECTS', { bold: true, green: true, spacing: 22 })
  line('Job Insights Dashboard | React, Python, SQL', { bold: true, spacing: 18 })
  line('- Built role-search interfaces and interactive job market visualizations.', { spacing: 21 })
  line('Portfolio Toolkit | JavaScript, HTML, CSS, Git', { bold: true, spacing: 18 })
  line('- Created reusable responsive layouts and accessible components.', { spacing: 25 })
  line('EDUCATION', { bold: true, green: true, spacing: 22 })
  line('B.S. Computer Science | Example University | 2023', { spacing: 30 })
  line('SYNTHETIC SAMPLE - created solely to demonstrate the resume analyzer.', { size: 9, spacing: 16 })
  return Buffer.from(await pdf.save())
}

const resume = await fictionalResume()
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1600, height: 1020 },
  deviceScaleFactor: 1.5,
  colorScheme: 'light',
  reducedMotion: 'reduce',
})
const sites = [
  { name: 'AJ Overseas', file: 'aj-overseas.png', urls: ['https://aj-overseas.in', 'https://www.aj-overseas.in'] },
  { name: 'Career AI Pro', file: 'career-ai-pro.png', urls: ['https://resumeproject123.streamlit.app/~/+/', 'https://resumeproject123.streamlit.app'] },
]
try {
  for (const site of sites) {
    let captured = false
    for (const url of site.urls) {
      const page = await context.newPage()
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 70000 })
        if (response && response.status() >= 400) throw new Error('HTTP ' + response.status())
        if (site.name === 'Career AI Pro') {
          let ready = false
          for (let attempt = 0; attempt < 22; attempt++) {
            const wake = page.getByRole('button', { name: /get this app back up|wake.*app|yes.*back up/i }).first()
            if (await wake.count()) await wake.click({timeout:8000}).catch(() => {})
            const fileInputs = await page.locator('input[type=file]').count()
            const uploadHeading = await page.getByText('Upload Your Resume', { exact:false }).count()
            if (fileInputs && uploadHeading) { ready = true; break }
            if ([0,5,12,21].includes(attempt)) {
              const body = await page.locator('body').innerText().catch(() => '')
              console.log('Career AI loading diagnostic:',JSON.stringify({
                attempt:attempt+1, url:page.url(),
                title:await page.title().catch(()=>''),
                body:body.slice(0,380),fileInputs,
                frames:page.frames().map(f=>f.url()).slice(0,4)
              }))
            }
            await page.waitForTimeout(8000)
          }
          if (!ready) throw new Error('Live app did not expose its actual PDF-upload interface')

          console.log('Uploading clearly fictional demo PDF to Career AI Pro')
          await page.locator('input[type=file]').first().setInputFiles({
            name:'fictional_demo_resume.pdf',
            mimeType:'application/pdf',
            buffer: resume,
          })
          const analyze = page.getByRole('button',{name:/Analyze Complete Resume/i}).first()
          await analyze.waitFor({state:'visible',timeout:25000})
          await analyze.click({timeout:25000})
          console.log('Waiting for real analysis output')
          await page.locator('.kpi-card').waitFor({state:'visible',timeout:160000})
          await page.getByText('Top Job Recommendations',{exact:false}).waitFor({state:'visible',timeout:35000})
          await page.waitForTimeout(4500)
          await page.locator('.kpi-card').scrollIntoViewIfNeeded()
          // Position the actual result card near the top of the screenshot.
          await page.locator('.kpi-card').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}))
          await page.waitForTimeout(700)
          const body = await page.locator('body').innerText()
          console.log('Analysis output visible:',JSON.stringify({result:body.slice(-1400), hasKpi:await page.locator('.kpi-card').count()}))
        } else {
          await page.waitForTimeout(4500)
          const text=await page.locator('body').innerText()
          if(text.trim().length<90) throw new Error('Business website content not ready')
        }
        const output = join(directory, site.file)
        await page.screenshot({ path:output, fullPage:false, animations:'disabled' })
        const size=(await stat(output)).size
        if(size < 20000) throw new Error('Captured image too small to represent project')
        console.log('Captured genuine project screenshot:', site.name, output, size)
        captured = true
        break
      } catch (error) {
        console.warn('Screenshot unavailable:',site.name,url,String(error))
      } finally {
        await page.close()
      }
    }
    if (!captured) console.warn('Preserving existing project artwork for',site.name)
  }
} finally {
  await browser.close()
}
