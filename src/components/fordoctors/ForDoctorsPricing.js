"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

// Custom icon imports for Pricing Section
import patientConnectImg from "@/assets/images/fordoctor/whatsapp-summaries.png";
import clinicNetworkImg from "@/assets/images/fordoctor/clinic-network.png";

export default function ForDoctorsPricing() {
  const standardFeatures = [
    "Patient records, visits, prescriptions",
    "Appointments & walk-in queue",
    "Billing & invoicing (GST-ready)",
    "Vitals, diagnosis, follow-up tracking",
    "Specialty-aware forms (50+ specialties)",
    "Teleconsultation built in",
    "Public doctor profile on eclinicpro.com",
    "Daily reports & analytics",
    "Unlimited patients, unlimited staff users",
    "30-day free trial — no credit card"
  ];

  return (
    <section className="fordoctors-pricing-section py-4 bg-white border-top">
      <div className="container py-4">

        {/* Header Section */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <div className="specialties-header-line fdp-header-line"></div>
            <span className="text-uppercase fw-bold small text-brand-green fdp-header-tag">
              PRICING
            </span>
            <div className="specialties-header-line fdp-header-line"></div>
          </div>
          <h2 className="display-5 fw-bold text-dark mb-3">
            One plan. Everything included.
          </h2>
          <p className="text-muted col-lg-6 mx-auto fdp-header-desc">
            No tiers, no per-seat games, no surprise upsells. One annual price gets you the whole clinic system — and you start with a 30-day free trial, no card needed.
          </p>
        </div>

        {/* Pricing Layout Grid */}
        <div className="row g-4 justify-content-center align-items-start mt-2">

          {/* Left Column: Standard Plan Card */}
          <div className="col-lg-6 col-md-11">
            <div className="card h-100 p-4 bg-white shadow-sm fdp-plan-card">
              {/* Card Header */}
              <div className="mb-3">
                <span className="badge px-3 py-2 rounded-pill fw-bold mb-3 fdp-plan-badge">
                  STANDARD PLAN
                </span>
                <div className="d-flex align-items-baseline gap-1 my-2">
                  <span className="fs-2 fw-semibold text-dark">₹</span>
                  <span className="display-4 fw-bold text-dark fdp-plan-amount">16,000</span>
                  <span className="text-muted fs-5 fw-normal ms-1">/year</span>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted text-decoration-line-through small">₹17,988</span>
                  <span className="badge rounded-pill fw-bold text-white px-2 py-1 fdp-save-badge">
                    Save 10%
                  </span>
                  <span className="text-muted small ms-1">+ 18% GST at checkout</span>
                </div>
              </div>

              <hr className="my-3 fdp-hr" />

              {/* Card Features List */}
              <div className="mb-3">
                <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                  {standardFeatures.map((feature, idx) => (
                    <li key={idx} className="d-flex align-items-start gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-1 fdp-feature-icon-wrap">
                        <FaCheck className="fdp-feature-icon" />
                      </div>
                      <span className="text-dark fw-medium fdp-feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="my-3 fdp-hr" />

              {/* Card Footer Actions */}
              <div>
                <Link
                  href="/signup"
                  className="btn text-white w-100 py-2.5 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2 fdp-trial-btn"
                >
                  Start 30-day free trial &rarr;
                </Link>
                <div className="text-center text-muted small">
                  No card needed. Cancel anytime during trial.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Optional Add-ons */}
          <div className="col-lg-5 col-md-11">
            <h4 className="fw-bold text-dark mb-3">
              Optional add-ons
            </h4>

            <div className="d-flex flex-column gap-3">

              {/* Add-on 1: Patient Connect */}
              <div className="card border shadow-sm p-3 bg-white fdp-addon-card">
                <div className="d-flex gap-3 align-items-start">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3 fdp-addon-icon-wrap">
                    <Image
                      src={patientConnectImg}
                      alt="Patient Connect"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold text-dark mb-2 fdp-addon-title">
                      Patient Connect
                    </h5>
                    <p className="text-muted small mb-2 fdp-addon-desc">
                      WhatsApp automation: appointment reminders, prescription delivery, follow-up nudges. Cuts no-show rates in half.
                    </p>
                    <div className="fw-bold fdp-addon-price">
                      +₹499 / month
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-on 2: Clinic Network */}
              <div className="card border shadow-sm p-3 bg-white fdp-addon-card">
                <div className="d-flex gap-3 align-items-start">
                  <div className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-3 fdp-addon-icon-wrap">
                    <Image
                      src={clinicNetworkImg}
                      alt="Clinic Network"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold text-dark mb-2 fdp-addon-title">
                      Clinic Network
                    </h5>
                    <p className="text-muted small mb-2 fdp-addon-desc">
                      Add an extra clinic branch under one account. Unified patient records, separate queues per branch.
                    </p>
                    <div className="fw-bold fdp-addon-price">
                      +₹999 / month per branch
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <p className="text-muted small mt-2 mb-0 fdp-note-text">
                GST (18%) is added at checkout. After the 30-day trial you decide whether to continue — no automatic charges and no card taken upfront.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
