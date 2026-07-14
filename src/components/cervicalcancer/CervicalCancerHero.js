import React from 'react';
import '@/css/visitor.css';

const CervicalCancerHero = () => {
  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="awareness-pill">
          <span>🎗️</span> Cervical Cancer Awareness - Vaccination Campaign Launched
        </div>
        <h1 className="hero-title">
          Cervical cancer is one of the most preventable cancers — let's end it together.
        </h1>
        <p className="hero-description">
          Almost all cervical cancers are caused by HPV, and almost all can be prevented through vaccination and regular screening. Know the facts, understand India's national programme, and take the next step for the women you love.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary">Find a gynecologist near you</button>
          <button className="btn-secondary">Tests & screening</button>
        </div>
      </div>
      <div className="hero-video">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Cervical Cancer Awareness"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default CervicalCancerHero;
