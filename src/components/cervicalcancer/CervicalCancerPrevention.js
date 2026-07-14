import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-Three-ways-to-protect.s7png.png';
import vaccinateImg from '@/assets/images/cervical cancer/Vaccinate.png';
import screenImg from '@/assets/images/cervical cancer/screen.png';
import treatImg from '@/assets/images/cervical cancer/Treat early.png';

const CervicalCancerPrevention = () => {
  return (
    <section className="prevention-section">
      <div className="prevention-top">
        <div className="prevention-copy">
          <span className="prevention-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            THREE WAYS TO PROTECT
          </span>
          <h2 className="prevention-title">
            Prevention works — <br />
            <span>and it’s within reach</span>
          </h2>
          <p className="prevention-text">
            Cervical cancer can be almost completely prevented when caught in time. It
            rests on <strong>three simple steps</strong> — each one saves lives.
          </p>
        </div>
        <div className="prevention-main-image">
          <Image src={mainImg} alt="Three ways to protect" className="prevention-hero-img" />
        </div>
      </div>

      <div className="prevention-card-row">
        {/* Card 1: Vaccinate */}
        <article className="prevention-card">
          <div className="prevention-card-img-wrapper">
            <Image src={vaccinateImg} alt="Vaccinate" className="prevention-card-img" />
            <div className="prevention-card-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
          </div>
          <div className="prevention-card-content">
            <h3>1. Vaccinate</h3>
            <p>
              The HPV vaccine protects against the virus types that cause most cervical cancers. It is most effective when given before sexual activity begins — girls aged 9–14 need just 2 doses.
            </p>
          </div>
        </article>

        {/* Card 2: Screen */}
        <article className="prevention-card">
          <div className="prevention-card-img-wrapper">
            <Image src={screenImg} alt="Screen" className="prevention-card-img" />
            <div className="prevention-card-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          </div>
          <div className="prevention-card-content">
            <h3>2. Screen</h3>
            <p>
              A Pap smear (every 3 years) or HPV DNA test (every 5 years) from age 30 detects abnormal cells years before cancer forms — even after vaccination.
            </p>
          </div>
        </article>

        {/* Card 3: Treat early */}
        <article className="prevention-card">
          <div className="prevention-card-img-wrapper">
            <Image src={treatImg} alt="Treat early" className="prevention-card-img" />
            <div className="prevention-card-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <line x1="12" y1="5" x2="12" y2="11"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
              </svg>
            </div>
          </div>
          <div className="prevention-card-content">
            <h3>3. Treat early</h3>
            <p>
              When changes are found early, treatment is simple and highly effective. Don't wait for symptoms — by then, the disease may be advanced.
            </p>
          </div>
        </article>
      </div>

      <div className="prevention-footer">
        <div className="prevention-footer-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prevention-footer-icon info-icon">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/>
            <path d="M10 22h4"/>
          </svg>
          <span className="prevention-footer-label">Remember:</span>
        </div>
        <div className="prevention-footer-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prevention-footer-icon">
            <path d="M18 2 22 6"></path>
            <path d="m17 7 3-3"></path>
            <path d="M16 8 8.7 15.3c-.2.2-.5.3-.7.3H5v-3c0-.3.1-.5.3-.7L12.5 4.5"></path>
            <path d="m9 11 4 4"></path>
            <path d="m5 19-3 3"></path>
            <path d="m14 4 6 6"></path>
          </svg>
          <span>Vaccinate</span>
        </div>
        <div className="prevention-footer-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prevention-footer-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Screen</span>
        </div>
        <div className="prevention-footer-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prevention-footer-icon">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Protect & Care</span>
        </div>
        <div className="prevention-footer-right">
          <span>A healthy tomorrow starts today.</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="prevention-footer-heart">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default CervicalCancerPrevention;
