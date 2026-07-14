import React from 'react';
import '@/css/visitor.css';

export default function SecurityHero() {
  const stats = [
    { value: "256-bit", label: "AES encryption" },
    { value: "99.95%", label: "Uptime SLA" },
    { value: "15 min", label: "Backup interval" },
    { value: "<24h", label: "Critical patch SLA" }
  ];

  return (
    <section className="security-hero-section">
      <div className="container">
        <div className="security-badge">Trust & Security</div>
        <h1 className="security-title">
          Patient data deserves better<br className="d-none d-md-inline" /> than "trust us".
        </h1>
        <p className="security-desc">
          Real encryption, real compliance, real audit logs — and a real list of every<br className="d-none d-md-inline" /> vendor that touches your data. Built so cautious doctors stay cautious about<br className="d-none d-md-inline" /> everything except us.
        </p>
      </div>

      <div className="security-stats-container">
        <div className="container">
          <div className="row justify-content-center align-items-center g-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3 text-center">
                <div className="security-stat-val">{stat.value}</div>
                <div className="security-stat-lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
