"use client";

import React from "react";
import Image from "next/image";

// Custom icon imports for Billing & Business
import invoicingImg from "@/assets/images/fordoctor/invoicing.png";
import paymentsImg from "@/assets/images/fordoctor/payments.png";
import revenueCohortReportsImg from "@/assets/images/fordoctor/revenue-cohort-reports.png";
import insuranceClaimsImg from "@/assets/images/fordoctor/insurance-claims.png";
import patientPackagesImg from "@/assets/images/fordoctor/patient-packages.png";
import multiLocationImg from "@/assets/images/fordoctor/multi-location.png";

const billingBusinessFeatures = [
  {
    title: "Invoicing",
    description: "Multi-currency, GST/VAT-ready, tax codes per region.",
    image: invoicingImg
  },
  {
    title: "Payments",
    description: "Card, UPI, Apple/Google Pay, bank transfer, cash. Reconciled automatically.",
    image: paymentsImg
  },
  {
    title: "Revenue & cohort reports",
    description: "New vs repeat, by doctor, by procedure, exportable to CSV.",
    image: revenueCohortReportsImg
  },
  {
    title: "Insurance claims",
    description: "Submit, track, and reconcile claims (US, UK, India, UAE).",
    image: insuranceClaimsImg
  },
  {
    title: "Patient packages",
    description: "Sell prepaid visit/treatment packages. Auto-deducted at each visit.",
    image: patientPackagesImg
  },
  {
    title: "Multi-location",
    description: "One brand, many branches. Roll-up reporting, cross-branch records.",
    image: multiLocationImg
  }
];

export default function ForDoctorsBilling() {
  return (
    <section className="fordoctors-features-section py-5 border-top-0">
      <div className="container">
        
        {/* Section 5: Billing & Business */}
        <div id="billing" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Billing & Business
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  Run the business of medicine without spreadsheets — and with no enterprise tax.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {billingBusinessFeatures.map((feat, idx) => {
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
