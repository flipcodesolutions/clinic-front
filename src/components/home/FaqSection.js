"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { FaStethoscope } from "react-icons/fa6";

export default function FaqSection() {
  const [openPatientIdx, setOpenPatientIdx] = useState(null);
  const [openDoctorIdx, setOpenDoctorIdx] = useState(null);

  const patientFaqs = [
    {
      q: "Is it free for patients?",
      a: "Yes — searching and booking doctors on eclinicpro.com is completely free. You only pay the doctor's consultation fee, which is shown upfront on every profile."
    },
    {
      q: "How does booking work?",
      a: "Pick a doctor, request a slot, and you instantly get a WhatsApp/SMS with the clinic's number. The clinic confirms on their side and you get a final confirmation — no phone-tag."
    },
    {
      q: "Do I need to create an account to book?",
      a: "No password needed. You just verify your phone with a one-time OTP. After that you can see your bookings and history in your patient panel anytime."
    },
    {
      q: "Are the doctors verified?",
      a: "Yes. Every listed doctor is verified by our team before they appear in the directory, and claimed profiles are confirmed against the clinic."
    },
    {
      q: "What if I need to cancel or the slot is wrong?",
      a: "You always get the clinic's direct number with your booking, so you can call to reschedule. The doctor can also confirm or suggest a different time."
    },
    {
      q: "Which cities and specialties are covered?",
      a: "We're live across India with 50+ specialties — from general physicians and dentists to homeopaths, dermatologists, physiotherapists and more."
    }
  ];

  const doctorFaqs = [
    {
      q: "What does it cost?",
      a: "One annual plan: ₹16,000/year (10% off ₹17,988; GST added at checkout). Everything to run a clinic is included, with a 30-day free trial and no card required."
    },
    {
      q: "Is WhatsApp/SMS an extra add-on?",
      a: "No. WhatsApp-first messaging with SMS fallback — confirmations, reminders, prescription delivery and follow-up nudges — is built into every plan at no extra cost."
    },
    {
      q: "Will patients actually find me?",
      a: "Yes. Your public profile on eclinicpro.com's directory is included, so patients searching your city and specialty can discover and book you directly."
    },
    {
      q: "Is my clinic and patient data secure?",
      a: "Records are encrypted at rest and in transit, with per-clinic isolation and audit logging. You can export everything as PDF or JSON anytime."
    },
    {
      q: "Can I claim a profile that's already listed?",
      a: "Yes. If your clinic is already in the directory, claim it from your profile page — once verified you control your listing, availability and bookings."
    },
    {
      q: "Does it fit my specialty?",
      a: "The visit screen adapts to your specialty (homeopathy case-taking, dental charting, pediatric growth, derma photos, and more) so you're not fighting a generic form."
    }
  ];

  const togglePatient = (idx) => {
    setOpenPatientIdx(openPatientIdx === idx ? null : idx);
  };

  const toggleDoctor = (idx) => {
    setOpenDoctorIdx(openDoctorIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="faq-section">
      <div className="container">
        {/* Top Header */}
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold small text-brand-green faq-subheading d-block mb-2">
            QUESTIONS
          </span>
          <h2 className="display-6 fw-bold text-dark mb-3 faq-title">
            Good to know.
          </h2>
        </div>

        {/* 2 Columns Grid */}
        <div className="row justify-content-center">
          <div className="col-lg-11 col-xl-10">
            <div className="row g-5">
              {/* Left Column: For Patients */}
              <div className="col-md-6">
                <div className="faq-column-title-box mb-4">
                  <div className="faq-column-icon-wrapper bg-patients">
                    <FiSearch className="faq-column-icon" size={15} />
                  </div>
                  <span className="faq-column-title">For patients</span>
                </div>
                <div>
                  {patientFaqs.map((faq, idx) => {
                    const isOpen = openPatientIdx === idx;
                    return (
                      <div key={idx} className="faq-item-custom">
                        <div 
                          className="faq-question-custom" 
                          onClick={() => togglePatient(idx)}
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <FaMinus size={10} className="text-brand-green" /> : <FaPlus size={10} className="text-muted" />}
                        </div>
                        {isOpen && (
                          <div className="faq-answer-custom">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: For Doctors */}
              <div className="col-md-6">
                <div className="faq-column-title-box mb-4">
                  <div className="faq-column-icon-wrapper bg-doctors">
                    <FaStethoscope className="faq-column-icon" size={14} />
                  </div>
                  <span className="faq-column-title">For doctors</span>
                </div>
                <div>
                  {doctorFaqs.map((faq, idx) => {
                    const isOpen = openDoctorIdx === idx;
                    return (
                      <div key={idx} className="faq-item-custom">
                        <div 
                          className="faq-question-custom" 
                          onClick={() => toggleDoctor(idx)}
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <FaMinus size={10} className="text-brand-green" /> : <FaPlus size={10} className="text-muted" />}
                        </div>
                        {isOpen && (
                          <div className="faq-answer-custom">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
