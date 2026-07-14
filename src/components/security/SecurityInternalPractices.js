import React from "react";
import "@/css/visitor.css";

const practices = [
  {
    title: "Background checks for every employee",
    desc: "Every Clinic engineer with production access undergoes a criminal background check and signs an enforceable confidentiality agreement.",
  },
  {
    title: "Zero trust internal network",
    desc: "No long-lived credentials. Production access is mediated through a session-based broker with mandatory MFA, full session recording, and per-action approval for sensitive operations.",
  },
  {
    title: "Quarterly disaster recovery drills",
    desc: "Every quarter we simulate a full region failure, restore from backups, and measure RTO/RPO. The results are published to enterprise customers.",
  },
  {
    title: "Annual SOC 2 Type II audit",
    desc: "Independent audit covering security, availability, confidentiality, and privacy. Reports available under NDA.",
  },
  {
    title: "Subprocessor transparency",
    desc: "A public list of every vendor that touches customer data. We notify in advance of any change, with a 30-day window to object.",
  },
  {
    title: "Phishing resistant MFA mandatory",
    desc: "WebAuthn / passkeys for all employees. SMS-only MFA is not permitted internally and not recommended for clinics.",
  },
];

export default function SecurityInternalPractices() {
  return (
    <section className="sip-section">
      <div className="container">
        <div className="sip-header">
          <div className="sip-badge">INTERNAL PRACTICES</div>
          <h2 className="sip-title">What we do behind the scenes.</h2>
          <p className="sip-subtitle">
            Security isn&apos;t a feature — it&apos;s the daily operating system. Here&apos;s how the team works.
          </p>
        </div>

        <div className="sip-grid">
          {practices.map((item, idx) => (
            <div key={idx} className="sip-card">
              <div className="sip-card-header">
                <span className="sip-check-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#047857"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="sip-card-title">{item.title}</h3>
              </div>
              <p className="sip-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
