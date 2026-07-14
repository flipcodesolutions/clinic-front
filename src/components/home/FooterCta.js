import React from "react";
import Link from "next/link";

export default function FooterCta() {
  const cities = [
    "Ahmedabad", "Surat", "Chennai", "Delhi", "Hyderabad", "Jaipur", "Rajkot",
    "Lucknow", "Indore", "Patna", "Bhopal", "Bhubaneswar", "Nashik", "Coimbatore",
    "Raipur", "Kochi", "Kanpur", "Ranchi", "Ludhiana", "Mumbai", "Madurai",
    "Varanasi", "Thiruvananthapuram", "Agra", "Pune", "Jalandhar", "Amritsar",
    "Faridabad", "Nagpur", "Meerut"
  ];

  return (
    <section className="footer-cta-section">
      <div className="container text-center">
        {/* Main CTA Block */}
        <div className="py-5">
          <h2 className="footer-cta-title mb-3">
            Ready to run your clinic beautifully?
          </h2>
          <p className="footer-cta-subtitle mb-4">
            Join 2,847 clinics across India. Start free in 2 minutes. <br />
            No credit card. No phone-tag with sales. Just a clean clinic.
          </p>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link href="/signup" className="btn btn-brand-green text-white px-4 py-2.5 rounded-pill fw-bold shadow-sm">
              Start 30-day free trial
            </Link>
            <Link href="/demo" className="btn btn-brand-outline-white px-4 py-2.5 rounded-pill fw-bold">
              Schedule a 15-min demo &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Cities Links List */}
        <div className="footer-cta-cities-wrapper text-start">
          <h6 className="footer-cta-cities-title text-uppercase">
            DOCTORS NEAR YOU
          </h6>
          <div className="d-flex flex-wrap align-items-center gap-1">
            {cities.map((city, idx) => (
              <React.Fragment key={idx}>
                <Link href={`/search?city=${city.toLowerCase()}`} className="footer-cta-city-link">
                  {city}
                </Link>
                {idx < cities.length - 1 && <span className="text-secondary mx-1">&middot;</span>}
              </React.Fragment>
            ))}
            <span className="text-secondary mx-1">&middot;</span>
            <Link href="/cities" className="footer-cta-city-link text-brand-green fw-semibold">
              All cities &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
