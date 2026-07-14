import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import heroImg from '@/assets/images/cervical cancer/eclinicpro-Government-of-India-Hero-imagees9.png';

const CervicalCancerGovCampaign = () => {
  return (
    <section className="gov-campaign-section">
      <div className="gov-campaign-container">
        
        {/* Top Header Row with Government Emblem details */}
        <div className="gov-campaign-top">
          <div className="gov-campaign-text-col">
            <div className="gov-emblem-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="gov-emblem-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>GOVERNMENT OF INDIA</span>
            </div>
            <h2 className="gov-campaign-title">
              Cervical Cancer <br />
              <span>Vaccination Campaign</span> launched
            </h2>
            <p className="gov-campaign-desc">
              On <strong>28 February 2026</strong>, the Prime Minister launched a nationwide HPV Vaccination Programme at Ajmer, Rajasthan — providing the Gardasil-4 vaccine <strong>free of cost</strong> to about <strong>1.15 crore girls aged 14</strong> across all States and UTs, in line with the vision of <em>"Swasth Nari, Sashakt Parivar"</em>.
            </p>
          </div>
          <div className="gov-campaign-img-col">
            <div className="gov-campaign-shield-wrapper">
              <Image src={heroImg} alt="Cervical Cancer Vaccination Campaign Government of India" className="gov-campaign-hero-img" />
            </div>
          </div>
        </div>

        {/* Panel 2: What the campaign means for you */}
        <div className="gov-campaign-means-card">
          <h3 className="gov-means-title">What the campaign means for you</h3>
          
          <div className="gov-features-grid">
            {/* Feature 1 */}
            <div className="gov-feature-card">
              <div className="gov-feature-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <path d="m18 2 4 4"></path>
                  <path d="m17 7 3-3"></path>
                  <path d="M16 8 8.7 15.3c-.2.2-.5.3-.7.3H5v-3c0-.3.1-.5.3-.7L12.5 4.5"></path>
                  <path d="m9 11 4 4"></path>
                  <path d="m5 19-3 3"></path>
                </svg>
              </div>
              <h4>Free vaccine for 14-year-old girls</h4>
              <p>Gardasil-4 is given free at government health facilities. Girls turning 15 within 90 days of launch are also eligible during the intensive three-month drive.</p>
            </div>

            {/* Feature 2 */}
            <div className="gov-feature-card">
              <div className="gov-feature-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h4>Easy registration</h4>
              <p>Self-register on the <strong>U-WIN</strong> platform, get pre-registered by a health worker, or simply walk in. Vaccination certificates are downloadable from U-WIN.</p>
            </div>

            {/* Feature 3 */}
            <div className="gov-feature-card">
              <div className="gov-feature-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 11 11 13 15 9"></polyline>
                </svg>
              </div>
              <h4>Safe & supervised</h4>
              <p>Given only at facilities with a cold-chain point and a medical officer; each girl is observed for 30 minutes after the dose. Sessions usually run 9 AM–2 PM. Don't go on an empty stomach.</p>
            </div>

            {/* Feature 4 */}
            <div className="gov-feature-card">
              <div className="gov-feature-icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h4>World-class backing</h4>
              <p>Procured in partnership with <strong>GAVI, the Vaccine Alliance</strong>; logistics tracked via eVIN. India now joins 160+ countries with HPV vaccination in their national immunisation schedule.</p>
            </div>
          </div>
        </div>

        {/* Green Target Stats Panel */}
        <div className="gov-target-stats-panel">
          <div className="gov-stats-panel-header">
            <div className="gov-stats-header-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="9 11 11 13 15 9"></polyline>
              </svg>
            </div>
            <p className="gov-stats-header-text">
              <strong>The global goal — WHO “90-70-90” by 2030:</strong> India's 2026 campaign is a major step toward this target.
            </p>
          </div>
          
          <div className="gov-stats-grid">
            {/* Stat 1: 90% */}
            <div className="gov-stat-col">
              <div className="gov-stat-circle-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="gov-stat-info">
                <div className="gov-stat-value">90%</div>
                <p className="gov-stat-label">of girls fully vaccinated against HPV by age 15</p>
              </div>
            </div>

            {/* Stat 2: 70% */}
            <div className="gov-stat-col">
              <div className="gov-stat-circle-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div className="gov-stat-info">
                <div className="gov-stat-value">70%</div>
                <p className="gov-stat-label">of women screened with a high-performance test by ages 35 and 45</p>
              </div>
            </div>

            {/* Stat 3: 90% */}
            <div className="gov-stat-col">
              <div className="gov-stat-circle-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 11 11 13 15 9"></polyline>
                </svg>
              </div>
              <div className="gov-stat-info">
                <div className="gov-stat-value">90%</div>
                <p className="gov-stat-label">of women with cervical disease receiving treatment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="gov-source-attribution">
          Source: Press Information Bureau (PIB), Government of India — Cervical Cancer Vaccination Campaign, 28 February 2026; WHO; GLOBOCAN 2022.
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerGovCampaign;
