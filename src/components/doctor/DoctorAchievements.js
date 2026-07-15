'use client';
import { useState } from 'react';

const initialAchievements = [
  { id: 1, title: 'Best Dentist Award', description: 'Awarded by Indian Dental Association for excellence in dental care.', year: '2023', icon: '🏆' },
  { id: 2, title: 'MDS Gold Medalist', description: 'Gold medal in Master of Dental Surgery from Mumbai University.', year: '2014', icon: '🥇' },
  { id: 3, title: '1000+ Successful Cases', description: 'Completed over 1000 successful dental procedures.', year: '2022', icon: '⭐' },
];

const icons = ['🏆', '🥇', '🥈', '⭐', '🎖️', '📜', '🔬', '💊', '🩺'];

export default function DoctorAchievements() {
  const [achievements, setAchievements] = useState(initialAchievements);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', year: '', icon: '🏆' });

  const handleAdd = () => {
    if (!form.title) return;
    setAchievements([...achievements, { ...form, id: Date.now() }]);
    setForm({ title: '', description: '', year: '', icon: '🏆' });
    setShowForm(false);
  };

  return (
    <div className="doc-achievements">
      <div className="doc-ach-header">
        <div>
          <h1 className="doc-ach-title">Achievements</h1>
          <p className="doc-ach-subtitle">{achievements.length} achievements</p>
        </div>
        <button className="doc-ach-add-btn" onClick={() => setShowForm(!showForm)}>
          + Add Achievement
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="doc-ach-form-card">
          <h3 className="doc-ach-form-title">New Achievement</h3>

          {/* Icon Picker */}
          <label className="doc-icon-picker-label">Icon</label>
          <div className="doc-icon-picker">
            {icons.map(icon => (
              <button
                key={icon}
                className={`doc-icon-btn${form.icon === icon ? ' selected' : ''}`}
                onClick={() => setForm({ ...form, icon })}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="doc-ach-form-grid">
            <div className="doc-ach-form-col-full">
              <label className="doc-label">Title *</label>
              <input className="doc-input" placeholder="Achievement title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="doc-label">Year</label>
              <input className="doc-input" placeholder="e.g. 2023" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
            </div>
            <div>
              <label className="doc-label">Description</label>
              <input className="doc-input" placeholder="Brief description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="doc-ach-form-actions">
            <button className="doc-ach-save-btn" onClick={handleAdd}>Save</button>
            <button className="doc-ach-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="doc-ach-list">
        {achievements.map(ach => (
          <div key={ach.id} className="doc-ach-card">
            <div className="doc-ach-icon">{ach.icon}</div>
            <div className="doc-ach-content">
              <div className="doc-ach-card-top">
                <h3 className="doc-ach-card-title">{ach.title}</h3>
                {ach.year && <span className="doc-ach-year-badge">{ach.year}</span>}
              </div>
              <p className="doc-ach-desc">{ach.description}</p>
            </div>
            <button
              className="doc-ach-delete-btn"
              onClick={() => setAchievements(achievements.filter(a => a.id !== ach.id))}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
