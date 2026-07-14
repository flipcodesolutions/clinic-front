"use client";

import React from "react";
import Image from "next/image";

// Custom icon imports for Platform & Integrations
import indiaDPDPReadyImg from "@/assets/images/fordoctor/india-DPDP-ready.svg";
import fastAndReliableImg from "@/assets/images/fordoctor/fast-and-reliable.svg";
import multiLanguageImg from "@/assets/images/fordoctor/multi-language.png";
import easyMigrationImg from "@/assets/images/fordoctor/easy-migration.svg";
import apiAndWebhooksImg from "@/assets/images/fordoctor/api-and-webhooks.png";
import rolesAndAuditLogsImg from "@/assets/images/fordoctor/roles-and-audit-logs.png";

const platformIntegrationsFeatures = [
  {
    title: "India DPDP ready",
    description: "Encrypted at rest & in transit, per-clinic isolation, real audit logs.",
    image: indiaDPDPReadyImg
  },
  {
    title: "Fast & reliable",
    description: "Built for Indian clinics and networks — quick even on patchy connections.",
    image: fastAndReliableImg
  },
  {
    title: "Multi-language",
    description: "Interface and prescriptions in English, Hindi, Gujarati and more.",
    image: multiLanguageImg
  },
  {
    title: "Easy migration",
    description: "Import from Practo, spreadsheets, or your existing system.",
    image: easyMigrationImg
  },
  {
    title: "API & webhooks",
    description: "Full REST API. Webhook on every meaningful event.",
    image: apiAndWebhooksImg
  },
  {
    title: "Roles & audit logs",
    description: "Granular staff roles and a signed audit trail on every record.",
    image: rolesAndAuditLogsImg
  }
];

export default function ForDoctorsPlatform() {
  return (
    <section className="fordoctors-features-section py-5 border-top-0">
      <div className="container">
        
        {/* Section 7: Platform & Integrations */}
        <div id="platform" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Platform & Integrations
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  Everything underneath the surface — engineered for clinics, not enterprises.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {platformIntegrationsFeatures.map((feat, idx) => {
              return (
                <div key={idx} className="col">
                  <div className="card fordoctors-feature-card h-100 border-0 shadow-sm p-4">
                    <div className="card-body p-0 d-flex flex-column h-100">
                      
                      <div className="fordoctors-feature-card-icon-box mb-4 d-flex align-items-center justify-content-center">
                        <Image 
                          src={feat.image} 
                          alt={feat.title} 
                          className="fordoctors-png-icon" 
                          width={24}
                          height={24}
                        />
                      </div>

                      <h5 className="fw-bold text-dark mb-2 fordoctors-feature-card-title">
                        {feat.title}
                      </h5>

                      <p className="text-muted small mb-0 fordoctors-feature-card-desc flex-grow-1">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
