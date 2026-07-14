import React from "react";
import Link from "next/link";
import {
  FiSearch,
  FiCalendar,
  FiShield,
  FiPhoneOff,
  FiZap,
  FiLock,
  FiCheckCircle
} from "react-icons/fi";
import reImg from "@/assets/images/Homepage/re.png";

export default function BookingFlow() {
  const steps = [
    {
      stepNumber: "01",
      stepBgClass: "bg-step-green",
      title: "Search",
      description: "Search your city, specialty or doctor name and explore verified doctors with real fees.",
      icon: FiSearch,
      iconWrapperClass: "bg-specialty-green"
    },
    {
      stepNumber: "02",
      stepBgClass: "bg-step-blue",
      title: "Request a slot",
      description: "Choose a convenient date and time. You'll instantly get a request confirmation via WhatsApp/SMS.",
      icon: FiCalendar,
      iconWrapperClass: "bg-specialty-blue"
    },
    {
      stepNumber: "03",
      stepBgClass: "bg-step-navy",
      title: "Doctor confirms",
      description: "The clinic confirms your appointment and you get a final confirmation. Zero phone-tag.",
      icon: FiShield,
      iconWrapperClass: "bg-specialty-purple"
    }
  ];

  const features = [
    {
      title: "No Calls",
      description: "Avoid busy call centres and long hold times.",
      icon: FiPhoneOff,
      iconClass: "feature-icon-green"
    },
    {
      title: "Instant & Easy",
      description: "Book in under 60 seconds.",
      icon: FiZap,
      iconClass: "feature-icon-blue"
    },
    {
      title: "Secure & Private",
      description: "Your data is safe with us.",
      icon: FiLock,
      iconClass: "feature-icon-purple"
    },
    {
      title: "Trusted Clinics",
      description: "Verified doctors and trusted by thousands.",
      icon: FiCheckCircle,
      iconClass: "feature-icon-orange"
    }
  ];

  return (
    <section className="booking-flow-section">
      <div className="container">
        {/* Top Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-brand-green booking-flow-subheading d-block mb-2">
            FOR PATIENTS
          </span>
          <h2 className="display-6 fw-bold text-dark mb-3 booking-flow-title">
            Book in 60 seconds. No call centre.
          </h2>
          <p className="text-muted col-lg-6 mx-auto booking-flow-desc">
            EclinicPro makes appointment booking simple, fast and hassle-free for every patient.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="row align-items-center g-5 mb-5">
          {/* Left Column: Booking Steps */}
          <div className="col-lg-7">
            <div className="steps-container-custom d-flex flex-column flex-md-row align-items-stretch gap-4 justify-content-between mb-5 position-relative">
              {steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <React.Fragment key={idx}>
                    {/* Step Card */}
                    <div className="step-card-custom position-relative flex-grow-1">
                      {/* Step Number Badge */}
                      <span className={`step-badge-custom ${step.stepBgClass}`}>
                        {step.stepNumber}
                      </span>
                      
                      {/* Icon Box */}
                      <div className={`step-icon-box-custom ${step.iconWrapperClass}`}>
                        <StepIcon size={18} />
                      </div>
                      
                      {/* Content */}
                      <h5 className="step-title-custom fw-bold text-dark">{step.title}</h5>
                      <p className="step-desc-custom mb-0 text-muted small">{step.description}</p>
                    </div>

                    {/* Dashed Arrow (show only between steps 1-2 and 2-3 on large screens) */}
                    {idx < steps.length - 1 && (
                      <div className="step-arrow-custom d-none d-xl-flex align-items-center">
                        <svg width="36" height="18" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12C12 4 36 4 46 12" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round"/>
                          <path d="M40 8L46 12L40 16" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Features Horizontal Bar */}
            <div className="booking-flow-features-container">
              <div className="row g-4">
                {features.map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={idx} className="col-sm-6 col-md-3">
                      <div className="booking-flow-feature-item">
                        <div className={`booking-flow-feature-icon-box ${feature.iconClass}`}>
                          <FeatureIcon size={16} />
                        </div>
                        <h6 className="booking-flow-feature-title text-dark">
                          {feature.title}
                        </h6>
                        <p className="booking-flow-feature-desc">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Phones Mockup Image */}
          <div className="col-lg-5 text-center">
            <div className="booking-flow-mockup-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={reImg.src}
                alt="EclinicPro Mobile App Booking Flow Mockup"
                className="img-fluid booking-flow-mockup-image"
              />
            </div>
          </div>
        </div>

        {/* CTA Find Doctor Button */}
        <div className="text-center mt-5">
          <Link href="/services" className="btn btn-brand-green text-white px-4 py-2.5 rounded-pill fw-bold shadow-sm">
            Find your doctor &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
