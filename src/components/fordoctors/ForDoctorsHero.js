import React from "react";

export default function ForDoctorsHero() {
  return (
    <section className="fordoctors-hero-section">
      <div className="container text-center px-4">
        {/* Badge */}
        <div className="mb-4">
          <span className="badge-everything text-uppercase">
            EVERYTHING ECLINICPRO DOES
          </span>
        </div>

        {/* Heading */}
        <h1 className="fordoctors-hero-title mb-4">
          Everything to run your clinic. <br />
          <span className="text-brand-green">All in one place.</span>
        </h1>

        {/* Subtitle */}
        <p className="fordoctors-hero-desc text-muted mx-auto mb-2">
          42+ features across 7 areas — patient records, prescriptions, billing,
        </p>
        <p className="fordoctors-hero-desc text-muted mx-auto">
          WhatsApp/SMS and more. All included in one simple ₹16,000/year plan.
        </p>
      </div>

      {/* Stats container on a white background */}
      <div className="fordoctors-stats-wrapper">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 gap-md-0">
            <div className="flex-fill text-center px-3">
              <div className="fordoctors-stat-number">42</div>
              <div className="fordoctors-stat-label">Features included</div>
            </div>
            
            <div className="fordoctors-stat-divider d-none d-md-block"></div>
            
            <div className="flex-fill text-center px-3">
              <div className="fordoctors-stat-number">50+</div>
              <div className="fordoctors-stat-label">Specialties</div>
            </div>
            
            <div className="fordoctors-stat-divider d-none d-md-block"></div>
            
            <div className="flex-fill text-center px-3">
              <div className="fordoctors-stat-number">1</div>
              <div className="fordoctors-stat-label">Simple plan</div>
            </div>
            
            <div className="fordoctors-stat-divider d-none d-md-block"></div>
            
            <div className="flex-fill text-center px-3">
              <div className="fordoctors-stat-number">₹16,000</div>
              <div className="fordoctors-stat-label">Per year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
