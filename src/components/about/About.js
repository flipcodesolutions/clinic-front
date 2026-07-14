import React from "react";
import { FaSmile, FaShieldAlt, FaFlag } from "react-icons/fa";

export default function About() {
  const values = [
    {
      icon: <FaSmile />,
      title: "Simplicity First",
      desc: "Healthcare is complex enough. We design intuitive, clutter-free interfaces that let you focus on what matters most: your patients."
    },
    {
      icon: <FaShieldAlt />,
      title: "Absolute Security",
      desc: "Patient records are sacred. We guard your data with TLS encryption in transit, AES-256 at rest, and rigorous audit logging."
    },
    {
      icon: <FaFlag />,
      title: "Made for India",
      desc: "Tailored specifically for Indian healthcare, fully supporting GST invoicing, local payment setups, and typical clinic workflows."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="legal-badge">Company</div>
          <h1 className="about-hero-title">
            Empowering clinics to operate <span>beautifully</span>.
          </h1>
          <p className="about-hero-desc">
            We build state-of-the-art clinic management software and booking tools that help doctors manage their practices seamlessly and patients connect with verified care.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center mb-5">
              <h2 className="fw-bold text-dark mb-4">Our Mission</h2>
              <p className="lead text-secondary" style={{ lineHeight: "1.8" }}>
                Medi Growth, a brand operated by <strong>Silver Webbuzz Pvt Ltd</strong>, was founded on the belief that healthcare technology should be modern, reliable, and exceptionally designed. We remove the administrative burden of running a clinic by consolidating scheduling, prescriptions, billing, and patient records into a single, cohesive dashboard.
              </p>
            </div>
          </div>

          {/* Value Cards */}
          <div className="row g-4 mt-2">
            {values.map((val, idx) => (
              <div key={idx} className="col-md-4">
                <div className="about-card-value text-center">
                  <div className="about-value-icon mx-auto">
                    {val.icon}
                  </div>
                  <h4 className="fw-bold text-dark mb-3">{val.title}</h4>
                  <p className="text-secondary small mb-0" style={{ lineHeight: "1.6" }}>
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
