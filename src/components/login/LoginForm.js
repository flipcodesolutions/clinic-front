'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register } from '@/services/authService';
import { getRedirectPath, saveUserSession } from '@/utils/auth';

const ROLE_CARDS = [
  { role: 'super_admin', icon: '👑', name: 'Super Admin', desc: 'Manage clinics, depts & services' },
  { role: 'clinic', icon: '🏥', name: 'Clinic Admin', desc: 'Manage staff, gallery & doctors' },
  { role: 'doctor', icon: '👨‍⚕️', name: 'Doctor', desc: 'Appointments, schedule & profile' },
  { role: 'patient', icon: '👤', name: 'Patient', desc: 'Book appointments & health history' },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '';
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [regData, setRegData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (searchParams.get('tab') === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { user, token } = await login(loginData.email, loginData.password);
      saveUserSession(user, token);

      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      const redirectPath = getRedirectPath(user.roles);
      router.push(redirectPath || '/');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password.';
      setError(message);
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regData.first_name.trim()) {
      setError('Please enter your first name.');
      return;
    }
    if (!regData.phone.trim() || regData.phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!regData.password || regData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        first_name: regData.first_name.trim(),
        last_name: regData.last_name.trim() || undefined,
        phone: regData.phone.trim(),
        email: regData.email.toLowerCase().trim(),
        password: regData.password,
        roles: ['patient'],
      };

      const { user, token } = await register(payload);
      saveUserSession(user, token);

      setSuccess('Account created successfully! Redirecting...');

      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push('/');
        }
      }, 500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please check your details.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Body ── */}
      <div className="login-body">
        <div className="login-container">

          {/* ── Left Panel ── */}
          <div className="login-left d-none d-md-flex flex-column justify-content-center">

            <div className="login-left-brand">
              <div className="login-left-logo">👑</div>
              <h2 className="login-left-title">Medi Growth Portal</h2>
              <p className="login-left-subtitle">
                One unified portal for Patients, Doctors, and Clinic Administrators.
              </p>

              {/* Role cards */}
              <div className="login-roles">
                {ROLE_CARDS.map((rc) => (
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
          </div>

          {/* ── Right Form Panel ── */}
          <div className="login-right">

            {/* Tab Switcher */}
            <div className="login-tabs-nav">
              <button
                type="button"
                className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className={`login-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => handleTabChange('register')}
              >
                <span>Register</span>
                <span className="login-tab-badge">Patient</span>
              </button>
            </div>

            {/* ═══════════ TAB 1: SIGN IN ═══════════ */}
            {activeTab === 'login' && (
              <div>
                <h1 className="login-form-title">Welcome back 👋</h1>
                <p className="login-form-subtitle">
                  Enter your credentials — we&apos;ll direct you to your destination automatically.
                </p>

                <form onSubmit={handleLoginSubmit} noValidate>

                  {/* Error / Success alerts */}
                  {error && (
                    <div className="alert alert-danger login-alert d-flex align-items-center gap-2 py-2 px-3 mb-3">
                      <span>⚠️</span> <span>{error}</span>
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
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      autoComplete="email"
                      required
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
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        autoComplete="current-password"
                        required
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
                    className="login-submit-btn mb-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" /> Signing In...</>
                    ) : (
                      'Sign In →'
                    )}
                  </button>

                  <p className="login-switch-text">
                    New patient? 
                    <button
                      type="button"
                      className="login-switch-btn"
                      onClick={() => handleTabChange('register')}
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              </div>
            )}

            {/* ═══════════ TAB 2: REGISTER (PATIENT) ═══════════ */}
            {activeTab === 'register' && (
              <div>
                <h1 className="login-form-title mb-4">Create Patient Account</h1>

                <form onSubmit={handleRegisterSubmit} noValidate>

                  {/* Alerts */}
                  {error && (
                    <div className="alert alert-danger login-alert d-flex align-items-center gap-2 py-2 px-3 mb-3">
                      <span>⚠️</span> <span>{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="alert alert-success login-alert d-flex align-items-center gap-2 py-2 px-3 mb-3">
                      <span>✅</span> <span>{success}</span>
                    </div>
                  )}

                  {/* Names (2 columns) */}
                  <div className="login-form-row mb-3">
                    <div>
                      <label className="login-form-label">First Name *</label>
                      <input
                        type="text"
                        className="form-control login-input"
                        placeholder="e.g. Rahul"
                        value={regData.first_name}
                        onChange={(e) => setRegData({ ...regData, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="login-form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control login-input"
                        placeholder="e.g. Patel"
                        value={regData.last_name}
                        onChange={(e) => setRegData({ ...regData, last_name: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Phone & Email (2 columns) */}
                  <div className="login-form-row mb-3">
                    <div>
                      <label className="login-form-label">Mobile Number *</label>
                      <input
                        type="tel"
                        className="form-control login-input"
                        placeholder="10-digit number"
                        maxLength={10}
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="login-form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control login-input"
                        placeholder="your@email.com"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="login-form-label">Password *</label>
                    <div className="input-group">
                      <input
                        type={showPass ? 'text' : 'password'}
                        className="form-control login-input border-end-0"
                        placeholder="Create a password (min. 6 chars)"
                        value={regData.password}
                        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        required
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
                    className="login-submit-btn mb-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" /> Registering...</>
                    ) : (
                      'Create Account & Sign In →'
                    )}
                  </button>

                  <p className="login-switch-text">
                    Already have an account? 
                    <button
                      type="button"
                      className="login-switch-btn"
                      onClick={() => handleTabChange('login')}
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginForm(props) {
  return (
    <Suspense fallback={<div className="panel-loading">Loading portal...</div>}>
      <LoginFormContent {...props} />
    </Suspense>
  );
}

