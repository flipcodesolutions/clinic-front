'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getVisitorCities } from "@/services/visitorService";

export default function FooterCta() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getVisitorCities().then((list) => {
      if (isMounted && Array.isArray(list)) {
        setCities(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="footer-cta-section">
      <div className="container text-center">
        {/* Main CTA Block */}
        <div className="py-5">
          <h2 className="footer-cta-title mb-3">
            Ready to run your clinic beautifully?
          </h2>
          <p className="footer-cta-subtitle mb-4">
            Join clinics across India. Start free in 2 minutes. <br />
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

        {/* Bottom Cities Links List - Dynamic: Only cities where clinics are available */}
        {cities.length > 0 && (
          <div className="footer-cta-cities-wrapper text-start">
            <h6 className="footer-cta-cities-title text-uppercase">
              DOCTORS NEAR YOU
            </h6>
            <div className="d-flex flex-wrap align-items-center gap-1">
              {cities.map((city, idx) => (
                <React.Fragment key={city}>
                  <Link href={`/finddoctor?location=${encodeURIComponent(city)}`} className="footer-cta-city-link">
                    {city}
                  </Link>
                  {idx < cities.length - 1 && <span className="text-secondary mx-1">&middot;</span>}
                </React.Fragment>
              ))}
              <span className="text-secondary mx-1">&middot;</span>
              <Link href="/finddoctor" className="footer-cta-city-link text-brand-green fw-semibold">
                All cities &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
