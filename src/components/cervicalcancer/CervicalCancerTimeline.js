import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-Cervixs1.png';
import step1Img from '@/assets/images/cervical cancer/HPV infection.png';
import step2Img from '@/assets/images/cervical cancer/Persistent infection.png';
import step3Img from '@/assets/images/cervical cancer/Pre-cancer (dysplasia).png';
import step4Img from '@/assets/images/cervical cancer/Cervical cancer.png';

const CervicalCancerTimeline = () => {
  return (
    <section className="timeline-section">
      <div className="timeline-container">

        {/* Top Content */}
        <div className="timeline-top">
          <div className="timeline-text-col">
            <span className="timeline-subtitle">HOW IT STARTS</span>
            <h2 className="timeline-title">From a common infection to cancer — <span className="timeline-title-highlight">over many years</span></h2>
            <p className="timeline-desc">
              Cervical cancer does not appear overnight. It usually takes <strong>15–20 years</strong> for abnormal cells to slowly turn into cancer (faster — about 5–10 years — in women with weak immunity, such as untreated HIV). That long window is exactly why screening works: it catches the warning changes long before cancer forms.
            </p>
          </div>
          <div className="timeline-img-col">
            <div className="timeline-main-img-wrapper">
              <Image src={mainImg} alt="Cervical Cancer Timeline" className="timeline-main-img" />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="timeline-cards-wrapper">
          
          <div className="timeline-card">
            <div className="timeline-card-img-container">
               <Image src={step1Img} alt="HPV infection" className="timeline-card-img" />
            </div>
            <div className="timeline-card-content">
               <h3 className="timeline-card-title">HPV infection</h3>
               <p className="timeline-card-desc">A high-risk HPV type infects the cervix, usually through sexual contact. In most women, immunity clears it within ~2 years with no harm.</p>
               <div className="timeline-badge">📅 0 – 2 years</div>
            </div>
          </div>

          <div className="timeline-arrow">
            <svg width="36" height="16" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="8" x2="34" y2="8"></line>
              <polyline points="28 2 34 8 28 14"></polyline>
            </svg>
          </div>

          <div className="timeline-card">
            <div className="timeline-card-img-container">
               <Image src={step2Img} alt="Persistent infection" className="timeline-card-img" />
            </div>
            <div className="timeline-card-content">
               <h3 className="timeline-card-title">Persistent infection</h3>
               <p className="timeline-card-desc">In some women the high-risk infection does not clear and lingers for years — this is what drives the risk.</p>
               <div className="timeline-badge">📅 2 – 10 years</div>
            </div>
          </div>

          <div className="timeline-arrow">
            <svg width="36" height="16" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="8" x2="34" y2="8"></line>
              <polyline points="28 2 34 8 28 14"></polyline>
            </svg>
          </div>

          <div className="timeline-card">
            <div className="timeline-card-img-container">
               <Image src={step3Img} alt="Pre-cancer (dysplasia)" className="timeline-card-img" />
            </div>
            <div className="timeline-card-content">
               <h3 className="timeline-card-title">Pre-cancer (dysplasia)</h3>
               <p className="timeline-card-desc">Cells start to change abnormally but are <i>not yet</i> cancer. These changes are picked up by a Pap smear — and can be simply treated.</p>
               <div className="timeline-badge">📅 10 – 15 years</div>
            </div>
          </div>

          <div className="timeline-arrow">
            <svg width="36" height="16" viewBox="0 0 36 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="8" x2="34" y2="8"></line>
              <polyline points="28 2 34 8 28 14"></polyline>
            </svg>
          </div>

          <div className="timeline-card">
            <div className="timeline-card-img-container">
               <Image src={step4Img} alt="Cervical cancer" className="timeline-card-img" />
            </div>
            <div className="timeline-card-content">
               <h3 className="timeline-card-title">Cervical cancer</h3>
               <p className="timeline-card-desc">If pre-cancer is not found and treated, abnormal cells can become cancer and grow into deeper tissue over time.</p>
               <div className="timeline-badge">📅 15 – 20+ years</div>
            </div>
          </div>

        </div>

        {/* Progress Line */}
        <div className="timeline-progress-bar">
          <div className="timeline-progress-line"></div>
          <div className="timeline-points">
            <div className="timeline-point"><div className="point-dot"></div><span>0–2 yrs</span></div>
            <div className="timeline-point"><div className="point-dot"></div><span>2–10 yrs</span></div>
            <div className="timeline-point"><div className="point-dot"></div><span>10–15 yrs</span></div>
            <div className="timeline-point"><div className="point-dot"></div><span>15–20+ yrs</span></div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="timeline-good-news-banner">
          <div className="tgn-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d5c46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
            <h4 className="tgn-title">The good news</h4>
          </div>
          <p className="tgn-desc">Regular screening (Pap smear/HPV test), HPV vaccination, and early treatment can prevent almost all cervical cancers.</p>
          <div className="tgn-pills">
            <span className="tgn-pill">💉 HPV Vaccination</span>
            <span className="tgn-pill">🛡️ Regular Screening</span>
            <span className="tgn-pill">🔍 Early Detection</span>
            <span className="tgn-pill">🩺 Timely Treatment</span>
          </div>
          <p className="tgn-source">Source: WHO & National Cancer Institute (NCI). See references.</p>
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerTimeline;
