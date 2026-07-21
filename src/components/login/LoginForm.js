'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { getRedirectPath, saveUserSession } from '@/utils/auth';

const ROLE_CARDS = [
  { role: 'super_admin', icon: '👑', name: 'Super Admin', desc: 'Manage clinics, depts & services' },
  { role: 'clinic', icon: '🏥', name: 'Clinic Admin', desc: 'Manage staff, gallery & doctors' },
  { role: 'doctor', icon: '👨‍⚕️', name: 'Doctor', desc: 'Appointments, schedule & profile' },
];

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { user, token } = await login(form.email, form.password);
      const redirectPath = getRedirectPath(user.roles);

      if (!redirectPath) {
        setError('Your account role is not allowed to access any panel.');
        setLoading(false);
        return;
      }

      saveUserSession(user, token);
      router.push(redirectPath);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password.';
      setError(message);
      setLoading(false);
    }
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
              <div className="login-left-logo">👑</div>
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

            {/* Login info */}
            <div className="login-demo-section">
              <p className="login-demo-label">🔐 Secure Login</p>
              <p className="text-white-50 small mb-0">
                Sign in with your registered email and password.
                You will be redirected to your panel based on your role.
              </p>
            </div>
          </div>

          {/* ── Right Form Panel ── */}
          <div className="login-right">
            <h1 className="login-form-title">Welcome back 👋</h1>
            <p className="login-form-subtitle">
              Enter your credentials — we&apos;ll take you to your panel automatically.
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
