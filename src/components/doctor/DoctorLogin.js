'use client';
import { useState } from 'react';

const features = [
  'Manage your appointments',
  'Set your weekly schedule',
  'Track patient history',
  'Showcase achievements',
];

const DEMO_EMAIL = 'doctor@medigrowth.com';
const DEMO_PASSWORD = 'doctor123';

export default function DoctorLogin({ onLogin }) {
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
    setTimeout(() => {
      if (form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD) {
        onLogin({ email: form.email, name: 'Dr. Priya Sharma', speciality: 'Dentist' });
      } else {
        setError('Invalid email or password. Use demo credentials below.');
        setLoading(false);
      }
    }, 1200);
  };

  const fillDemo = () => setForm({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

  return (
    <div className="doctor-login-page">
      {/* ── Left Panel ── */}
      <div className="doctor-login-left">
        <div className="doctor-login-brand">
          <div className="doctor-login-logo">👨‍⚕️</div>
          <h1 className="doctor-login-brand-title">Medi Growth</h1>
          <p className="doctor-login-brand-sub">Doctor Management Portal</p>
        </div>

        <div className="doctor-login-features">
          {features.map((f, i) => (
            <div key={i} className="doctor-login-feature-item">
              <span className="doctor-login-feature-check">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Demo Credentials */}
        <div className="doctor-login-demo-box">
          <p className="doctor-login-demo-title">🔑 Demo Credentials</p>
          <p className="doctor-login-demo-cred"><span>Email:</span>{DEMO_EMAIL}</p>
          <p className="doctor-login-demo-cred"><span>Password:</span>{DEMO_PASSWORD}</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="doctor-login-right">
        <div className="doctor-login-form-wrapper">
          <h2 className="doctor-login-title">Welcome, Doctor 👋</h2>
          <p className="doctor-login-subtitle">Login to your Doctor Panel</p>

          <form className="doctor-login-form" onSubmit={handleSubmit}>
            {error && <div className="doctor-login-error">⚠️ {error}</div>}

            <div className="doctor-login-field">
              <label htmlFor="doc-email">Email Address</label>
              <input
                id="doc-email"
                type="email"
                className="doctor-login-input"
                placeholder="doctor@medigrowth.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="doctor-login-field">
              <label htmlFor="doc-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="doc-password"
                  type={showPass ? 'text' : 'password'}
                  className="doctor-login-input"
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

            <button type="submit" className="doctor-login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Doctor Panel →'}
            </button>

            <button
              type="button"
              onClick={fillDemo}
              style={{
                background: 'none', border: '1.5px dashed #BFDBFE',
                borderRadius: '10px', padding: '10px', color: '#0284C7',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Use Demo Credentials
            </button>
          </form>

          <p className="doctor-login-footer">
            Medi Growth • Doctor Panel v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
