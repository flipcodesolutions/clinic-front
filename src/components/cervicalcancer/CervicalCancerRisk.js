import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-Who-Whenn3S.png';
import bottomImg from '@/assets/images/cervical cancer/eclinicpro-HPV-vaccine-imagess3.png';

const CervicalCancerRisk = () => {
  return (
    <section className="risk-section">
      <div className="risk-container">
        
        {/* Top Header */}
        <div className="risk-top">
          <div className="risk-text-col">
            <span className="risk-subtitle">WHO & WHEN</span>
            <h2 className="risk-title">
              Who is at risk, and <span className="risk-title-highlight">which ages matter</span>
            </h2>
            <p className="risk-desc">
              Any woman with a cervix can develop cervical cancer, but some factors increase the risk. 
              It occurs most often in women <strong>over the age of 30</strong> — which is why screening is 
              advised from then on, while vaccination is given much earlier, before exposure.
            </p>
          </div>
          <div className="risk-img-col">
            <div className="risk-main-img-wrapper">
              <Image src={mainImg} alt="Uterus in hands mockup" className="risk-main-img" />
            </div>
          </div>
        </div>

        {/* Middle Two Panels */}
        <div className="risk-panels-wrapper">
          
          {/* Left Panel: Higher-risk factors */}
          <div className="risk-panel risk-panel-green">
            <div className="panel-header">
              <div className="panel-icon-bg bg-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3 className="panel-title text-green">Higher-risk factors</h3>
            </div>
            
            <ul className="panel-list">
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
                </span>
                <span className="item-text">Long-lasting high-risk HPV infection</span>
              </li>
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
                <span className="item-text">Smoking</span>
              </li>
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </span>
                <span className="item-text">Weak immunity (e.g., untreated HIV)</span>
              </li>
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </span>
                <span className="item-text">Unprotected sex / multiple partners</span>
              </li>
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </span>
                <span className="item-text">Never having a Pap smear or HPV test</span>
              </li>
              <li className="panel-item">
                <span className="item-icon-circle border-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <span className="item-text">Starting sexual activity at a very young age</span>
              </li>
            </ul>
          </div>

          {/* Right Panel: Which ages matter most */}
          <div className="risk-panel risk-panel-orange">
            <div className="panel-header">
              <div className="panel-icon-bg bg-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3 className="panel-title text-orange">Which ages matter most</h3>
            </div>
            
            <div className="timeline-steps">
              <div className="timeline-step">
                <span className="step-circle border-orange">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </span>
                <div className="step-content">
                  <span className="step-age">9–14 yrs:</span> <span className="step-desc">best age for the HPV vaccine — before exposure</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <span className="step-circle border-orange">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
                <div className="step-content">
                  <span className="step-age">15–26 yrs:</span> <span className="step-desc">catch-up vaccination if not done earlier</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <span className="step-circle border-orange">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <div className="step-content">
                  <span className="step-age">30+ yrs:</span> <span className="step-desc">begin regular screening (Pap / HPV DNA)</span>
                </div>
              </div>
              
              <div className="timeline-step">
                <span className="step-circle border-orange">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </span>
                <div className="step-content">
                  <span className="step-age">30–65 yrs:</span> <span className="step-desc">the years cervical cancer is most common — keep screening</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="risk-good-news-banner">
          <div className="tgb-left">
            <div className="tgb-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d5c46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <p className="tgb-desc">
                <strong>The good news:</strong> Cervical cancer is preventable. <br />
                HPV vaccination, healthy choices, and regular screening can save lives.
              </p>
            </div>
          </div>
          <div className="tgb-right">
            <div className="tgb-img-container">
              <Image src={bottomImg} alt="HPV Vaccine syringe and vial" className="tgb-img" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerRisk;
