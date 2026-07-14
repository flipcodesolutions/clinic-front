import React from "react";
import "@/css/visitor.css";

const documents = [
  {
    title: "Business Associate Agreement (HIPAA)",
    meta: "Auto-countersigned PDF · 12 pages",
  },
  {
    title: "Data Processing Agreement (GDPR)",
    meta: "Standard Contractual Clauses included · 18 pages",
  },
  {
    title: "India DPDP Processor Agreement",
    meta: "Section 8 compliant · 9 pages",
  },
  {
    title: "Subprocessor List",
    meta: "Live — 14 vendors, last updated Apr 2026",
  },
  {
    title: "SOC 2 Type II Report",
    meta: "Q1 2026 · under NDA, 1-click request",
  },
  {
    title: "Penetration Test Summary",
    meta: "Q1 2026 · public summary",
  },
];

function PdfIcon() {
  return (
    <svg width="32" height="36" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="40" rx="4" fill="#FEE2E2" />
      <path d="M6 8h13l7 7v19a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2z" fill="#FCA5A5" />
      <path d="M19 8l7 7h-5a2 2 0 01-2-2V8z" fill="#EF4444" />
      <text x="16" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill="#991B1B" fontFamily="sans-serif">PDF</text>
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="sdoc-arrow">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SecurityDocuments() {
  return (
    <section className="sdoc-section">
      <div className="container">
        <div className="sdoc-header">
          <div className="sdoc-badge">DOCUMENTS YOU CAN DOWNLOAD</div>
          <h2 className="sdoc-title">No NDAs. No sales calls.</h2>
          <p className="sdoc-subtitle">
            The documents your compliance officer wants — available instantly from your<br />
            dashboard.
          </p>
        </div>

        <div className="sdoc-grid">
          {documents.map((doc, idx) => (
            <div key={idx} className="sdoc-card">
              <div className="sdoc-card-left">
                <div className="sdoc-icon-wrap">
                  <PdfIcon />
                </div>
                <div className="sdoc-card-text">
                  <div className="sdoc-card-title">{doc.title}</div>
                  <div className="sdoc-card-meta">{doc.meta}</div>
                </div>
              </div>
              <ArrowIcon />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
