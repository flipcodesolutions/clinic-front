import React from "react";
import Link from "next/link";

// Import custom logo images
import onlineBookingImg from "@/assets/images/Homepage/online-booking-page.png";
import patientRecordsImg from "@/assets/images/Homepage/structured-visit-notes.png";
import prescriptionsImg from "@/assets/images/Homepage/prescriptionl.svg";
import invoicingImg from "@/assets/images/Homepage/invoicing.png";
import refillRequestsImg from "@/assets/images/Homepage/refill-requests.svg";
import vitalsTrendImg from "@/assets/images/Homepage/vitals-trend-charts.png";
import bookin1Img from "@/assets/images/Homepage/bookin1.png";

export default function DoctorsDashboard() {
  const features = [
    {
      title: "Online bookings",
      description: "Patients book from your public profile. WhatsApp confirmations and reminders included.",
      icon: onlineBookingImg
    },
    {
      title: "Patient records",
      description: "File upload, records, history, and contact info — always one search away.",
      icon: patientRecordsImg
    },
    {
      title: "Prescriptions",
      description: "Signed digital Rx delivered to the patient on WhatsApp before they leave.",
      icon: prescriptionsImg
    },
    {
      title: "Billing & invoices",
      description: "Clean, GST-ready invoices in seconds. WhatsApp delivery.",
      icon: invoicingImg
    },
    {
      title: "Follow-ups",
      description: "1-click set a follow up, automatic reminders, overdue tracking, a clinic savior.",
      icon: refillRequestsImg
    },
    {
      title: "Reports",
      description: "Revenue, top diagnoses, patient retention. Numbers that matter, nothing else.",
      icon: vitalsTrendImg
    }
  ];

  return (
    <section className="doctors-dashboard-section">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Headline and Feature Grid */}
          <div className="col-lg-6">
            <span className="text-uppercase fw-bold text-brand-green doctors-dashboard-subheading d-block mb-3">
              FOR DOCTORS
            </span>
            <h2 className="doctors-dashboard-title mb-3">
              The clinic software <br />
              <span className="text-brand-green">doctors actually love.</span>
            </h2>
            <p className="doctors-dashboard-desc mb-4">
              Run your practice from one calm dashboard — appointments, patient records, prescriptions, billing and follow-ups. Just the essentials you use every day, and a public profile that brings you new patients.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-3">
              <Link href="/signup" className="btn btn-brand-green text-white px-4 py-2.5 rounded-pill fw-bold shadow-sm">
                Start your clinic — free &rarr;
              </Link>
              <Link href="/walkthrough" className="btn btn-brand-outline-white px-4 py-2.5 rounded-pill fw-bold">
                See a 2-min walkthrough
              </Link>
            </div>

            {/* Guarantee Note */}
            <p className="doctors-dashboard-subnotice mb-5">
              30-day free trial &middot; No credit card &middot; Your data stays yours.
            </p>

            {/* 6 Features Grid */}
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {features.map((feat, idx) => {
                return (
                  <div key={idx} className="col">
                    <div className="doctors-dashboard-feature-item">
                      <div className="doctors-dashboard-feature-icon-wrapper d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={feat.icon.src}
                          alt={feat.title}
                          style={{ width: "100%", height: "100%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                        />
                      </div>
                      <h5 className="doctors-dashboard-feature-title">
                        {feat.title}
                      </h5>
                      <p className="doctors-dashboard-feature-desc mb-0">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dashboard Screenshot */}
          <div className="col-lg-6">
            <div className="doctors-dashboard-mockup-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bookin1Img.src}
                alt="eClinicPro Clinical Administration Dashboard Mockup"
                className="img-fluid doctors-dashboard-mockup-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
