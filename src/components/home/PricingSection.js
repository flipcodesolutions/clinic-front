import React from "react";
import Link from "next/link";
import Card from "@/components/common/Card";
import { FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

// Custom background and card icons imports
import pricingBgImg from "@/assets/images/Homepage/background-img.png";

import clinicNetworkImg from "@/assets/images/fordoctor/clinic-network.png";
import patientRecordsImg from "@/assets/images/Homepage/structured-visit-notes.png";
import patientsManagedImg from "@/assets/images/fordoctor/patient-web-portal.png";
import appointmentsImg from "@/assets/images/Homepage/online-booking-page.png";
import uptimeImg from "@/assets/images/fordoctor/fast-and-reliable.svg";
import gstBillingImg from "@/assets/images/Homepage/invoicing.png";
import gstReadyImg from "@/assets/images/fordoctor/compliant-by-default.png";

export default function PricingSection() {
  const planFeatures = [
    {
      title: "500+ Clinics Using",
      description: "Trusted by clinics across India.",
      icon: clinicNetworkImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "Patient Records",
      description: "Store & manage everything securely.",
      icon: patientRecordsImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "50,000+ Patients Managed",
      description: "Manage patient data with complete ease.",
      icon: patientsManagedImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "Appointments",
      description: "Walk-in, bookings & smart scheduling.",
      icon: appointmentsImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "99.9% Uptime",
      description: "Reliable, secure & always available.",
      icon: uptimeImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "WhatsApp Reminders",
      description: "Automated alerts reduce no-shows.",
      icon: () => <FaWhatsapp size={24} className="text-dark" />,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "GST Billing",
      description: "GST-ready invoicing & reports.",
      icon: gstBillingImg,
      iconWrapperClass: "bg-transparent p-0"
    },
    {
      title: "100% GST Ready",
      description: "Compliant billing, invoices & reports.",
      icon: gstReadyImg,
      iconWrapperClass: "bg-transparent p-0"
    }
  ];

  const pricingFeatures = [
    "Patient records, visits & prescriptions",
    "Appointments & walk-in queue",
    "Billing & invoicing (GST-ready)",
    "WhatsApp + SMS messaging built-in",
    "Specialty-aware forms (50+ specialties)",
    "Public doctor profile on eclinicpro.com",
    "Unlimited patients & staff users",
    "Reports, follow-ups & analytics"
  ];

  return (
    <section 
      className="pricing-section"
      style={{
        backgroundImage: `url(${pricingBgImg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container">
        {/* Top Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-brand-green pricing-subheading d-block mb-2">
            ALL IN ONE CLINIC MANAGEMENT SOFTWARE
          </span>
          <h2 className="display-6 fw-bold text-dark mb-3 pricing-title">
            One plan. Everything to run your clinic.
          </h2>
          <p className="text-muted col-lg-6 mx-auto pricing-desc">
            No tiers, no per-seat games, no surprise upsells. <br />
            Try free for <span className="fw-bold text-brand-green">30 days — no card.</span>
          </p>
        </div>

        {/* Centered Narrower Outer Grid Wrapper to add side margins */}
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="row g-4 align-items-center">
              {/* Left Column: 8 Feature Cards Grid */}
              <div className="col-lg-7">
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {planFeatures.map((feat, idx) => (
                    <div key={idx} className="col">
                      <Card
                        title={feat.title}
                        description={feat.description}
                        icon={feat.icon}
                        iconWrapperClass={feat.iconWrapperClass}
                        actionType="none"
                        layout="horizontal"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Standard Pricing Card */}
              <div className="col-lg-5">
                <div className="pricing-card-wrapper">
                  <div className="pricing-card-header text-center">
                    <span className="pricing-card-badge d-block mb-1">
                      STANDARD — EVERYTHING INCLUDED
                    </span>
                    <div className="pricing-card-amount mt-1">
                      ₹16,000<span className="fs-5 fw-normal text-muted">/year</span>
                    </div>
                    <div className="pricing-card-subnotice mt-1">
                      <span className="text-decoration-line-through text-muted small">₹17,960</span> <span className="save-badge-solid mx-1">SAVE 10%</span> <span className="text-muted small">+ 18% GST at checkout</span>
                    </div>
                  </div>

                  <div className="pricing-card-body p-4">
                    {/* Checklist Grid */}
                    <div className="row g-3 mb-4">
                      {pricingFeatures.map((item, idx) => (
                        <div key={idx} className="col-md-6">
                          <div className="pricing-card-check-item">
                            <FiCheck className="pricing-card-check-icon" size={14} />
                            <span>{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="text-center mb-3">
                      <Link href="/signup" className="btn btn-brand-green text-white w-100 py-2.5 rounded-pill fw-bold shadow-sm">
                        Start 30-day free trial
                      </Link>
                    </div>

                    {/* Card Meta Checklist */}
                    <div className="d-flex justify-content-center gap-3 pricing-card-meta mb-3">
                      <span><FiCheck className="text-brand-green" size={12} /> No credit card</span>
                      <span><FiCheck className="text-brand-green" size={12} /> Cancel anytime</span>
                      <span><FiCheck className="text-brand-green" size={12} /> Setup in minutes</span>
                    </div>

                    {/* Bottom FAQ link */}
                    <div className="text-center">
                      <Link href="#faq-section" className="text-brand-green text-decoration-none fw-semibold small">
                        See full pricing &amp; FAQ &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
