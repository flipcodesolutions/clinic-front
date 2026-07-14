"use client";

import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 1200);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="container">
          <div className="legal-badge">Contact Us</div>
          <h1 className="about-hero-title">
            We'd love to <span>hear</span> from you
          </h1>
          <p className="about-hero-desc">
            Have questions about Medi Growth, need support, or want to schedule a personalized demo? Drop us a line and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-5">
            {/* Contact Details Card */}
            <div className="col-lg-5">
              <div className="contact-card-info h-100 d-flex flex-column justify-content-between">
                <div>
                  <h3 className="fw-bold text-dark mb-4">Get in Touch</h3>
                  <p className="text-secondary mb-5" style={{ lineHeight: "1.7" }}>
                    We aim to acknowledge all support and billing requests within 24 hours. For formal grievances, we resolve them within 15 days as required by law.
                  </p>

                  <div className="d-flex flex-column gap-4">
                    {/* Item 1 */}
                    <div className="d-flex gap-3 align-items-start">
                      <div className="contact-icon-box">
                        <FaEnvelope />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">Email</h6>
                        <a href="mailto:hello@medigrowth.com" className="text-secondary text-decoration-none small">
                          hello@medigrowth.com
                        </a>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="d-flex gap-3 align-items-start">
                      <div className="contact-icon-box">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">Registered Office</h6>
                        <span className="text-secondary small">
                          Ahmedabad, Gujarat, India
                        </span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="d-flex gap-3 align-items-start">
                      <div className="contact-icon-box">
                        <FaRegClock />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">Business Hours</h6>
                        <span className="text-secondary small">
                          Monday - Saturday, 9:00 AM - 6:00 PM IST
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-top">
                  <span className="text-secondary small">
                    Looking for technical documentation or billing terms? See our <a href="/terms" className="legal-link">Terms of Service</a>.
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form Card */}
            <div className="col-lg-7">
              <div className="contact-card-info h-100">
                <h3 className="fw-bold text-dark mb-4">Send a Message</h3>
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                  {/* Name field */}
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="name" className="fw-semibold text-secondary small">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-form-control"
                      placeholder="e.g. Dr. Amit Patel"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="email" className="fw-semibold text-secondary small">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-form-control"
                      placeholder="e.g. amit.patel@gmail.com"
                      required
                    />
                  </div>

                  {/* Phone field */}
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="phone" className="fw-semibold text-secondary small">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="contact-form-control"
                      placeholder="e.g. +91 98765 43210"
                    />
                  </div>

                  {/* Message field */}
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="message" className="fw-semibold text-secondary small">
                      Your Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="contact-form-control"
                      placeholder="Tell us what you're looking for..."
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-brand-green text-white py-3 rounded-pill fw-bold shadow-sm mt-2"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
