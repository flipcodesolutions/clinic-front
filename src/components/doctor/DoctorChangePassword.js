'use client';
import { useState } from 'react';
import { changeDoctorPassword } from '@/services/doctor/profileService';
import { showSuccess, showError } from '@/utils/toast';

export default function DoctorChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Real-time validation checks
  const isMinLength = formData.newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.newPassword);
  const hasNumber = /[0-9]/.test(formData.newPassword);
  const isMatched =
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.confirmPassword;
  const isMismatch =
    formData.confirmPassword.length > 0 &&
    formData.newPassword !== formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      const msg = 'New password and confirm password do not match.';
      setFeedback({ type: 'error', message: msg });
      showError(null, msg);
      return;
    }

    if (formData.newPassword.length < 6) {
      const msg = 'New password must be at least 6 characters long.';
      setFeedback({ type: 'error', message: msg });
      showError(null, msg);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      const msg = 'New password cannot be the same as current password.';
      setFeedback({ type: 'error', message: msg });
      showError(null, msg);
      return;
    }

    try {
      setLoading(true);
      const res = await changeDoctorPassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (res.success) {
        const msg = res.message || 'Password updated successfully!';
        setFeedback({ type: 'success', message: msg });
        showSuccess(msg);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const msg = res.message || 'Failed to update password.';
        setFeedback({ type: 'error', message: msg });
        showError(null, msg);
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong.';
      setFeedback({ type: 'error', message: msg });
      showError(err, msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-change-password-page">
      {/* Page Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Change Password</h1>
          <p className="admin-subtitle">
            Update your doctor account password to maintain maximum security
          </p>
        </div>
      </div>

      <div className="doc-change-password-container">
        <div className="doc-change-password-card">
          {/* Security Banner Header */}
          <div className="doc-password-card-header">
            <div className="doc-password-icon-badge">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <h2 className="doc-password-card-title">Security Credentials</h2>
              <p className="doc-password-card-desc">
                Ensure your new password is secure and not shared with anyone.
              </p>
            </div>
          </div>

          {/* Feedback Alert */}
          {feedback.message && (
            <div
              className={`doc-password-alert ${
                feedback.type === 'success' ? 'alert-success' : 'alert-error'
              }`}
            >
              <div className="doc-alert-icon">
                {feedback.type === 'success' ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                )}
              </div>
              <div className="doc-alert-text">{feedback.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="doc-password-form">
            {/* Current Password Field */}
            <div className="doc-form-group">
              <label className="admin-form-label">
                Current Password <span className="doc-required">*</span>
              </label>
              <div className="doc-input-wrapper">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="admin-input doc-password-input"
                  required
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="doc-eye-toggle-btn"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex="-1"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  title={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div className="doc-form-group">
              <label className="admin-form-label">
                New Password <span className="doc-required">*</span>
              </label>
              <div className="doc-input-wrapper">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="admin-input doc-password-input"
                  required
                  placeholder="Enter new password (min 6 characters)"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="doc-eye-toggle-btn"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex="-1"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                  title={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Requirement Badges */}
              {formData.newPassword && (
                <div className="doc-password-hints">
                  <span
                    className={`doc-hint-badge ${
                      isMinLength ? 'hint-valid' : 'hint-invalid'
                    }`}
                  >
                    {isMinLength ? '✓' : '•'} At least 6 characters
                  </span>
                  <span
                    className={`doc-hint-badge ${
                      hasUppercase ? 'hint-valid' : 'hint-neutral'
                    }`}
                  >
                    {hasUppercase ? '✓' : '•'} Uppercase letter (recommended)
                  </span>
                  <span
                    className={`doc-hint-badge ${
                      hasNumber ? 'hint-valid' : 'hint-neutral'
                    }`}
                  >
                    {hasNumber ? '✓' : '•'} Number (recommended)
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="doc-form-group">
              <label className="admin-form-label">
                Confirm New Password <span className="doc-required">*</span>
              </label>
              <div className="doc-input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`admin-input doc-password-input ${
                    isMismatch ? 'input-error' : isMatched ? 'input-success' : ''
                  }`}
                  required
                  placeholder="Re-enter your new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="doc-eye-toggle-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex="-1"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Match Status */}
              {formData.confirmPassword && (
                <div className="doc-match-status">
                  {isMatched ? (
                    <span className="doc-match-text match-success">
                      ✓ Passwords match
                    </span>
                  ) : (
                    <span className="doc-match-text match-error">
                      ✕ Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="doc-password-actions">
              <button
                type="submit"
                disabled={loading}
                className="admin-save-btn doc-password-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="doc-btn-spinner"></span>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
