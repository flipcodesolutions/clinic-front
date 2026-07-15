'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─────────────────────────────────────────────────────────────
   MOCK USER DATABASE
   Once the real backend is ready, replace this with a real API call.
   The user role will be fetched from the database, and the frontend will redirect accordingly.
───────────────────────────────────────────────────────────── */
const MOCK_USERS = [
  {
    email: 'clinic@medigrowth.com',
    password: 'clinic123',
    role: 'clinic',
    name: 'HealthCare Plus Clinic',
  },
  {
    email: 'doctor@medigrowth.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Priya Sharma',
  },
];

const ROLE_REDIRECT = {
  clinic: '/clinic-panel',
  doctor: '/doctor-panel',
};

const DEMO_USERS = {
  clinic: { email: 'clinic@medigrowth.com', password: 'clinic123' },
  doctor: { email: 'doctor@medigrowth.com', password: 'doctor123' },
};

const ROLE_CARDS = [
  { role: 'clinic', icon: '🏥', name: 'Clinic Admin', desc: 'Manage staff, gallery & doctors' },
  { role: 'doctor', icon: '👨‍⚕️', name: 'Doctor', desc: 'Appointments, schedule & profile' },
];

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [demoTab, setDemoTab] = useState('clinic'); // active demo tab

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    /* ── Simulate API call (replace with real fetch later) ── */
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email === form.email && u.password === form.password
      );

      if (user) {
        // Save session with role
        localStorage.setItem('user_auth', JSON.stringify({
          email: user.email,
          role: user.role,
          name: user.name,
        }));
        // Redirect based on role
        router.push(ROLE_REDIRECT[user.role]);
      } else {
        setError('Invalid email or password. Only registered users can login.');
        setLoading(false);
      }
    }, 1000);
  };

  const autofill = () => {
    setForm({ email: DEMO_USERS[demoTab].email, password: DEMO_USERS[demoTab].password });
    setError('');
  };

  return (
    <div className="login-page">

      {/* ── Top Navbar ── */}
      <nav className="navbar navbar-light bg-white border-bottom py-3 px-4">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-decoration-none">
          <div className="login-nav-logo">
            <span className="login-nav-plus">+</span>
          </div>
          <span>
            <span className="login-nav-brand-green">Medi </span>
            <span className="login-nav-brand-dark">Growth</span>
          </span>
        </Link>
        <span className="text-muted small">Role-based access portal</span>
      </nav>

      {/* ── Body ── */}
      <div className="login-body">
        <div className="login-container">

          {/* ── Left Panel ── */}
          <div className="login-left d-none d-md-flex flex-column justify-content-between">

            <div className="login-left-brand">
              <div className="login-left-logo">🏥</div>
              <h2 className="login-left-title">Medi Growth Portal</h2>
              <p className="login-left-subtitle">
                One login for all roles — the system automatically directs you to your panel.
              </p>

              {/* Role cards */}
              <div className="login-roles">
                {ROLE_CARDS.map(rc => (
                  <div key={rc.role} className="login-role-card">
                    <span className="login-role-card-icon">{rc.icon}</span>
                    <div>
                      <p className="login-role-card-name">{rc.name}</p>
                      <p className="login-role-card-desc">{rc.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo credentials */}
            <div className="login-demo-section">
              <p className="login-demo-label">🔑 Demo Credentials</p>

              {/* Tab selector */}
              <div className="login-demo-tabs">
                {['clinic', 'doctor'].map(tab => (
                  <button
                    key={tab}
                    className={`login-demo-tab${demoTab === tab ? ' active' : ''}`}
                    onClick={() => setDemoTab(tab)}
                  >
                    {tab === 'clinic' ? '🏥 Clinic' : '👨‍⚕️ Doctor'}
                  </button>
                ))}
              </div>

              <div className="login-demo-row">
                <span className="login-demo-key">Email</span>
                <code className="login-demo-val">{DEMO_USERS[demoTab].email}</code>
              </div>
              <div className="login-demo-row">
                <span className="login-demo-key">Pass</span>
                <code className="login-demo-val">{DEMO_USERS[demoTab].password}</code>
              </div>

              <button className="login-autofill-btn" onClick={autofill}>
                ⚡ Auto-fill {demoTab === 'clinic' ? 'Clinic' : 'Doctor'} Credentials
              </button>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="login-right">
            <h1 className="login-form-title">Welcome back 👋</h1>
            <p className="login-form-subtitle">
              Enter your credentials — we'll take you to your panel automatically.
            </p>

            <form onSubmit={handleSubmit} noValidate>

              {/* Error */}
              {error && (
                <div className="alert alert-danger login-alert d-flex align-items-center gap-2 py-2 px-3 mb-3">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* Email */}
              <div className="mb-3">
                <label htmlFor="login-email" className="login-form-label">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control login-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="login-password" className="login-form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-control login-input border-end-0"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary login-eye-btn border-start-0"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-submit-btn mb-3"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" /> Verifying...</>
                  : 'Sign In →'
                }
              </button>

              {/* Info text */}
              <p className="text-center text-muted small mb-0">
                Your role is detected automatically from our system.
                <br />Unauthorised users cannot access any panel.
              </p>
            </form>

            <p className="login-footer-note">
              Medi Growth © 2026 · Secure Role-Based Access
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
