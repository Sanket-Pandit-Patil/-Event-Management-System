import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

export default function TimePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTime, setCustomTime] = useState(value || '09:00');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setCustomTime(value || '09:00');
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Generate 15-minute intervals
  const timePresets = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 15, 30, 45]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      timePresets.push(`${hh}:${mm}`);
    }
  }

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomTime(val);
    if (val) {
      onChange(val);
    }
  };

  const handleSelectPreset = (timeStr) => {
    setCustomTime(timeStr);
    onChange(timeStr);
    setIsOpen(false);
  };

  const formattedDisplay = dayjs(`2000-01-01 ${customTime}`).isValid()
    ? dayjs(`2000-01-01 ${customTime}`).format('hh:mm A')
    : customTime;

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <div
        className="datetime-input-box"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={15} className="text-muted" />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{formattedDisplay}</span>
        </div>
        <ChevronDown size={14} className="text-muted" />
      </div>

      {isOpen && (
        <div
          className="dropdown-menu"
          style={{
            minWidth: '180px',
            right: 0,
            left: 'auto',
            padding: '8px 0',
            zIndex: 200
          }}
        >
          {/* Custom Time Direct Input Box */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#FAFAFA' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Custom Exact Time:
            </label>
            <input
              type="time"
              value={customTime}
              onChange={handleCustomChange}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none'
              }}
            />
          </div>

          {/* 15-Minute Quick Presets List */}
          <div className="dropdown-options-list" style={{ maxHeight: '180px' }}>
            {timePresets.map((ts) => {
              const isSelected = ts === customTime;
              return (
                <div
                  key={ts}
                  className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(ts)}
                  style={{ fontSize: '13px', padding: '8px 12px' }}
                >
                  <span>{dayjs(`2000-01-01 ${ts}`).format('hh:mm A')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
