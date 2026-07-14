import React from "react";
import { FaCheck } from "react-icons/fa6";
import smsImg from "@/assets/images/Homepage/sms.png";

export default function WhatsAppSection() {
  const checkmarks = [
    "Booking confirmations & reminders that cut no-shows",
    "Signed prescriptions delivered as a PDF",
    "Follow-up nudges, sent at sensible hours only",
    "Smart cost controls — daily/monthly caps you set"
  ];

  return (
    <section className="whatsapp-section border-top">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: WhatsApp Screens Mockup */}
          <div className="col-lg-6 text-center">
            <div className="whatsapp-mockup-wrapper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={smsImg.src} 
                alt="WhatsApp and SMS fallback confirmation messaging flow" 
                className="img-fluid whatsapp-mockup-image"
              />
            </div>
          </div>

          {/* Right Column: Title and Checklist */}
          <div className="col-lg-6">
            <span className="text-uppercase fw-bold text-brand-green whatsapp-subheading d-block mb-3">
              INCLUDED IN YOUR PLAN
            </span>
            <h2 className="whatsapp-title mb-3">
              WhatsApp first. SMS as backup. Never a missed message.
            </h2>
            <p className="whatsapp-desc mb-4">
              Appointment confirmations, reminders, prescription delivery and follow-up nudges go out on WhatsApp automatically. No WhatsApp on that number? We fall back to SMS — so the message always lands.
            </p>

            {/* Checklist */}
            <div className="whatsapp-checkmark-list">
              {checkmarks.map((text, idx) => (
                <div key={idx} className="whatsapp-checkmark-item">
                  <div className="whatsapp-checkmark-icon-wrapper">
                    <FaCheck className="whatsapp-checkmark-icon" size={11} />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
