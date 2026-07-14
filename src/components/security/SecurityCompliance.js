import React from 'react';
import Image from 'next/image';
import encryptionIcon from '@/assets/images/fordoctor/encryption-everywhere.svg';
import '@/css/visitor.css';

export default function SecurityCompliance() {
  const standards = [
    "HIPAA",
    "GDPR",
    "DPDP 2023",
    "SOC 2 Type II",
    "ISO 27001",
    "HL7 FHIR R4",
    "PIPEDA",
    "POPIA",
    "HDS (FR)"
  ];

  return (
    <section className="compliance-section">
      <div className="container">
        <div className="compliance-badge">CERTIFICATIONS &amp; FRAMEWORKS</div>
        <h2 className="compliance-title">
          Compliant in the regions you<br className="d-none d-md-inline" /> operate.
        </h2>
        <p className="compliance-desc">
          eClinicPro is built to the highest healthcare privacy standards in every region we<br className="d-none d-md-inline" /> serve. Reports and DPAs available on demand.
        </p>

        <div className="compliance-badges-grid">
          {standards.map((std, idx) => (
            <div key={idx} className="compliance-capsule">
              <span className="compliance-icon-wrapper">
                <Image
                  src={encryptionIcon}
                  alt="shield"
                  width={16}
                  height={16}
                  className="compliance-shield-icon"
                />
              </span>
              <span className="compliance-text">{std}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
