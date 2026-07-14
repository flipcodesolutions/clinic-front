import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page-container">
      <div className="legal-badge">Legal</div>
      <h1 className="legal-title">Privacy Policy</h1>
      <div className="legal-subtitle">Last updated: June 8, 2026</div>

      <p className="legal-text-p">
        Medi Growth is a brand operated by <strong>Silver Webbuzz Pvt Ltd</strong> ("Medi Growth", "we", "us", "our"). This policy explains what information we collect through <Link href="/" className="legal-link">medigrowth.com</Link> and the Medi Growth clinic platform (the "Services"), how we use it, and the choices and rights you have.
      </p>

      <div className="legal-alert-box">
        <strong>Two roles, briefly.</strong> When a clinic uses Medi Growth to manage its patients, <em>the clinic</em> is the data fiduciary/controller of those patient records and Medi Growth acts as its <strong>data processor</strong> — we process patient data only on the clinic's instructions. For our public doctor directory, your account and our billing data, Medi Growth is the controller. This policy covers both.
      </div>

      <h2 className="legal-section-title">1. Scope & consent</h2>
      <p className="legal-text-p">
        By creating an account, browsing the directory, booking an appointment, or otherwise using the Services, you agree to this Privacy Policy and, where required, provide your consent to the processing described here. If you do not agree, please do not use the Services. Sensitive personal data (including health information) is collected and processed only with the relevant consent or a lawful basis.
      </p>

      <h2 className="legal-section-title">2. Information we collect</h2>
      
      <h3 className="legal-subsection-title">2.1 Information you provide</h3>
      <ul className="legal-list">
        <li><strong>Account & clinic data:</strong> name, clinic name, email, phone, password (stored only as a hash), specialty, registration/qualification details, and clinic address.</li>
        <li><strong>Billing data:</strong> billing name, GSTIN, and payment confirmations. Card/UPI details are handled by our payment gateway (Razorpay) and are not stored on our servers.</li>
        <li><strong>Patient & health data (entered by clinics):</strong> patient demographics, contact details, visit notes, vitals, diagnoses, prescriptions, lab/test results, invoices and uploaded documents. This is entered and controlled by the clinic.</li>
        <li><strong>Directory & booking data:</strong> doctor profile details and, when a patient books, the patient's name, phone and reason for visit.</li>
        <li><strong>Communications:</strong> support requests, demo enquiries and feedback you send us.</li>
      </ul>

      <h3 className="legal-subsection-title">2.2 Information collected automatically</h3>
      <ul className="legal-list">
        <li><strong>Technical data:</strong> IP address, device and browser type, and pages viewed, used for security, diagnostics and analytics.</li>
        <li><strong>Cookies:</strong> see Section 8.</li>
      </ul>
      <p className="legal-text-p">
        We do not knowingly collect more than is necessary, and we exclude information that is publicly available or that you are not required to provide.
      </p>

      <h2 className="legal-section-title">3. How we use information</h2>
      <ul className="legal-list">
        <li>To provide, operate, secure and improve the Services;</li>
        <li>To let clinics manage patients, appointments, prescriptions and billing;</li>
        <li>To power the public directory and appointment booking;</li>
        <li>To process subscriptions, send invoices and apply GST;</li>
        <li>To send service, security and (with consent) product communications;</li>
        <li>To detect, prevent and investigate fraud, abuse and security incidents;</li>
        <li>To comply with legal, tax and healthcare record-keeping obligations.</li>
      </ul>
      <p className="legal-text-p">
        We do not sell personal data, and we do not use patient data to train AI models — ours or anyone else's.
      </p>

      <h2 className="legal-section-title">4. How we share information</h2>
      <p className="legal-text-p">
        We share personal data only as needed and with appropriate safeguards:
      </p>
      <ul className="legal-list">
        <li><strong>With the clinic:</strong> patient data is accessible to the authorised staff of the clinic that created it, based on their role-based permissions.</li>
        <li><strong>With sub-processors:</strong> vetted vendors who help us run the Services (hosting, messaging via Meta WhatsApp / MSG91, email, and payments via Razorpay), under contract and only on a need-to-know basis.</li>
        <li><strong>For legal reasons:</strong> where required by law, court order, or a valid request from a competent authority, or to protect rights, safety and the integrity of the Services.</li>
        <li><strong>Business transfers:</strong> in connection with a merger, acquisition or reorganisation, subject to this policy.</li>
      </ul>

      <h2 className="legal-section-title">5. Data storage, residency & security</h2>
      <p className="legal-text-p">
        You choose your data residency region at signup (India, EU, US, UAE or Singapore) and your data — including backups and analytics — stays in that region. We protect data with encryption in transit (TLS) and at rest (AES-256), role-based access controls, audit logging, and regular security testing. No system is perfectly secure, and we cannot guarantee absolute security against hacking, phishing or unauthorised access beyond our reasonable control. Please keep your password confidential and log out of shared devices.
      </p>

      <h2 className="legal-section-title">6. Data retention</h2>
      <p className="legal-text-p">
        We retain personal data only for as long as necessary for the purposes above, or as required by applicable law (including medical record-retention rules). When no longer needed, data is deleted or anonymised securely. Clinics control their patient data and can export or delete it; on account closure we erase production data within 30 days and from backups within the backup-rotation window, except where law requires retention.
      </p>

      <h2 className="legal-section-title">7. Your rights</h2>
      <p className="legal-text-p">
        Subject to applicable law (including the Digital Personal Data Protection Act, 2023 in India, and GDPR where it applies), you may:
      </p>
      <ul className="legal-list">
        <li>access, correct, or update your personal data;</li>
        <li>request deletion / erasure of your personal data;</li>
        <li>withdraw consent (this won't affect prior lawful processing);</li>
        <li>request a portable copy of your data;</li>
        <li>nominate, where DPDP allows, another person to exercise your rights; and</li>
        <li>raise a grievance with our Grievance Officer (Section 11).</li>
      </ul>
      <p className="legal-text-p">
        If you are a patient whose data sits with a clinic, please contact that clinic (the fiduciary) first; we will assist the clinic in honouring your request. To exercise rights over data we control, email <a href="mailto:hello@medigrowth.com" className="legal-link">hello@medigrowth.com</a> with the subject "Data request" and your registered email/phone. We respond within 30 days.
      </p>

      <h2 className="legal-section-title">8. Cookies</h2>
      <p className="legal-text-p">
        We use cookies and similar technologies to keep you signed in, remember preferences, keep the Services secure, and understand usage. You can control cookies through your browser settings; disabling some cookies may affect functionality. We do not control third-party cookies that those third parties may set.
      </p>

      <h2 className="legal-section-title">9. Children</h2>
      <p className="legal-text-p">
        The Services are intended for clinics and adults. We do not knowingly create accounts for minors. Children's health records may be stored by a clinic as part of treatment, under the clinic's responsibility and the consent of a parent or guardian.
      </p>

      <h2 className="legal-section-title">10. Changes to this policy</h2>
      <p className="legal-text-p">
        We may update this policy from time to time. Material changes will be posted here with a new "Last updated" date. Your continued use of the Services after changes take effect means you accept the updated policy.
      </p>

      <h2 className="legal-section-title" id="grievance">11. Grievance Officer & contact</h2>
      <p className="legal-text-p">
        In accordance with the Information Technology Act, 2000, the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the DPDP Act, 2023, the contact details of our Grievance Officer are:
      </p>
      <div className="legal-alert-box bg-light border-secondary">
        <strong>Grievance Officer — Medi Growth (Silver Webbuzz Pvt Ltd)</strong><br />
        Email (privacy, grievances & support): <a href="mailto:hello@medigrowth.com" className="legal-link">hello@medigrowth.com</a><br />
        Registered office: Ahmedabad, Gujarat, India
      </div>
      <p className="legal-text-p">
        We acknowledge grievances within 24 hours and aim to resolve them within 15 days as required under applicable Indian law.
      </p>

      <p className="legal-text-p mt-4 text-secondary small">
        See also our <Link href="/terms" className="legal-link">Terms of Service</Link> and <Link href="/refund-policy" className="legal-link">Refund & Cancellation Policy</Link>.
      </p>
    </div>
  );
}
