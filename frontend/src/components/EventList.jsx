import React, { useState, useRef, useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { useViewTimezoneStore } from '../store/viewTimezoneStore';
import { TIMEZONES } from '../utils/timezone';
import { detectEventOverlaps } from '../utils/dsa';
import EventCard from './EventCard';
import { ChevronDown, Check } from 'lucide-react';

export default function EventList({ onEditEvent, onViewLogsEvent }) {
  const { events, loading, error } = useEventStore();
  const { viewTimezone, setViewTimezone } = useViewTimezoneStore();

  const [showTzDropdown, setShowTzDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowTzDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const overlappingIds = detectEventOverlaps(events);

  return (
    <div className="card">
      <h2 className="card-title">Events</h2>

      <div className="events-view-header">
        <div className="form-group" style={{ margin: 0, position: 'relative' }} ref={dropdownRef}>
          <label className="form-label">View in Timezone</label>
          <div
            className={`custom-select-trigger ${showTzDropdown ? 'active' : ''}`}
            onClick={() => setShowTzDropdown(!showTzDropdown)}
          >
            <span>{viewTimezone}</span>
            <ChevronDown size={16} />
          </div>

          {showTzDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-options-list">
                {TIMEZONES.map((tz) => (
                  <div
                    key={tz.label}
                    className={`dropdown-option ${viewTimezone === tz.label ? 'selected' : ''}`}
                    onClick={() => {
                      setViewTimezone(tz.label);
                      setShowTzDropdown(false);
                    }}
                  >
                    <span>{tz.label}</span>
                    {viewTimezone === tz.label && <Check size={14} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-events-container">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-events-container">No events found</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isOverlapping={overlappingIds.has(event._id)}
              onEdit={onEditEvent}
              onViewLogs={onViewLogsEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
