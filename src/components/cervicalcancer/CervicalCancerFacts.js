import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-Figures&Factss5.png';

const CervicalCancerFacts = () => {
  return (
    <section className="facts-section">
      <div className="facts-container">

        {/* Top Header */}
        <div className="facts-top">
          <div className="facts-text-col">
            <span className="facts-subtitle">FIGURES & FACTS</span>
            <h2 className="facts-title">
              The numbers <span className="facts-title-highlight">India</span> can't ignore
            </h2>
            <p className="facts-desc">
              Worldwide, cervical cancer caused around 660,000 new cases and 350,000 deaths in
              2022 (WHO). In India it is the second most common cancer among women — yet it
              is one of the most preventable. These figures are drawn from WHO, GLOBOCAN
              2022 and Government of India (PIB) public health sources.
            </p>
          </div>
          <div className="facts-img-col">
            <Image src={mainImg} alt="Cervical Cancer Figures & Facts India" className="facts-main-img" />
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="facts-grid">

          {/* Card 1: 2nd most common */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-pink-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="5"></circle>
                  <line x1="12" y1="15" x2="12" y2="21"></line>
                  <line x1="9" y1="18" x2="15" y2="18"></line>
                </svg>
              </div>
              <h3 className="facts-card-number">2nd</h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">most common cancer among women in India.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: GLOBOCAN 2022 / PIB</span>
            </div>
          </div>

          {/* Card 2: 1.2 Lakh + */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-red-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                  <polyline points="12 4 18 4 18 10"></polyline>
                  <line x1="6" y1="20" x2="18" y2="4"></line>
                </svg>
              </div>
              <h3 className="facts-card-number">1.2<span className="facts-card-number-sub">lakh+</span></h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">new cases and nearly 80,000 deaths in India every year.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: GLOBOCAN 2022</span>
            </div>
          </div>

          {/* Card 3: 25% global */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-teal-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="facts-card-number">25%</h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">of the world's cervical cancer deaths occur in India — 1 in 5 patients globally is Indian.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: WHO / PIB</span>
            </div>
          </div>

          {/* Card 4: 80%+ HPV */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-purple-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                  <line x1="19.07" y1="4.93" x2="14.83" y2="9.17"></line>
                  <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                  <line x1="9.17" y1="14.83" x2="4.93" y2="19.07"></line>
                </svg>
              </div>
              <h3 className="facts-card-number">80%<span className="facts-card-number-sub">+</span></h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">of India's cases are caused by high-risk HPV types 16 & 18.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: PIB</span>
            </div>
          </div>

          {/* Card 5: 93-100% effectiveness */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-green-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <h3 className="facts-card-number">93–100%</h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">effectiveness of a Gardasil-4 dose against the HPV types it covers.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: PIB, 2026</span>
            </div>
          </div>

          {/* Card 6: 1.15 Crore free vaccines */}
          <div className="facts-card">
            <div className="facts-card-header">
              <div className="facts-icon-wrapper bg-yellow-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <circle cx="12" cy="8" r="3"></circle>
                  <path d="M6 21v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1"></path>
                </svg>
              </div>
              <h3 className="facts-card-number">1.15<span className="facts-card-number-sub">crore</span></h3>
            </div>
            <div className="facts-card-content">
              <p className="facts-card-text">girls aged 14 to be vaccinated free under India's 2026 campaign.</p>
            </div>
            <div className="facts-card-footer">
              <div className="facts-divider-line"></div>
              <span className="facts-source-text">Source: PIB, Feb 2026</span>
            </div>
          </div>

          {/* Double-width banner card: Remember */}
          <div className="facts-remember-card">
            <div className="facts-remember-header">
              <div className="facts-remember-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
              </div>
              <div className="facts-remember-title-wrapper">
                <span className="facts-remember-tag">Remember</span>
                <h4 className="facts-remember-title">Prevention today, protection for life.</h4>
              </div>
            </div>
            <div className="facts-remember-body">
              <p className="facts-remember-subtext">Vaccination • Screening • Awareness</p>
              <p className="facts-remember-footer">Together we can <span className="facts-remember-green">end cervical cancer.</span></p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CervicalCancerFacts;
