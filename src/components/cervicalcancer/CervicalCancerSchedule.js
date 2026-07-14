import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import cervavacImg from '@/assets/images/cervical cancer/Cervavac.png';
import gardasil4Img from '@/assets/images/cervical cancer/Gardasil 4.png';
import gardasil9Img from '@/assets/images/cervical cancer/Gardasil 9.png';

import age9_14Img from '@/assets/images/cervical cancer/19-14.png';
import age15_26Img from '@/assets/images/cervical cancer/15-26.png';
import age27_45Img from '@/assets/images/cervical cancer/27-45.png';
import age30_65Img from '@/assets/images/cervical cancer/30-65.png';
import age65PlusImg from '@/assets/images/cervical cancer/65.png';

const CervicalCancerSchedule = () => {
  return (
    <section className="schedule-section">
      <div className="schedule-container">
        
        {/* Panel 1: Approximate cost in India */}
        <div className="schedule-panel schedule-panel-cost">
          <div className="panel-header-row">
            <div className="panel-icon-circle bg-teal-subtle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3 className="panel-main-title">Approximate cost in India</h3>
          </div>
          
          <div className="cost-cards-grid">
            {/* Card 1: Pap Smear */}
            <div className="cost-card">
              <div className="cost-icon-bg bg-green-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <path d="M14 22a7 7 0 1 0-14 0" />
                  <path d="M9 14h2" />
                  <path d="M9 12a3 3 0 0 1 6 0v5" />
                  <path d="M12 2v3" />
                  <path d="M11 5h2" />
                  <path d="M12 8a4 4 0 0 0-4 4" />
                </svg>
              </div>
              <div className="cost-card-info">
                <h4>Pap Smear</h4>
                <span className="starts-from">Starts from</span>
                <div className="cost-amount">₹500</div>
              </div>
            </div>

            {/* Card 2: LBC */}
            <div className="cost-card">
              <div className="cost-icon-bg bg-blue-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                  <path d="M6 2h12M14 2v6.2c0 .8.5 1.6 1.1 2.1l4.2 3.5c.8.7.7 2-.3 2.2H5c-1 0-1.1-1.3-.3-2.2l4.2-3.5c.6-.5 1.1-1.3 1.1-2.1V2" />
                </svg>
              </div>
              <div className="cost-card-info">
                <h4>Liquid Based Cytology (LBC)</h4>
                <span className="starts-from">Starts from</span>
                <div className="cost-amount">₹1,200</div>
              </div>
            </div>

            {/* Card 3: Pap + HPV DNA */}
            <div className="cost-card">
              <div className="cost-icon-bg bg-purple-light">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                  <path d="M4.5 10.5C8 7 11 7 14.5 10.5S20 14 23.5 10.5" />
                  <path d="M4.5 13.5C8 17 11 17 14.5 13.5S20 10 23.5 10.5" />
                  <path d="M8 9.5v5M12 10.5v3M16 10.5v3M20 9.5v5" />
                </svg>
              </div>
              <div className="cost-card-info">
                <h4>Pap + HPV DNA Test</h4>
                <span className="starts-from">Starts from</span>
                <div className="cost-amount">₹2,000</div>
              </div>
            </div>
          </div>
          
          <p className="schedule-panel-disclaimer">
            Available at private hospitals, gynecologist clinics, reputed laboratories, and government / civil hospitals. Prices are indicative and vary by city, lab and package — please confirm with your provider.
          </p>
        </div>

        {/* Panel 2: HPV vaccines available in India */}
        <div className="schedule-panel schedule-panel-vaccines">
          <div className="panel-header-row">
            <div className="panel-icon-circle bg-green-subtle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="panel-main-title">HPV vaccines available in India</h3>
          </div>

          <div className="vaccine-cards-grid">
            {/* Cervavac */}
            <div className="vaccine-card">
              <div className="vaccine-img-box">
                <Image src={cervavacImg} alt="Cervavac Vaccine" className="vaccine-bottle-img" />
              </div>
              <div className="vaccine-details">
                <h4>Cervavac</h4>
                <div className="v-meta">4 HPV types</div>
                <div className="v-price">Starts from <strong>₹2,500 / dose</strong></div>
                <div className="v-source">Made in India by Serum Institute</div>
              </div>
            </div>

            {/* Gardasil 4 */}
            <div className="vaccine-card">
              <div className="vaccine-img-box">
                <Image src={gardasil4Img} alt="Gardasil 4 Vaccine" className="vaccine-bottle-img" />
              </div>
              <div className="vaccine-details">
                <h4>Gardasil 4</h4>
                <div className="v-meta">4 HPV types</div>
                <div className="v-price">Starts from <strong>₹3,500 / dose</strong></div>
                <div className="v-source">Used free in the 2026 govt. campaign</div>
              </div>
            </div>

            {/* Gardasil 9 */}
            <div className="vaccine-card">
              <div className="vaccine-img-box">
                <Image src={gardasil9Img} alt="Gardasil 9 Vaccine" className="vaccine-bottle-img" />
              </div>
              <div className="vaccine-details">
                <h4>Gardasil 9</h4>
                <div className="v-meta">9 HPV types</div>
                <div className="v-price">Starts from <strong>₹9,000 / dose</strong></div>
                <div className="v-source">Broadest protection available</div>
              </div>
            </div>
          </div>

          <p className="schedule-panel-disclaimer">
            Prices are indicative and vary by city or clinic. Under India's 2026 government campaign, Gardasil-4 is given free to 9-14-year-old girls at government health facilities.
          </p>
        </div>

        {/* Panel 3: Age-wise prevention schedule */}
        <div className="schedule-panel schedule-panel-timeline">
          <div className="panel-header-row">
            <div className="panel-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d5c46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="panel-main-title">Age-wise prevention schedule</h3>
          </div>

          <div className="timeline-horizontal">
            <div className="timeline-track-line"></div>
            
            <div className="timeline-nodes">
              {/* Node 1: 9-14 */}
              <div className="timeline-node">
                <div className="node-dot-wrapper">
                  <div className="node-dot"></div>
                  <div className="node-connector"></div>
                </div>
                <div className="node-card">
                  <div className="node-card-img-box">
                    <Image src={age9_14Img} alt="9–14 years" className="node-card-img" />
                  </div>
                  <div className="node-card-content">
                    <div className="node-card-age">9–14 years</div>
                    <p className="node-card-desc">HPV vaccine</p>
                    <p className="node-card-subdesc">(best protection)</p>
                  </div>
                </div>
              </div>

              {/* Node 2: 15-26 */}
              <div className="timeline-node">
                <div className="node-dot-wrapper">
                  <div className="node-dot"></div>
                  <div className="node-connector"></div>
                </div>
                <div className="node-card">
                  <div className="node-card-img-box">
                    <Image src={age15_26Img} alt="15–26 years" className="node-card-img" />
                  </div>
                  <div className="node-card-content">
                    <div className="node-card-age">15–26 years</div>
                    <p className="node-card-desc">Catch-up</p>
                    <p className="node-card-subdesc">HPV vaccine</p>
                  </div>
                </div>
              </div>

              {/* Node 3: 27-45 */}
              <div className="timeline-node">
                <div className="node-dot-wrapper">
                  <div className="node-dot"></div>
                  <div className="node-connector"></div>
                </div>
                <div className="node-card">
                  <div className="node-card-img-box">
                    <Image src={age27_45Img} alt="27–45 years" className="node-card-img" />
                  </div>
                  <div className="node-card-content">
                    <div className="node-card-age">27–45 years</div>
                    <p className="node-card-desc">HPV vaccine on</p>
                    <p className="node-card-subdesc">doctor's advice</p>
                  </div>
                </div>
              </div>

              {/* Node 4: 30-65 */}
              <div className="timeline-node">
                <div className="node-dot-wrapper">
                  <div className="node-dot"></div>
                  <div className="node-connector"></div>
                </div>
                <div className="node-card">
                  <div className="node-card-img-box">
                    <Image src={age30_65Img} alt="30–65 years" className="node-card-img" />
                  </div>
                  <div className="node-card-content">
                    <div className="node-card-age">30–65 years</div>
                    <p className="node-card-desc">Pap smear every 3 yrs /</p>
                    <p className="node-card-subdesc">HPV DNA test every 5 yrs</p>
                  </div>
                </div>
              </div>

              {/* Node 5: 65+ */}
              <div className="timeline-node">
                <div className="node-dot-wrapper">
                  <div className="node-dot"></div>
                  <div className="node-connector"></div>
                </div>
                <div className="node-card">
                  <div className="node-card-img-box">
                    <Image src={age65PlusImg} alt="After 65 years" className="node-card-img" />
                  </div>
                  <div className="node-card-content">
                    <div className="node-card-age">After 65 years</div>
                    <p className="node-card-desc">Screening may stop if last 10</p>
                    <p className="node-card-subdesc">years reports were normal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="schedule-panel-disclaimer">
            HPV vaccination works best before sexual activity begins. Even after vaccination, regular Pap smears remain important. It should not be taken during pregnancy.
          </p>
        </div>

        {/* Bottom Banner Bar */}
        <div className="schedule-bottom-banner">
          <div className="sbb-left">
            <div className="sbb-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Prevention today, protection for life</span>
            </div>
            <div className="sbb-actions">
              <div className="sbb-action-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Get vaccinated</span>
              </div>
              <div className="sbb-action-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Go for regular screening</span>
              </div>
              <div className="sbb-action-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span>Consult your doctor</span>
              </div>
            </div>
          </div>
          <button className="sbb-btn">
            Book your screening
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerSchedule;
