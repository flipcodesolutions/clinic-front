import React from 'react';
import '@/css/visitor.css';

const CervicalCancerNextSteps = () => {
  return (
    <section className="nextsteps-section">
      <div className="nextsteps-container">
        
        <span className="nextsteps-subtitle">TAKE THE NEXT STEP</span>
        <h2 className="nextsteps-title">Gynecologists in Ahmedabad</h2>
        
        <p className="nextsteps-desc">
          A regular check-up with a gynecologist is the single most important thing you can do. <br />
          Here are trusted gynecologists in Ahmedabad you can reach out to.
        </p>
        
        <p className="nextsteps-status">
          We're building our gynecologist directory. Use the button below to search across all our listed doctors.
        </p>

        <button className="nextsteps-cta-btn">
          Search more gynecologists in Ahmedabad
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div className="medical-disclaimer-footer">
          This page is for general awareness and education only and is not medical advice. Figures and costs are drawn from public health sources and may be updated over time; costs are indicative only. Always consult a qualified doctor for diagnosis, screening and treatment decisions.
        </div>

      </div>
    </section>
  );
};

export default CervicalCancerNextSteps;
