import React from 'react';
import '@/css/visitor.css';

const CervicalCancerReferences = () => {
  return (
    <section className="references-section">
      <div className="references-container">
        <h2 className="references-title">References & sources</h2>
        <p className="references-desc">
          The information on this page is compiled from the following public, authoritative sources. It is reviewed against official guidance, but medical knowledge evolves — always confirm with a <span style={{ whiteSpace: 'nowrap' }}>qualified doctor.</span>
        </p>

        <ul className="references-list">
          {/* Item 1 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              Press Information Bureau (PIB), Government of India — <span style={{ fontStyle: 'italic' }}>Cervical Cancer Vaccination Campaign Launched (28 Feb 2026) & cervical cancer / GLOBOCAN 2022 data</span> — <a href="https://pib.gov.in" target="_blank" rel="noopener noreferrer" className="references-link">pib.gov.in</a>
            </div>
          </li>

          {/* Item 2 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              World Health Organization — <span style={{ fontStyle: 'italic' }}>Cervical cancer fact sheet</span> — <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="references-link">who.int</a>
            </div>
          </li>

          {/* Item 3 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              National Cancer Institute (NCI), USA — <span style={{ fontStyle: 'italic' }}>Cervical cancer: types, how it develops, stages & treatment</span> — <a href="https://www.cancer.gov" target="_blank" rel="noopener noreferrer" className="references-link">cancer.gov</a>
            </div>
          </li>

          {/* Item 4 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              Centers for Disease Control and Prevention (CDC) — <span style={{ fontStyle: 'italic' }}>About cervical cancer & Basic information about HPV and cancer</span> — <a href="https://www.cdc.gov/cancer/cervical/" target="_blank" rel="noopener noreferrer" className="references-link">cdc.gov/cervical-cancer</a>, <a href="https://www.cdc.gov/hpv/" target="_blank" rel="noopener noreferrer" className="references-link">cdc.gov/cancer/hpv</a>
            </div>
          </li>

          {/* Item 5 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              National Library of Medicine (PMC) — <span style={{ fontStyle: 'italic' }}>peer-reviewed research on cervical cancer in India</span> — <a href="https://pmc.ncbi.nlm.nih.gov" target="_blank" rel="noopener noreferrer" className="references-link">pmc.ncbi.nlm.nih.gov</a>
            </div>
          </li>

          {/* Item 6 */}
          <li className="references-item">
            <span className="references-bullet">›</span>
            <div>
              GAVI, the Vaccine Alliance — <span style={{ fontStyle: 'italic' }}>Gavi and Government of India partnership</span> — <a href="https://www.gavi.org" target="_blank" rel="noopener noreferrer" className="references-link">gavi.org</a>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CervicalCancerReferences;
