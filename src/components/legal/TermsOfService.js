import React from "react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="legal-page-container">
      <div className="legal-badge">Legal</div>
      <h1 className="legal-title">Terms of Service</h1>
      <div className="legal-subtitle">Last updated: June 8, 2026</div>

      <p className="legal-text-p">
        These Terms are a binding agreement between you and <strong>Silver Webbuzz Pvt Ltd</strong>, which operates the Medi Growth brand and platform ("Medi Growth", "we", "us"). By accessing or using <Link href="/" className="legal-link">medigrowth.com</Link>, the clinic platform, the doctor directory, or booking a doctor (the "Services"), you agree to these Terms.
      </p>

      <h2 className="legal-section-title">1. Acceptance</h2>
      <p className="legal-text-p">
        By using the Services you confirm you have read, understood and accept these Terms, our <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link> and our <Link href="/refund-policy" className="legal-link">Refund & Cancellation Policy</Link>, which are incorporated by reference. This document is an electronic record under the Information Technology Act, 2000.
      </p>

      <h2 className="legal-section-title">2. Eligibility</h2>
      <p className="legal-text-p">
        You must be capable of forming a legally binding contract under the Indian Contract Act, 1872. Clinic accounts must be opened by a registered medical practitioner or an authorised representative of a clinic. Minors may not register; a minor's records may only be stored by a clinic with parent/guardian consent.
      </p>

      <h2 className="legal-section-title">3. The Services</h2>
      <p className="legal-text-p">
        Medi Growth provides, on a subscription basis:
      </p>
      <ul className="legal-list">
        <li>A clinic operating system — patient records, appointments and walk-in queue, prescriptions, vitals and diagnoses, billing & GST invoicing, reports and analytics;</li>
        <li>Specialty-aware clinical forms, teleconsultation, and optional WhatsApp/SMS messaging;</li>
        <li>A public doctor directory on <Link href="/" className="legal-link">medigrowth.com</Link> and an online appointment-booking layer connecting patients with clinics.</li>
      </ul>
      <p className="legal-text-p">
        We may add, modify or discontinue features at our discretion. We are a technology provider: we do not practise medicine and are not a party to the clinician–patient relationship.
      </p>

      <h2 className="legal-section-title">4. Accounts & security</h2>
      <p className="legal-text-p">
        You are responsible for the accuracy of the information you provide, for keeping your login credentials confidential, and for all activity under your account. Notify us promptly of any unauthorised use. You are responsible for assigning staff roles and permissions appropriately within your clinic.
      </p>

      <h2 className="legal-section-title">5. Clinic responsibilities & data</h2>
      <ul className="legal-list">
        <li>The clinic is the data fiduciary/controller of its patient data; Medi Growth processes it on the clinic's instructions (see the <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link>).</li>
        <li>The clinic is responsible for the accuracy, legality and consent basis of the patient data it enters, and for obtaining patient consent where required (including for messaging and teleconsultation).</li>
        <li>The clinic must comply with all applicable medical, data-protection and professional-conduct laws, and is responsible for clinical decisions and the content of prescriptions and records.</li>
        <li>You retain ownership of your data and can export it at any time.</li>
      </ul>

      <h2 className="legal-section-title">6. Acceptable use</h2>
      <p className="legal-text-p">
        You agree not to:
      </p>
      <ul className="legal-list">
        <li>upload false, misleading or unlawful information, or infringe anyone's rights;</li>
        <li>access the Services to build a competing product or to benchmark for a competitor;</li>
        <li>reverse engineer, decompile, scrape, or attempt to gain unauthorised access;</li>
        <li>transmit malware, or disrupt or overload the Services;</li>
        <li>use the Services for any illegal, fraudulent or harmful purpose.</li>
      </ul>
      <p className="legal-text-p">
        We may suspend or terminate access for violations of this section.
      </p>

      <h2 className="legal-section-title">7. Subscription, fees & taxes</h2>
      <p className="legal-text-p">
        Medi Growth is offered as a single annual plan (currently ₹16,000/year), plus optional add-ons, as described on the pricing section. New clinics start with a 30-day free trial; no card is required to begin the trial. Fees are exclusive of taxes — GST (currently 18%) is added at checkout. Payments are processed by our payment gateway. Refunds and cancellations are governed by our <Link href="/refund-policy" className="legal-link">Refund & Cancellation Policy</Link>.
      </p>

      <h2 className="legal-section-title">8. Intellectual property</h2>
      <p className="legal-text-p">
        The Services, including software, design, text, graphics and logos, are owned by Silver Webbuzz Pvt Ltd or its licensors and are protected by law. We grant you a limited, non-exclusive, non-transferable, revocable right to use the Services for your clinic during your subscription. You may not copy, resell, sublicense or commercially exploit the Services except as expressly permitted.
      </p>

      <h2 className="legal-section-title">9. Directory & booking</h2>
      <p className="legal-text-p">
        Doctor listings in the directory are provided for discovery. Appointment booking is a facilitation between a patient and a clinic; Medi Growth is not responsible for a clinic's availability, fees, conduct, advice or the outcome of any consultation. Fees and cancellation rules for a consultation are set by the clinic.
      </p>

      <h2 className="legal-section-title">10. Medical disclaimer</h2>
      <p className="legal-text-p">
        Medi Growth is software for managing a clinic and for connecting patients with clinicians. Any content, assessment or tool in the Services is for informational and workflow purposes only and is not medical advice and not a substitute for professional diagnosis or treatment. The treating clinician is solely responsible for clinical decisions. In an emergency, contact local emergency services.
      </p>

      <h2 className="legal-section-title">11. Third-party services</h2>
      <p className="legal-text-p">
        The Services integrate third parties (e.g., payment, messaging and hosting providers). Your use of those is also subject to their terms; we are not responsible for their acts or omissions beyond our reasonable control.
      </p>

      <h2 className="legal-section-title">12. Warranties & disclaimers</h2>
      <p className="legal-text-p">
        The Services are provided on an "as is" and "as available" basis. To the maximum extent permitted by law, we disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be uninterrupted or error-free, and we are not liable for downtime or delay caused by events beyond our reasonable control (including cyber-attacks, acts of God, government action, epidemics/pandemics, or denial-of-service attacks).
      </p>

      <h2 className="legal-section-title">13. Limitation of liability</h2>
      <p className="legal-text-p">
        To the maximum extent permitted by law, Medi Growth and Silver Webbuzz Pvt Ltd will not be liable for any indirect, incidental, special, punitive or consequential damages, or for loss of profits, business, goodwill or data. Our total aggregate liability arising out of or relating to the Services will not exceed the fees you paid to us for the Services in the 12 months preceding the event giving rise to the claim.
      </p>

      <h2 className="legal-section-title">14. Indemnity</h2>
      <p className="legal-text-p">
        You agree to indemnify and hold harmless Medi Growth, Silver Webbuzz Pvt Ltd and its officers, employees and partners from claims, losses and expenses (including reasonable legal fees) arising from your use of the Services, the data you enter, your violation of these Terms, or your violation of any law or third-party right. This survives termination.
      </p>

      <h2 className="legal-section-title">15. Term & termination</h2>
      <p className="legal-text-p">
        You may cancel as described in the <Link href="/refund-policy" className="legal-link">Refund & Cancellation Policy</Link>. We may suspend or terminate access for breach of these Terms, non-payment, or unlawful/abusive activity. On termination you may export your data for a reasonable period, after which it is deleted per our <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link> and applicable law.
      </p>

      <h2 className="legal-section-title">16. Governing law & dispute resolution</h2>
      <p className="legal-text-p">
        These Terms are governed by the laws of India. Subject to applicable law, the courts at Ahmedabad, Gujarat, India will have exclusive jurisdiction over any dispute arising out of or relating to the Services or these Terms.
      </p>

      <h2 className="legal-section-title">17. Changes to these Terms</h2>
      <p className="legal-text-p">
        We may update these Terms from time to time. Material changes will be posted here with a new "Last updated" date; continued use after they take effect means you accept them.
      </p>

      <h2 className="legal-section-title">18. Contact</h2>
      <div className="legal-alert-box bg-light border-secondary">
        <strong>Silver Webbuzz Pvt Ltd (operating Medi Growth)</strong><br />
        Support & grievances: <a href="mailto:hello@medigrowth.com" className="legal-link">hello@medigrowth.com</a><br />
        Registered office: Ahmedabad, Gujarat, India
      </div>
    </div>
  );
}
