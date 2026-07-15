'use client';
import { useState } from 'react';

const features = [
  'Manage your clinic staff',
  'Upload gallery photos',
  'Track doctors & appointments',
  'Update clinic information',
];

// Demo credentials
const DEMO_EMAIL = 'clinic@medigrowth.com';
const DEMO_PASSWORD = 'clinic123';

export default function ClinicLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD) {
        onLogin({ email: form.email, clinicName: 'HealthCare Plus Clinic' });
      } else {
        setError('Invalid email or password. Use demo credentials below.');
        setLoading(false);
      }
    }, 1200);
  };

  const fillDemo = () => setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

  return (
    <div className="clinic-login-page">
      {/* ── Left Panel ── */}
      <div className="clinic-login-left">
        <div className="clinic-login-brand">
          <div className="clinic-login-logo">🏥</div>
          <h1 className="clinic-login-brand-title">Medi Growth</h1>
          <p className="clinic-login-brand-sub">Clinic Management Portal</p>
        </div>

        <div className="clinic-login-features">
          {features.map((f, i) => (
            <div key={i} className="clinic-login-feature-item">
              <span className="clinic-login-feature-check">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Demo Credentials Box */}
        <div className="clinic-login-demo-box">
          <p className="clinic-login-demo-title">🔑 Demo Credentials</p>
          <p className="clinic-login-demo-cred"><span>Email:</span>{DEMO_EMAIL}</p>
          <p className="clinic-login-demo-cred"><span>Password:</span>{DEMO_PASSWORD}</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="clinic-login-right">
        <div className="clinic-login-form-wrapper">
          <h2 className="clinic-login-title">Welcome Back 👋</h2>
          <p className="clinic-login-subtitle">Login to your Clinic Panel</p>

          <form className="clinic-login-form" onSubmit={handleSubmit}>
            {/* Error */}
            {error && <div className="clinic-login-error">⚠️ {error}</div>}

            {/* Email */}
            <div className="clinic-login-field">
              <label htmlFor="clinic-email">Email Address</label>
              <input
                id="clinic-email"
                type="email"
                className="clinic-login-input"
                placeholder="clinic@medigrowth.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="clinic-login-field">
              <label htmlFor="clinic-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="clinic-password"
                  type={showPass ? 'text' : 'password'}
                  className="clinic-login-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: '16px',
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="clinic-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Clinic Panel →'}
            </button>

            {/* Demo fill */}
            <button
              type="button"
              onClick={fillDemo}
              style={{
                background: 'none', border: '1.5px dashed #DDD6FE',
                borderRadius: '10px', padding: '10px', color: '#7C3AED',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Use Demo Credentials
            </button>
          </form>

          <p className="clinic-login-footer">
            Medi Growth • Clinic Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
