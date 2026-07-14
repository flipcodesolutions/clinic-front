"use client";

import React from "react";
import Image from "next/image";

// Custom icon imports for Clinical Tools
import vitalsTrendChartsImg from "@/assets/images/fordoctor/vitals-trend-charts.png";
import labOrdersResultsImg from "@/assets/images/fordoctor/lab-orders-and-results.png";
import dentalChartingImg from "@/assets/images/fordoctor/dental-charting.svg";
import skinImagingImg from "@/assets/images/fordoctor/skin-imaging.png";
import whoGrowthChartsImg from "@/assets/images/fordoctor/who-growth-charts.png";
import homeoRemedyDbImg from "@/assets/images/fordoctor/homeo-remedy-db.png";

const clinicalToolsFeatures = [
  {
    title: "Vitals trend charts",
    description: "BP, HR, glucose, weight — visual time series with target bands.",
    image: vitalsTrendChartsImg
  },
  {
    title: "Lab orders & results",
    description: "Order, receive, attach. Auto-flagged abnormals.",
    image: labOrdersResultsImg
  },
  {
    title: "Dental charting",
    description: "FDI/Palmer/Universal. Per-tooth notes, images, and treatment plans.",
    image: dentalChartingImg
  },
  {
    title: "Skin imaging",
    description: "Side-by-side before/after with lesion measurement.",
    image: skinImagingImg
  },
  {
    title: "WHO growth charts",
    description: "Pediatric percentile tracking for weight, height, head circumference.",
    image: whoGrowthChartsImg
  },
  {
    title: "Homeo remedy DB",
    description: "3,200 remedies, potency picker, antidote rules, miasm tags.",
    image: homeoRemedyDbImg
  }
];

export default function ForDoctorsClinical() {
  return (
    <section className="fordoctors-features-section py-5 bg-white border-top-0">
      <div className="container">
        
        {/* Section 4: Clinical Tools */}
        <div id="clinical" className="fordoctors-static-section pt-2">
          <div className="fordoctors-details-header mb-4">
            <div className="row align-items-end">
              <div className="col-md-6 text-start">
                <span className="fordoctors-badge text-uppercase fw-bold mb-2 d-inline-block">
                  6 FEATURES
                </span>
                <h2 className="fordoctors-active-title fw-bold mb-0">
                  Clinical Tools
                </h2>
              </div>
              <div className="col-md-6 mt-3 mt-md-0 text-start text-md-start">
                <p className="fordoctors-active-desc text-muted mb-0">
                  The specialty-specific toolkit — the right tools appear automatically for your specialty.
                </p>
              </div>
            </div>
          </div>

          <hr className="fordoctors-divider mb-5" />

          {/* Features Grid (3-column layout) */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
            {clinicalToolsFeatures.map((feat, idx) => {
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
