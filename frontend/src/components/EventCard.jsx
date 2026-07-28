import React from 'react';
import { Users, Calendar, Clock, Edit, FileText, AlertTriangle } from 'lucide-react';
import { formatInTimezone, formatDateOnly, formatTimeOnly } from '../utils/timezone';
import { useViewTimezoneStore } from '../store/viewTimezoneStore';

export default function EventCard({ event, isOverlapping, onEdit, onViewLogs }) {
  const { viewTimezone } = useViewTimezoneStore();

  const profileNames = event.profiles ? event.profiles.map((p) => p.name).join(', ') : 'No profiles';

  return (
    <div className="event-card">
      <div className="event-card-profiles">
        <Users size={16} className="text-muted" />
        <span>{profileNames}</span>
      </div>

      {isOverlapping && (
        <div className="conflict-badge">
          <AlertTriangle size={12} />
          <span>Schedule Overlap Detected</span>
        </div>
      )}

      <div className="event-times-group">
        <div className="event-time-row">
          <Calendar size={16} className="event-time-icon" />
          <div className="event-time-content">
            <div className="event-time-label">
              Start: {formatDateOnly(event.startTime, viewTimezone)}
            </div>
            <div className="event-time-value">
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {formatTimeOnly(event.startTime, viewTimezone)}
            </div>
          </div>
        </div>

        <div className="event-time-row">
          <Calendar size={16} className="event-time-icon" />
          <div className="event-time-content">
            <div className="event-time-label">
              End: {formatDateOnly(event.endTime, viewTimezone)}
            </div>
            <div className="event-time-value">
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {formatTimeOnly(event.endTime, viewTimezone)}
            </div>
          </div>
        </div>
      </div>

      <div className="event-timestamps-footer">
        <div>Created: {formatInTimezone(event.createdAt, viewTimezone)}</div>
        <div>Updated: {formatInTimezone(event.updatedAt, viewTimezone)}</div>
      </div>

      <div className="event-actions-row">
        <button type="button" className="btn-secondary" onClick={() => onEdit(event)}>
          <Edit size={14} />
          <span>Edit</span>
        </button>
        <button type="button" className="btn-secondary" onClick={() => onViewLogs(event)}>
          <FileText size={14} />
          <span>View Logs</span>
        </button>
      </div>
    </div>
  );
}
