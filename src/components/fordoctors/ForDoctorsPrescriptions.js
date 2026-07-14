"use client";

import React from "react";
import Image from "next/image";

// Custom icon imports for Prescriptions & Pharmacy
import digitalPrescriptionsImg from "@/assets/images/fordoctor/prescriptionl.svg";
import whatsappRxDeliveryImg from "@/assets/images/fordoctor/whatsapp-rx-delivery.png";
import pharmacyInventoryImg from "@/assets/images/fordoctor/pharmacy-inventory.svg";
import controlledSubstanceLogImg from "@/assets/images/fordoctor/controlled-substance-log.svg";
import refillManagementImg from "@/assets/images/fordoctor/refill-management.svg";
import adherenceTrackingImg from "@/assets/images/fordoctor/adherence-tracking.png";

const prescriptionsPharmacyFeatures = [
  {
    title: "Digital prescriptions",
    description: "200,000-drug DB with dosage, interaction, and pediatric warnings.",
    image: digitalPrescriptionsImg
  },
  {
    title: "WhatsApp Rx delivery",
    description: "Signed PDF sent to patient before they leave the chair.",
    image: whatsappRxDeliveryImg
  },
  {
    title: "Pharmacy inventory",
    description: "Batch numbers, expiry alerts, low-stock auto-orders.",
    image: pharmacyInventoryImg
  },
  {
    title: "Controlled substance log",
    description: "Schedule-II compliant audit trail with DEA-ready exports.",
    image: controlledSubstanceLogImg
  },
  {
    title: "Refill management",
    description: "Patients request refills via WhatsApp. Approve with one tap.",
    image: refillManagementImg
  },
  {
    title: "Adherence tracking",
    description: "See who refilled, who didn't, and follow up automatically.",
    image: adherenceTrackingImg
  }
];

export default function ForDoctorsPrescriptions() {
  return (
    <section className="fordoctors-features-section py-5 border-top-0">
      <div className="container">
        
        {/* Section 3: Prescriptions & Pharmacy */}
        <div id="prescriptions" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Prescriptions & Pharmacy
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  From the moment you write a script to the moment your patient picks it up — fully tracked.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {prescriptionsPharmacyFeatures.map((feat, idx) => {
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
