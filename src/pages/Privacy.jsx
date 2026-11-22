import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import { site } from '../data/site'
import { EmailTrigger } from '../components/EmailContact'

export default function Privacy() {
  return (
    <main className="page-section shell privacy-page">
      <Link className="text-link detail-back" to="/">
        <ArrowLeft size={19} aria-hidden="true" /> Back to homepage
      </Link>
      <span className="eyebrow">PRIVACY & TRANSPARENCY</span>
      <h1 className="page-heading">Privacy <span className="gradient-text">notice.</span></h1>
      <p className="page-lede">
        A clear explanation of what happens when you visit this portfolio or
        contact me about a website, application, or custom software project.
      </p>
      <p className="privacy-updated">Last updated: 23 November 2026</p>
      <div className="privacy-content">
        <section>
          <h2>Who runs this website?</h2>
          <p>This is the independent professional portfolio of {site.name}, based in India.
            For privacy questions, corrections, or deletion requests, contact
            <EmailTrigger className="privacy-inline-email"> {site.email}</EmailTrigger>.</p>
        </section>
        <section>
          <h2>What information is collected?</h2>
          <p>You can browse the portfolio without creating an account. The portfolio
            does not include an enquiry form, payment checkout, or visitor-tracking
            analytics. If you choose to email me, I receive the contact details and
            information you send through your chosen email service.</p>
          <p>GitHub Pages, which hosts this website, and the network services involved
            in loading it may process ordinary technical information such as IP
            addresses and browser requests. The website also loads fonts from Google.</p>
        </section>
        <section>
          <h2>How information is used</h2>
          <p>Messages are used to respond to enquiries, discuss potential work, and
            maintain relevant business correspondence. I do not sell contact
            information or use it for automated advertising profiles. Please do not
            send passwords, payment card details, or other sensitive information
            by email.</p>
        </section>
        <section>
          <h2>External sites and project demos</h2>
          <p>Some links open websites, research manuscripts, social networks, or
            live applications run by other services. Those sites operate under
            their own privacy and security practices. ERP and B2B screenshots
            on this portfolio use fictional demo records, not real customers.</p>
        </section>
        <section>
          <h2>Retention and your choices</h2>
          <p>Business correspondence is kept only as long as reasonably needed for
            the conversation, a resulting engagement, or applicable obligations.
            You may request access, correction, or deletion of information you have
            emailed, subject to legal retention requirements. You may also stop
            contacting me at any time.</p>
        </section>
        <section>
          <h2>Updates</h2>
          <p>Website tools and applicable laws may change. This notice will be
            revised when the portfolio begins collecting additional information
            or introducing forms, analytics, accounts, or payments.</p>
        </section>
      </div>
      <Link to="/#contact" className="button button-primary privacy-contact">
        <Mail size={17} aria-hidden="true" /> Contact
      </Link>
    </main>
  )
}
