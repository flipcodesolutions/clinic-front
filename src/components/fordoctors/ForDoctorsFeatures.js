"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Custom PNG icon imports for Patient Records
import structuredVisitNotesImg from "@/assets/images/fordoctor/structured-visit-notes.png";
import qrPatientCardsImg from "@/assets/images/fordoctor/qr-patient-cards.png";
import attachmentsImg from "@/assets/images/fordoctor/attachments.png";
import allergyAlertFlagsImg from "@/assets/images/fordoctor/allergy-alert-flags.png";
import familyHistoryGraphImg from "@/assets/images/fordoctor/family-history-graph.png";
import chronicCareTrackingImg from "@/assets/images/fordoctor/chronic-care-tracking.png";

const categories = [
  { id: "records", name: "Patient Records", isActive: true },
  { id: "appointments", name: "Appointments & Visits", isActive: false },
  { id: "prescriptions", name: "Prescriptions & Pharmacy", isActive: false },
  { id: "clinical", name: "Clinical Tools", isActive: false },
  { id: "billing", name: "Billing & Business", isActive: false },
  { id: "experience", name: "Patient Experience", isActive: false },
  { id: "platform", name: "Platform & Integrations", isActive: false },
];

const patientRecordsFeatures = [
  {
    title: "Structured visit notes",
    description:
      "SOAP, free-form, or specialty-shaped templates. Auto-save every 2 seconds.",
    image: structuredVisitNotesImg,
  },
  {
    title: "QR patient cards",
    description: "Print or send. Tap to load any chart in under 200ms.",
    image: qrPatientCardsImg,
  },
  {
    title: "Attachments",
    description:
      "PDFs, X-rays, lab reports, voice memos. Encrypted, viewable inline.",
    image: attachmentsImg,
  },
  {
    title: "Allergy & alert flags",
    description: "Drug allergies and history conditions surface across every screen.",
    image: allergyAlertFlagsImg,
  },
  {
    title: "Family history graph",
    description: "Visual family tree with hereditary condition tagging.",
    image: familyHistoryGraphImg,
  },
  {
    title: "Chronic care tracking",
    description: "Long-term condition timelines with target band visuals.",
    image: chronicCareTrackingImg,
  },
];

export default function ForDoctorsFeatures() {
  const [activeTab, setActiveTab] = useState("records");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const yOffset = -90; // offset for sticky navbar
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset for navbar and tabs

      const sections = categories.map((cat) => document.getElementById(cat.id));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && scrollPosition >= (section.offsetTop || 0)) {
          setActiveTab(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="fordoctors-features-section pt-0 pb-5 px-0" style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* Navigation Tabs (Full Width Bar) */}
      <div className="fordoctors-tabs-bar-wrapper mb-5">
        <div className="container">
          <div className="fordoctors-tabs-container">
            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
              {categories.map((cat) => {
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabClick(cat.id)}
                    className={`btn d-flex align-items-center px-4 py-2 rounded-pill fordoctors-feature-pill ${
                      isActive
                        ? "fordoctors-feature-pill-active"
                        : "fordoctors-feature-pill-inactive"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Section 1: Patient Records */}
        <div id="records" className="fordoctors-static-section mb-5 pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Patient Records
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  Encrypted, structured, searchable — and built around how
                  doctors actually think, not how databases work.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {patientRecordsFeatures.map((feat, idx) => {
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
