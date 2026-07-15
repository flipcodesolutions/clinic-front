'use client';
import { useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const generateSlots = (start, end) => {
  const slots = [];
  let [h, m] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  while (h < eh || (h === eh && m < em)) {
    const hour = h % 12 === 0 ? 12 : h % 12;
    const suffix = h < 12 ? 'AM' : 'PM';
    slots.push(`${hour}:${m.toString().padStart(2, '0')} ${suffix}`);
    m += 15;
    if (m >= 60) { m -= 60; h++; }
  }
  return slots;
};

const defaultSchedule = days.reduce((acc, day) => ({
  ...acc,
  [day]: { enabled: true, startTime: '09:00', endTime: '17:00' }
}), {});

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [saved, setSaved] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');

  const toggleDay = (day) => setSchedule(s => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
  const updateTime = (day, field, val) => setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: val } }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const current = schedule[activeDay];
  const slots = current.enabled ? generateSlots(current.startTime, current.endTime) : [];

  return (
    <div className="doc-schedule">
      <div className="doc-schedule-header">
        <div>
          <h1 className="doc-schedule-title">Schedule</h1>
          <p className="doc-schedule-subtitle">Set your availability — 15 min slots</p>
        </div>
        <button className={`doc-save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Schedule'}
        </button>
      </div>

      <div className="doc-schedule-grid">
        {/* Day List */}
        <div className="doc-days-card">
          <h3 className="doc-days-title">Days</h3>
          {days.map(day => (
            <div
              key={day}
              className={`doc-day-row${activeDay === day ? ' active-day' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              <div className="doc-day-left">
                <div className={`doc-day-dot ${schedule[day].enabled ? 'on' : 'off'}`} />
                <span className={`doc-day-name${activeDay === day ? ' active-day' : ''}`}>{day}</span>
              </div>
              <button
                className={`doc-day-toggle ${schedule[day].enabled ? 'on' : 'off'}`}
                onClick={e => { e.stopPropagation(); toggleDay(day); }}
              >
                {schedule[day].enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div>
          <div className="doc-timing-card">
            <h3 className="doc-timing-title">{activeDay} — Timing</h3>
            {current.enabled ? (
              <div className="doc-timing-row">
                <div>
                  <label className="doc-time-input-label">Start Time</label>
                  <input type="time" className="doc-time-input" value={current.startTime} onChange={e => updateTime(activeDay, 'startTime', e.target.value)} />
                </div>
                <div>
                  <label className="doc-time-input-label">End Time</label>
                  <input type="time" className="doc-time-input" value={current.endTime} onChange={e => updateTime(activeDay, 'endTime', e.target.value)} />
                </div>
                <div className="doc-slot-summary">
                  {slots.length} slots • 15 min each
                </div>
              </div>
            ) : (
              <div className="doc-unavailable-box">
                <div className="doc-unavailable-icon">😴</div>
                <p className="doc-unavailable-text">Not available on {activeDay}</p>
                <p className="doc-unavailable-hint">Toggle ON to enable this day</p>
              </div>
            )}
          </div>

          {current.enabled && slots.length > 0 && (
            <div className="doc-slots-card">
              <h3 className="doc-slots-title">Available Slots</h3>
              <div className="doc-slots-grid">
                {slots.map((slot, i) => (
                  <div key={i} className="doc-slot-chip">{slot}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
