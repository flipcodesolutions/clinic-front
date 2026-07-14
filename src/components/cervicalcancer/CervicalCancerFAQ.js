"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import '@/css/visitor.css';

import faqImg from '@/assets/images/cervical cancer/eclinicpro-Frequently-asked-questionss10.png';

const faqData = [
  {
    id: 1,
    category: 'about',
    question: 'What is cervical cancer and what causes it?',
    answer: 'Cervical cancer is a cancer that starts in the cervix, the lower part of the uterus that connects to the vagina. Almost all cases (~99%) are caused by long-lasting infection with high-risk types of Human Papillomavirus (HPV), a very common virus transmitted through intimate skin-to-skin contact.'
  },
  {
    id: 2,
    category: 'about',
    question: 'How common is cervical cancer in India?',
    answer: 'In India, cervical cancer is the second most common cancer among women, accounting for nearly 1.2 lakh new cases and about 80,000 deaths every year. Approximately 25% of the world\'s cervical cancer deaths occur in India, meaning 1 in 5 patients globally is Indian.'
  },
  {
    id: 3,
    category: 'about',
    question: 'Can cervical cancer be prevented?',
    answer: 'Yes! Cervical cancer is one of the most preventable cancers. It can be prevented through HPV vaccination (ideally given between ages 9–14) and regular screening (Pap smears or HPV DNA tests) to find and treat pre-cancerous changes before they develop into cancer.'
  },
  {
    id: 4,
    category: 'about',
    question: 'How long does cervical cancer take to develop?',
    answer: 'Cervical cancer develops very slowly. It usually takes 15–20 years for a persistent high-risk HPV infection to turn normal cervical cells into cancer. This long window provides ample opportunity for screening to detect changes and intervene early.'
  },
  {
    id: 5,
    category: 'about',
    question: 'What are the early warning signs?',
    answer: 'Early cervical pre-cancer and early stage cancer usually have no symptoms at all. As it advances, symptoms can include abnormal vaginal bleeding (after sex, between periods, or after menopause), unusual vaginal discharge, and pelvic pain. This is why screening is vital before symptoms appear.'
  },
  {
    id: 6,
    category: 'about',
    question: 'Who is at higher risk?',
    answer: 'Women at higher risk include those with persistent high-risk HPV infections, who smoke (which makes it harder for the body to clear HPV), have weak immunity (like untreated HIV), started sexual activity at a young age, or have never had a screening test.'
  },
  {
    id: 7,
    category: 'about',
    question: 'How is cervical cancer treated, and can it be cured?',
    answer: 'Yes, it can be cured, especially when caught early. Treatment depends on the stage and includes pre-cancer procedures (cryotherapy, LEEP to freeze/remove abnormal cells) or surgery, radiotherapy, and chemotherapy for invasive cancer.'
  },
  {
    id: 8,
    category: 'screening',
    question: 'What screening tests are available, and do they hurt?',
    answer: 'The primary screening tests are the Pap smear (collecting surface cells) and the HPV DNA test (checking for the virus). They are quick, taking about 5–10 minutes, and generally do not hurt. You may feel mild pressure or minor cramping for a few seconds.'
  },
  {
    id: 9,
    category: 'vaccine',
    question: 'What is India\'s HPV Vaccination Campaign launched in 2026?',
    answer: 'Launched on 28 February 2026, the campaign is a nationwide government program providing free Gardasil-4 vaccines to approximately 1.15 crore 14-year-old girls at government facilities and schools to eliminate HPV risk in future generations.'
  },
  {
    id: 10,
    category: 'vaccine',
    question: 'If I have had the HPV vaccine, do I still need screening?',
    answer: 'Yes. While the HPV vaccine provides outstanding protection against the most common cancer-causing types, it does not prevent all HPV types. Therefore, regular screening remains essential from age 30 onwards, even for vaccinated women.'
  }
];

const CervicalCancerFAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(1); // Set the first one open by default

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="faq-section">
      <div className="faq-container">

        {/* Left Side Info and Image */}
        <div className="faq-left-col">
          <span className="faq-subtitle">QUESTIONS ANSWERED</span>
          <h2 className="faq-title">Frequently asked questions</h2>
          <p className="faq-desc">
            Find answers to common questions about cervical cancer, screening tests, and HPV vaccination.
          </p>

          <div className="faq-img-card">
            <Image src={faqImg} alt="Doctor explaining cervical cancer FAQ" className="faq-illustration" />
            <div className="faq-info-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5" className="alert-check-icon">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <p>Early screening, timely vaccination and awareness can help prevent cervical cancer.</p>
            </div>
          </div>
        </div>

        {/* Right Side Search and Accordions */}
        <div className="faq-right-col">

          {/* Search Box */}
          <div className="faq-search-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="faq-search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="faq-categories-row">
            <button
              className={`faq-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              All Questions
            </button>
            <button
              className={`faq-cat-pill ${activeCategory === 'about' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('about')}
            >
              About Cervical Cancer
            </button>
            <button
              className={`faq-cat-pill ${activeCategory === 'screening' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('screening')}
            >
              Screening Tests
            </button>
            <button
              className={`faq-cat-pill ${activeCategory === 'vaccine' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('vaccine')}
            >
              HPV Vaccine
            </button>
          </div>

          {/* Accordion List */}
          <div className="faq-accordion-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openId === faq.id;
                const displayNum = String(index + 1).padStart(2, '0');

                return (
                  <div key={faq.id} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                    <button className="faq-accordion-trigger" onClick={() => toggleAccordion(faq.id)}>
                      <span className="faq-item-number">{displayNum}</span>
                      <span className="faq-item-question">{faq.question}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="faq-arrow-icon">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                    <div className="faq-accordion-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="faq-no-results">
                No questions found matching your search.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

export default CervicalCancerFAQ;
