"use client";

import React, { useState } from "react";
import "@/css/visitor.css";

const faqs = [
  {
    q: "Where is my data stored?",
    a: "Your data is stored in the region you choose at signup — US (AWS us-east-1), EU (AWS eu-west-1), India (AWS ap-south-1), UAE (AWS me-south-1), or Singapore (AWS ap-southeast-1). It never leaves that region — not for backups, analytics, or support access.",
  },
  {
    q: "Who can see my patients' data?",
    a: "Only you and the staff you explicitly grant access to. eClinicPro engineers cannot access your patient records. All production access by our team is mediated through a zero-trust broker, requires manager approval, is time-limited, and is fully logged.",
  },
  {
    q: "What if a patient asks for their data to be deleted?",
    a: "You can delete a patient record at any time from the dashboard. Upon account deletion, all patient data is permanently erased within 30 days and a deletion certificate is provided. We comply fully with GDPR Article 17, HIPAA, and DPDP erasure rights.",
  },
  {
    q: "How does export work if I want to leave?",
    a: "You can export all your data — patient records, visit notes, prescriptions, billing history — as portable JSON, CSV, or HL7 FHIR at any time, for free, from your account settings. No lock-in, no fees, no waiting.",
  },
  {
    q: "Do you train AI on my data?",
    a: "No. Your patient data is never used to train any AI or machine learning model — ours or anyone else's. Any AI features inside eClinicPro run on your data in isolation and do not share information across clinics.",
  },
  {
    q: "Can I get a signed Business Associate Agreement (BAA) or DPA?",
    a: "Yes. A BAA (for HIPAA) and a DPA (for GDPR/DPDP) are available instantly from your dashboard — auto-countersigned, no NDA or sales call required. Enterprise customers can also request custom DPAs.",
  },
];

export default function SecurityFAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section className="sfaq-section">
      <div className="container">
        <div className="sfaq-header">
          <div className="sfaq-badge">SECURITY FAQ</div>
          <h2 className="sfaq-title">
            The hard questions, answered<br /> honestly.
          </h2>
        </div>

        <div className="sfaq-list">
          {faqs.map((item, idx) => (
            <div key={idx} className={`sfaq-item${openIdx === idx ? " sfaq-item--open" : ""}`}>
              <button
                className="sfaq-question"
                onClick={() => toggle(idx)}
                aria-expanded={openIdx === idx}
              >
                <span>{item.q}</span>
                <span className="sfaq-icon">{openIdx === idx ? "×" : "+"}</span>
              </button>
              {openIdx === idx && (
                <div className="sfaq-answer">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
