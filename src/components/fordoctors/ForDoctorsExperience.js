"use client";

import React from "react";
import Image from "next/image";

// Custom icon imports for Patient Experience
import patientWebPortalImg from "@/assets/images/fordoctor/patient-web-portal.png";
import videoConsultsImg from "@/assets/images/fordoctor/video-consults.png";
import whatsappSummariesImg from "@/assets/images/fordoctor/whatsapp-summaries.png";
import dietAndExercisePlansImg from "@/assets/images/fordoctor/diet-and-exercise-plans.png";
import refillRequestsImg from "@/assets/images/fordoctor/refill-requests.svg";
import feedbackCollectionImg from "@/assets/images/fordoctor/feedback-collection.png";

const patientExperienceFeatures = [
  {
    title: "Patient web portal",
    description: "Records, prescriptions, bills, upcoming visits — all in one tab.",
    image: patientWebPortalImg
  },
  {
    title: "Video consults",
    description: "HD, browser-based, no app install. Works on 3G.",
    image: videoConsultsImg
  },
  {
    title: "WhatsApp summaries",
    description: "After every visit: a clean summary plus next-step instructions.",
    image: whatsappSummariesImg
  },
  {
    title: "Diet & exercise plans",
    description: "Templated programs with daily WhatsApp check-ins.",
    image: dietAndExercisePlansImg
  },
  {
    title: "Refill requests",
    description: "Patients tap once. You approve or revise.",
    image: refillRequestsImg
  },
  {
    title: "Feedback collection",
    description: "Post-visit NPS via WhatsApp. Scores roll into your reports.",
    image: feedbackCollectionImg
  }
];

export default function ForDoctorsExperience() {
  return (
    <section className="fordoctors-features-section py-5 bg-white border-top-0">
      <div className="container">
        
        {/* Section 6: Patient Experience */}
        <div id="experience" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Patient Experience
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  The patient-facing layer your front desk wishes they could build. White-labeled and beautiful.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {patientExperienceFeatures.map((feat, idx) => {
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
