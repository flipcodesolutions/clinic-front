import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/main.png';
import formImg from '@/assets/images/cervical cancer/where it form.png';
import maintypeImg from '@/assets/images/cervical cancer/maintype.png';
import causeImg from '@/assets/images/cervical cancer/the cauase.png';
import goodNewsRightImg from '@/assets/images/cervical cancer/eclinicpro-The-good-news-right.png';

const CervicalCancerBasics = () => {
  return (
    <section className="basics-section">
      <div className="basics-container">
        
        {/* Top Content */}
        <div className="basics-top">
          <div className="basics-text-col">
            <span className="basics-subtitle">THE BASICS</span>
            <h2 className="basics-title">What is <br/> <span className="basics-title-highlight">Cervical Cancer?</span></h2>
            <p className="basics-desc">
              Cervical cancer begins in the <strong>cervix</strong> — the lower, narrow part of the uterus (womb)
              that connects to the vagina. It happens when cells in the cervix begin to grow out of
              control. The good news: because it grows slowly and has clear warning signs under a
              microscope, it is one of the most preventable and, when caught early, most treatable
              cancers.
            </p>
          </div>
          <div className="basics-img-col">
            <Image src={mainImg} alt="Cervical Cancer" className="basics-main-img" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="basics-cards-wrapper">
          
          <div className="basics-card">
            <div className="basics-card-left">
               <span className="basics-card-number">01</span>
               <Image src={formImg} alt="Where it forms" className="basics-card-img" />
            </div>
            <div className="basics-card-right">
               <h3 className="basics-card-title">Where it forms</h3>
               <p className="basics-card-desc">In the cervix — the "gateway" between the uterus and the vagina. Changes usually begin in the surface cells lining the cervix.</p>
            </div>
          </div>

          <div className="basics-card">
            <div className="basics-card-left">
               <span className="basics-card-number">02</span>
               <Image src={maintypeImg} alt="Main type" className="basics-card-img" />
            </div>
            <div className="basics-card-right">
               <h3 className="basics-card-title">Main type</h3>
               <p className="basics-card-desc">Squamous cell carcinoma makes up most cases (up to ~90%); adenocarcinoma starts in the inner glandular cells.</p>
            </div>
          </div>

          <div className="basics-card">
            <div className="basics-card-left">
               <span className="basics-card-number">03</span>
               <Image src={causeImg} alt="The cause" className="basics-card-img" />
            </div>
            <div className="basics-card-right">
               <h3 className="basics-card-title">The cause</h3>
               <p className="basics-card-desc">Almost all cases are caused by long-lasting infection with high-risk <strong>HPV</strong> — making it the only cancer that a vaccine can prevent.</p>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="basics-good-news-banner">
          <div className="bgn-left">
            <div className="bgn-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d5c46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            </div>
            <div>
              <h4 className="bgn-title">The good news</h4>
              <p className="bgn-desc">Regular screening, HPV vaccination, and early treatment can prevent most cervical cancers.</p>
            </div>
          </div>
          <div className="bgn-right">
             <Image src={goodNewsRightImg} alt="The good news" className="bgn-right-img" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerBasics;
