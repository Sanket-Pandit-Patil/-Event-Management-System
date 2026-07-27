import React, { useState, useEffect, useRef } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useEventStore } from '../store/eventStore';
import { TIMEZONES, extractDateAndTimeInTimezone, combineDateAndTimeToUTC } from '../utils/timezone';
import { filterProfilesByQuery } from '../utils/dsa';
import { X, ChevronDown, Calendar, Plus, Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import TimePicker from './TimePicker';
import dayjs from 'dayjs';

export default function EditEventModal({ event, onClose }) {
  const { profiles, createProfile } = useProfileStore();
  const { updateEvent } = useEventStore();

  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('Eastern Time (ET)');

  const [startDateStr, setStartDateStr] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endDateStr, setEndDateStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('10:00');

  // Popovers
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileSearch, setProfileSearch] = useState('');
  const [showAddProfileInline, setShowAddProfileInline] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const [showTzDropdown, setShowTzDropdown] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const [currentStartMonth, setCurrentStartMonth] = useState(dayjs());
  const [currentEndMonth, setCurrentEndMonth] = useState(dayjs());

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const profileRef = useRef(null);
  const tzRef = useRef(null);
  const startCalRef = useRef(null);
  const endCalRef = useRef(null);

  useEffect(() => {
    if (event) {
      const tz = event.timezone || 'Eastern Time (ET)';
      setSelectedTimezone(tz);
      setSelectedProfiles(event.profiles || []);

      const startExtracted = extractDateAndTimeInTimezone(event.startTime, tz);
      setStartDateStr(startExtracted.dateStr);
      setStartTimeStr(startExtracted.timeStr);
      if (startExtracted.dateStr) {
        setCurrentStartMonth(dayjs(startExtracted.dateStr));
      }

      const endExtracted = extractDateAndTimeInTimezone(event.endTime, tz);
      setEndDateStr(endExtracted.dateStr);
      setEndTimeStr(endExtracted.timeStr);
      if (endExtracted.dateStr) {
        setCurrentEndMonth(dayjs(endExtracted.dateStr));
      }
    }
  }, [event]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
        setShowAddProfileInline(false);
      }
      if (tzRef.current && !tzRef.current.contains(e.target)) {
        setShowTzDropdown(false);
      }
      if (startCalRef.current && !startCalRef.current.contains(e.target)) {
        setShowStartCalendar(false);
      }
      if (endCalRef.current && !endCalRef.current.contains(e.target)) {
        setShowEndCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleProfileSelection = (profile) => {
    if (selectedProfiles.some((p) => p._id === profile._id)) {
      setSelectedProfiles(selectedProfiles.filter((p) => p._id !== profile._id));
    } else {
      setSelectedProfiles([...selectedProfiles, profile]);
    }
  };

  const handleCreateNewProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    try {
      setError('');
      const created = await createProfile(newProfileName.trim());
      setSelectedProfiles((prev) => [...prev, created]);
      setNewProfileName('');
      setShowAddProfileInline(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile.');
      return;
    }

    const startUTC = combineDateAndTimeToUTC(startDateStr, startTimeStr, selectedTimezone);
    const endUTC = combineDateAndTimeToUTC(endDateStr, endTimeStr, selectedTimezone);

    if (endUTC < startUTC) {
      setError('End date/time cannot be in the past relative to the selected start date/time.');
      return;
    }

    try {
      setSubmitting(true);
      await updateEvent(event._id, {
        profiles: selectedProfiles.map((p) => p._id),
        timezone: selectedTimezone,
        startTime: startUTC.toISOString(),
        endTime: endUTC.toISOString()
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderCalendar = (monthDayJs, onSelectDate, selectedDateStr, onSelectMonth) => {
    const startOfMonth = monthDayJs.startOf('month');
    const daysInMonth = monthDayJs.daysInMonth();
    const startDayOfWeek = startOfMonth.day();

    const prevMonth = monthDayJs.subtract(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();

    const days = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push({
        dateStr: prevMonth.date(dayNum).format('YYYY-MM-DD'),
        dayNum,
        isCurrentMonth: false,
        targetMonth: prevMonth
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        dateStr: monthDayJs.date(d).format('YYYY-MM-DD'),
        dayNum: d,
        isCurrentMonth: true,
        targetMonth: monthDayJs
      });
    }

    const totalCells = days.length > 35 ? 42 : 35;
    const nextMonth = monthDayJs.add(1, 'month');
    const remaining = totalCells - days.length;
    for (let n = 1; n <= remaining; n++) {
      days.push({
        dateStr: nextMonth.date(n).format('YYYY-MM-DD'),
        dayNum: n,
        isCurrentMonth: false,
        targetMonth: nextMonth
      });
    }

    return (
      <div className="datepicker-popover">
        <div className="datepicker-header">
          <button 
            type="button" 
            className="datepicker-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMonth(monthDayJs.subtract(1, 'month'));
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span>{monthDayJs.format('MMMM YYYY')}</span>
          <button 
            type="button" 
            className="datepicker-nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMonth(monthDayJs.add(1, 'month'));
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dh) => (
            <div key={dh} className="calendar-day-head">{dh}</div>
          ))}
          {days.map((item, idx) => {
            const isSelected = item.dateStr === selectedDateStr;
            return (
              <div
                key={idx}
                className={`calendar-day-cell ${!item.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDate(item.dateStr);
                  if (!item.isCurrentMonth) {
                    onSelectMonth(item.targetMonth);
                  }
                }}
              >
                {item.dayNum}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredProfiles = filterProfilesByQuery(profiles, profileSearch);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Event</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="alert-error">{error}</div>}

            {/* Profiles */}
            <div className="form-group" ref={profileRef}>
              <label className="form-label">Profiles</label>
              <div
                className={`custom-select-trigger ${showProfileDropdown ? 'active' : ''}`}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <span>
                  {selectedProfiles.length === 0
                    ? 'Select profiles...'
                    : selectedProfiles.length === 1
                    ? selectedProfiles[0].name
                    : `${selectedProfiles.length} profiles selected`}
                </span>
                <ChevronDown size={16} />
              </div>

              {showProfileDropdown && (
                <div className="dropdown-menu">
                  <div className="search-input-wrapper">
                    <Search size={14} className="text-muted" />
                    <input
                      type="text"
                      placeholder="Search profiles..."
                      value={profileSearch}
                      onChange={(e) => setProfileSearch(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className="dropdown-options-list">
                    {filteredProfiles.map((p) => {
                      const isSelected = selectedProfiles.some((sp) => sp._id === p._id);
                      return (
                        <div
                          key={p._id}
                          className={`dropdown-option ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleProfileSelection(p)}
                        >
                          <span>{p.name}</span>
                          {isSelected && <Check size={14} />}
                        </div>
                      );
                    })}
                  </div>

                  {!showAddProfileInline ? (
                    <div
                      className="add-profile-option"
                      onClick={() => setShowAddProfileInline(true)}
                    >
                      <Plus size={14} />
                      <span>Add Profile</span>
                    </div>
                  ) : (
                    <form className="add-profile-inline-form" onSubmit={handleCreateNewProfile}>
                      <input
                        type="text"
                        placeholder="Enter profile name"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        autoFocus
                      />
                      <button type="submit">Add</button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Timezone */}
            <div className="form-group" ref={tzRef}>
              <label className="form-label">Timezone</label>
              <div
                className={`custom-select-trigger ${showTzDropdown ? 'active' : ''}`}
                onClick={() => setShowTzDropdown(!showTzDropdown)}
              >
                <span>{selectedTimezone}</span>
                <ChevronDown size={16} />
              </div>

              {showTzDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-options-list">
                    {TIMEZONES.map((tz) => (
                      <div
                        key={tz.label}
                        className={`dropdown-option ${selectedTimezone === tz.label ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedTimezone(tz.label);
                          setShowTzDropdown(false);
                        }}
                      >
                        <span>{tz.label}</span>
                        {selectedTimezone === tz.label && <Check size={14} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start Date & Time */}
            <div className="form-group">
              <label className="form-label">Start Date & Time</label>
              <div className="datetime-row">
                <div className="form-group" style={{ margin: 0, position: 'relative' }} ref={startCalRef}>
                  <div
                    className="datetime-input-box"
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                  >
                    <Calendar size={16} className="text-muted" />
                    <span>
                      {startDateStr
                        ? dayjs(startDateStr).format('MMMM D, YYYY')
                        : 'Pick a date'}
                    </span>
                  </div>
                  {showStartCalendar &&
                    renderCalendar(
                      currentStartMonth,
                      (dStr) => {
                        setStartDateStr(dStr);
                        setShowStartCalendar(false);
                      },
                      startDateStr,
                      (newMonth) => setCurrentStartMonth(newMonth)
                    )}
                </div>

                <div>
                  <TimePicker value={startTimeStr} onChange={setStartTimeStr} />
                </div>
              </div>
            </div>

            {/* End Date & Time */}
            <div className="form-group">
              <label className="form-label">End Date & Time</label>
              <div className="datetime-row">
                <div className="form-group" style={{ margin: 0, position: 'relative' }} ref={endCalRef}>
                  <div
                    className="datetime-input-box"
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                  >
                    <Calendar size={16} className="text-muted" />
                    <span>
                      {endDateStr
                        ? dayjs(endDateStr).format('MMMM D, YYYY')
                        : 'Pick a date'}
                    </span>
                  </div>
                  {showEndCalendar &&
                    renderCalendar(
                      currentEndMonth,
                      (dStr) => {
                        setEndDateStr(dStr);
                        setShowEndCalendar(false);
                      },
                      endDateStr,
                      (newMonth) => setCurrentEndMonth(newMonth)
                    )}
                </div>

                <div>
                  <TimePicker value={endTimeStr} onChange={setEndTimeStr} />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto', margin: 0 }} disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
