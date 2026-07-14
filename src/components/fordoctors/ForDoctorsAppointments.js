"use client";

import React from "react";
import Image from "next/image";

// Custom PNG icon imports for Appointments & Visits
import smartSchedulingImg from "@/assets/images/fordoctor/smart-scheduling.png";
import smsRemindersImg from "@/assets/images/fordoctor/sms-reminders.png";
import walkInTriageImg from "@/assets/images/fordoctor/walk-in-triage.png";
import noShowAnalyticsImg from "@/assets/images/fordoctor/no-show-analytics.png";
import onlineBookingPageImg from "@/assets/images/fordoctor/online-booking-page.png";
import telemedicineSlotsImg from "@/assets/images/fordoctor/telemedicine-slots.png";

const appointmentsVisitsFeatures = [
  {
    title: "Smart scheduling",
    description: "Multi-doctor, multi-room. Drag to reschedule. Conflicts auto-blocked.",
    image: smartSchedulingImg
  },
  {
    title: "WhatsApp + SMS reminders",
    description: "Auto-sent 24h and 1h before. Patient can reply to confirm or cancel.",
    image: smsRemindersImg
  },
  {
    title: "Walk-in triage",
    description: "Quick-add a walk-in, place in queue, print receipt. Simple.",
    image: walkInTriageImg
  },
  {
    title: "No-show analytics",
    description: "Which patients no-show, which slots, which time of week — track it all.",
    image: noShowAnalyticsImg
  },
  {
    title: "Online booking page",
    description: "Branded booking link patients can share. Sync to your calendar live.",
    image: onlineBookingPageImg
  },
  {
    title: "Telemedicine slots",
    description: "Mix in-person and video slots easily. Learn from data what works.",
    image: telemedicineSlotsImg
  }
];

export default function ForDoctorsAppointments() {
  return (
    <section className="fordoctors-features-section py-5 bg-white border-top-0">
      <div className="container">
        
        {/* Section 2: Appointments & Visits */}
        <div id="appointments" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Appointments & Visits
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  A booking system that respects walk-ins, no-shows, and the messiness of real clinical workflow.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {appointmentsVisitsFeatures.map((feat, idx) => {
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
