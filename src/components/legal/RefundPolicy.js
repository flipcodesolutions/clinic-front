import React from "react";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <div className="legal-page-container">
      <div className="legal-badge">Legal</div>
      <h1 className="legal-title">Refund & Cancellation Policy</h1>
      <div className="legal-subtitle">Last updated: June 8, 2026</div>

      <p className="legal-text-p">
        This policy explains the free trial, billing and cancellation terms for the Medi Growth subscription, operated by <strong>Silver Webbuzz Pvt Ltd</strong>. It forms part of our <Link href="/terms" className="legal-link">Terms of Service</Link>.
      </p>

      <div className="legal-alert-box">
        <strong>The short version.</strong> Try Medi Growth free for 30 days — no card needed. We only charge if you choose to subscribe. Because we offer a full trial before any payment, paid subscriptions are generally non-refundable, except as set out below and as required by law.
      </div>

      <h2 className="legal-section-title">1. Free trial</h2>
      <p className="legal-text-p">
        New clinics get a 30-day free trial of the full product. No credit card is required to start. We don't auto-charge at the end of the trial — you decide whether to subscribe. If you don't subscribe, your account simply pauses; you can export your data (see our <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link>).
      </p>

      <h2 className="legal-section-title">2. Subscription & billing</h2>
      <ul className="legal-list">
        <li>Medi Growth is billed as a single annual plan (currently ₹16,000/year).</li>
        <li>Prices are exclusive of taxes; GST (currently 18%) is added at checkout.</li>
        <li>Payments are processed in INR through our payment gateway (Razorpay).</li>
        <li>Optional add-ons (e.g., Patient Connect, Clinic Network) are billed monthly and can be cancelled at any time.</li>
      </ul>

      <h2 className="legal-section-title">3. Refunds</h2>
      <p className="legal-text-p">
        Because a full 30-day trial is offered before any charge, fees are generally non-refundable. In particular, we do not provide refunds for:
      </p>
      <ul className="legal-list">
        <li>a change of mind after subscribing;</li>
        <li>not using the Services during the paid term;</li>
        <li>partial/unused periods after cancellation;</li>
        <li>monthly add-ons already started for the current month.</li>
      </ul>
      <p className="legal-text-p">
        We may, at our discretion, provide a full or pro-rata refund where:
      </p>
      <ul className="legal-list">
        <li>you were charged in error or charged twice;</li>
        <li>a material defect in the Services prevents core use and we are unable to resolve it within a reasonable time;</li>
        <li>a refund is required by applicable consumer law.</li>
      </ul>
      <p className="legal-text-p">
        Where a refund is approved, it is issued to the original payment method, in INR, within 14 business days, net of any applicable taxes or currency-conversion differences.
      </p>

      <h2 className="legal-section-title">4. How to cancel</h2>
      <p className="legal-text-p">
        You can cancel your subscription or an add-on at any time by emailing <a href="mailto:hello@medigrowth.com" className="legal-link">hello@medigrowth.com</a> from your registered email, or from your account billing settings where available. Cancellation stops future renewals; your access continues until the end of the period you've already paid for. Add-on cancellations take effect at the end of the current monthly cycle.
      </p>

      <h2 className="legal-section-title">5. Failed or disputed payments</h2>
      <p className="legal-text-p">
        If a renewal payment fails, we'll notify you and may pause paid features until payment is resolved. Payment disputes are handled in line with our payment gateway's processes and our <Link href="/terms" className="legal-link">Terms of Service</Link>.
      </p>

      <h2 className="legal-section-title">6. Changes to this policy</h2>
      <p className="legal-text-p">
        We may update this policy from time to time. Changes are posted here with a new "Last updated" date and apply to renewals and purchases made after they take effect.
      </p>

      <h2 className="legal-section-title">7. Contact</h2>
      <div className="legal-alert-box bg-light border-secondary">
        <strong>Silver Webbuzz Pvt Ltd (operating Medi Growth)</strong><br />
        Billing, cancellations & grievances: <a href="mailto:hello@medigrowth.com" className="legal-link">hello@medigrowth.com</a><br />
        Registered office: Ahmedabad, Gujarat, India
      </div>
    </div>
  );
}
