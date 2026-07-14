"use client";

import React from "react";
import Image from "next/image";

import encryptionImg from "@/assets/images/fordoctor/encryption-everywhere.svg";
import compliantImg from "@/assets/images/fordoctor/compliant-by-default.png";
import yourDataImg from "@/assets/images/fordoctor/your-own-data.png";
import granularImg from "@/assets/images/fordoctor/granular-access-control.png";
import auditImg from "@/assets/images/fordoctor/audit.png";
import dataResidencyImg from "@/assets/images/fordoctor/data-residency.png";
import resilientImg from "@/assets/images/fordoctor/resilient-infrastructure.svg";
import independentlyImg from "@/assets/images/fordoctor/independently-tested.png";
import vendorImg from "@/assets/images/fordoctor/vendor-sub-processor-list.png";

const pillars = [
  {
    image: encryptionImg,
    isSvg: true,
    title: "Encryption everywhere",
    description:
      "AES-256 at rest. TLS 1.3 in transit. Per-clinic keys, rotated quarterly. Field-level encryption for the most sensitive data (allergies, diagnoses, mental health notes).",
  },
  {
    image: compliantImg,
    isSvg: false,
    title: "Compliant by default",
    description:
      "HIPAA (US), GDPR (EU/UK), DPDP (India), PIPEDA (Canada), POPIA (South Africa), HDS (France). Region-aware data residency.",
  },
  {
    image: yourDataImg,
    isSvg: false,
    title: "You own your data",
    description:
      "Export everything as portable JSON, CSV, or HL7 FHIR — anytime, free. Delete your account and we erase within 30 days, audit-logged.",
  },
  {
    image: granularImg,
    isSvg: false,
    title: "Granular access control",
    description:
      "Roles for doctor, nurse, receptionist, accountant, owner. Per-action permissions. Time-limited access for locums.",
  },
  {
    image: auditImg,
    isSvg: false,
    title: "Audit trail forever",
    description:
      "Every read, write, and export is logged with user, IP, device, and timestamp. Tamper-evident, exportable on demand.",
  },
  {
    image: dataResidencyImg,
    isSvg: false,
    title: "Data residency you choose",
    description:
      "Pick where your data lives: US, EU, India, UAE, Singapore. It never leaves that region — not for backups, not for analytics.",
  },
  {
    image: resilientImg,
    isSvg: true,
    title: "Resilient infrastructure",
    description:
      "99.95% uptime SLA (Hospital plan). Three-region failover. Backups every 15 minutes, restorable to any point in the last 90 days.",
  },
  {
    image: independentlyImg,
    isSvg: false,
    title: "Independently tested",
    description:
      "Quarterly third-party penetration tests. Annual SOC 2 Type II audit. Public bug bounty up to $25,000 per critical finding.",
  },
  {
    image: vendorImg,
    isSvg: false,
    title: "Vendor & sub-processor list",
    description:
      "A short, public list of every vendor that touches your data. We notify you 30 days before any change.",
  },
];

export default function SecurityPillars() {
  return (
    <section className="security-pillars-section">
      <div className="container">
        <div className="security-pillars-header">
          <div className="security-pillars-badge">NINE PILLARS OF TRUST</div>
          <h2 className="security-pillars-title">
            How we protect every record.
          </h2>
        </div>

        <div className="security-pillars-grid">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="security-pillar-card">
              <div className="security-pillar-icon-box">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  width={28}
                  height={28}
                  className={pillar.isSvg ? "security-pillar-icon security-pillar-icon-svg" : "security-pillar-icon"}
                />
              </div>
              <h3 className="security-pillar-card-title">{pillar.title}</h3>
              <p className="security-pillar-card-desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


