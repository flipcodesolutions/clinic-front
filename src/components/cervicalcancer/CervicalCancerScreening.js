import React from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import mainImg from '@/assets/images/cervical cancer/eclinicpro-Tests&screenings8.png';
import papSmearImg from '@/assets/images/cervical cancer/Pap smear.png';
import lbcImg from '@/assets/images/cervical cancer/Liquid Based Cytology (LBC).png';
import hpvDnaImg from '@/assets/images/cervical cancer/HPV DNA test.png';

const CervicalCancerScreening = () => {
  return (
    <section className="screening-section">
      <div className="screening-top">
        <div className="screening-copy">
          <span className="screening-pill">TESTS & SCREENING</span>
          <h2 className="screening-title">
            The tests that <br />
            <span>catch it early</span>
          </h2>
          <p className="screening-text">
            Screening can find abnormal cells many years before cancer develops. These
            are the tests used in India — simple, quick, and far cheaper than treating
            advanced disease.
          </p>
        </div>
        <div className="screening-main-image">
          <Image src={mainImg} alt="Tests and Screenings" className="screening-hero-img" />
        </div>
      </div>

      <div className="screening-card-row">
        {/* Card 1: Pap smear */}
        <article className="screening-card">
          <div className="screening-card-img-wrapper">
            <Image src={papSmearImg} alt="Pap smear" className="screening-card-img" />
            <div className="screening-card-badge">
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
          <div className="screening-card-content">
            <h3>Pap smear</h3>
            <p>
              A gynecologist gently collects a few cells from the cervix with a small brush (5–10 minutes). It's painless — only mild discomfort for a few seconds — and finds early abnormal changes. From age 30, every 3 years.
            </p>
          </div>
        </article>

        {/* Card 2: LBC */}
        <article className="screening-card">
          <div className="screening-card-img-wrapper">
            <Image src={lbcImg} alt="Liquid Based Cytology" className="screening-card-img" />
            <div className="screening-card-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2h12M14 2v6.2c0 .8.5 1.6 1.1 2.1l4.2 3.5c.8.7.7 2-.3 2.2H5c-1 0-1.1-1.3-.3-2.2l4.2-3.5c.6-.5 1.1-1.3 1.1-2.1V2" />
              </svg>
            </div>
          </div>
          <div className="screening-card-content">
            <h3>Liquid Based Cytology (LBC)</h3>
            <p>
              An advanced version of the Pap smear where cells are preserved in a liquid for clearer lab analysis — often giving more reliable results.
            </p>
          </div>
        </article>

        {/* Card 3: HPV DNA test */}
        <article className="screening-card">
          <div className="screening-card-img-wrapper">
            <Image src={hpvDnaImg} alt="HPV DNA test" className="screening-card-img" />
            <div className="screening-card-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 10.5C8 7 11 7 14.5 10.5S20 14 23.5 10.5" />
                <path d="M4.5 13.5C8 17 11 17 14.5 13.5S20 10 23.5 10.5" />
                <path d="M8 9.5v5M12 10.5v3M16 10.5v3M20 9.5v5" />
              </svg>
            </div>
          </div>
          <div className="screening-card-content">
            <h3>HPV DNA test</h3>
            <p>
              Detects the high-risk HPV virus itself before it has caused cell changes. From age 30, every 5 years is an option instead of a 3-yearly Pap smear.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CervicalCancerScreening;
