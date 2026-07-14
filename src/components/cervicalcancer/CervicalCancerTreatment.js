import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-How-cervical-cancer-is-treateds4.png';
import precancerImg from '@/assets/images/cervical cancer/Pre-cancer (early treatment).png';
import invasiveImg from '@/assets/images/cervical cancer/Invasive cancer.png';

const CervicalCancerTreatment = () => {
  return (
    <section className="treatment-section">
      <div className="treatment-container">
        
        {/* Top Header */}
        <div className="treatment-top">
          <div className="treatment-text-col">
            <span className="treatment-subtitle">IF SOMETHING IS FOUND</span>
            <h2 className="treatment-title">
              How cervical cancer is <span className="treatment-title-highlight">treated</span>
            </h2>
            <p className="treatment-desc">
              Treatment depends on the stage, cell type, and your personal health. 
              When caught early, cervical cancer is highly treatable and many 
              women go on to live long, healthy lives.
            </p>
          </div>
          <div className="treatment-img-col">
            <Image src={mainImg} alt="How cervical cancer is treated" className="treatment-main-img" />
          </div>
        </div>

        {/* Cards Wrapper */}
        <div className="treatment-cards-wrapper">
          
          {/* Pre-cancer Card */}
          <div className="treatment-card treatment-card-green">
            <div className="treatment-card-header">
              <div className="treatment-card-icon-bg bg-green-subtle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <polyline points="9 12 11 14 15 10"></polyline>
                </svg>
              </div>
              <div className="treatment-card-header-text">
                <h3 className="treatment-card-title text-green-dark">Pre-cancer (early treatment)</h3>
                <p className="treatment-card-subtitle-desc">Abnormal cells can be removed before they turn into cancer — simple, safe, and effective.</p>
              </div>
            </div>

            <div className="treatment-card-body">
              <ul className="treatment-bullet-list list-green">
                <li><strong>Cryotherapy:</strong> Freeze abnormal cells</li>
                <li><strong>LEEP / LLETZ:</strong> Remove abnormal tissue using a thin wire loop</li>
                <li><strong>Cone biopsy:</strong> Remove a cone-shaped piece of tissue</li>
                <li><strong>Close follow-up</strong></li>
              </ul>
              <div className="treatment-card-img-wrapper">
                <Image src={precancerImg} alt="Pre-cancer early treatment" className="treatment-card-img" />
              </div>
            </div>
          </div>

          {/* Invasive Cancer Card */}
          <div className="treatment-card treatment-card-orange">
            <div className="treatment-card-header">
              <div className="treatment-card-icon-bg bg-orange-subtle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <line x1="12" y1="9" x2="12" y2="15"></line>
                  <line x1="9" y1="12" x2="15" y2="12"></line>
                </svg>
              </div>
              <div className="treatment-card-header-text">
                <h3 className="treatment-card-title text-orange-dark">Invasive cancer</h3>
                <p className="treatment-card-subtitle-desc">Treatment depends on the stage. It's planned by a specialist team to give the best outcome.</p>
              </div>
            </div>

            <div className="treatment-card-body">
              <ul className="treatment-bullet-list list-orange">
                <li><strong>Surgery:</strong> To remove the cancer</li>
                <li><strong>Radiotherapy:</strong> High-energy rays to kill cancer cells</li>
                <li><strong>Chemotherapy:</strong> Medicines that kill cancer cells</li>
                <li><strong>Targeted therapy:</strong> Drugs that target specific genes or proteins</li>
                <li><strong>Immunotherapy:</strong> Helps your immune system fight cancer</li>
              </ul>
              <div className="treatment-card-img-wrapper">
                <Image src={invasiveImg} alt="Invasive cancer treatment" className="treatment-card-img" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="treatment-bottom-banner">
          <div className="tbb-left">
            <div className="tbb-icon-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <div className="tbb-text">
              <p className="tbb-desc">Every woman's journey is unique. Your doctor will recommend the right treatment for you.</p>
              <p className="tbb-highlight">Early detection makes all the difference.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerTreatment;
