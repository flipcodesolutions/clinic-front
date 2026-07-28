'use client';
import { useState } from 'react';
import { changeClinicPassword } from '@/services/clinic/profileService';

export default function ChangePasswordManager() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setLoading(true);
      const res = await changeClinicPassword(formData.currentPassword, formData.newPassword);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Password changed successfully!' });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to update password.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clinic-change-password-manager clinic-change-password-wrapper">
      {/* Header */}
      <div className="clinic-header">
        <div>
          <h1 className="clinic-title">Change Account Password</h1>
          <p className="clinic-subtitle">Update your Clinic Administrator login password for security.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="clinic-table-card clinic-change-password-card">
        {feedback.message && (
          <div className={`clinic-change-password-alert ${feedback.type}`}>
            {feedback.type === 'success' ? '✅ ' : '⚠️ '}
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="clinic-form-group">
            <label>Current Password *</label>
            <input
              type="password"
              className="clinic-form-control"
              required
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            />
          </div>

          <div className="clinic-form-group">
            <label>New Password *</label>
            <input
              type="password"
              className="clinic-form-control"
              required
              placeholder="Enter new password (min 6 characters)"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>

          <div className="clinic-form-group">
            <label>Confirm New Password *</label>
            <input
              type="password"
              className="clinic-form-control"
              required
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="clinic-change-password-btn-wrap">
            <button
              type="submit"
              disabled={loading}
              className="clinic-btn clinic-btn-primary clinic-change-password-submit-btn"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
