import React, { useEffect } from 'react';
import { useEventStore } from '../store/eventStore';
import { useViewTimezoneStore } from '../store/viewTimezoneStore';
import { formatInTimezone } from '../utils/timezone';
import { X, Clock } from 'lucide-react';

export default function EventLogsModal({ event, onClose }) {
  const { logs, logsLoading, logsError, fetchEventLogs } = useEventStore();
  const { viewTimezone } = useViewTimezoneStore();

  useEffect(() => {
    if (event && event._id) {
      fetchEventLogs(event._id);
    }
  }, [event]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Event Update History</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {logsError && <div className="alert-error">{logsError}</div>}

          {logsLoading ? (
            <div className="empty-events-container">Loading log history...</div>
          ) : logs.length === 0 ? (
            <div className="empty-events-container">No update history yet</div>
          ) : (
            <div className="log-timeline">
              {logs.map((log) => {
                return log.changes.map((change, cIdx) => (
                  <div key={`${log._id}-${cIdx}`} className="log-item-card">
                    <div className="log-item-header">
                      <Clock size={14} />
                      <span>{formatInTimezone(log.timestamp, viewTimezone)}</span>
                    </div>
                    <div className="log-item-desc">
                      {change.description}
                    </div>
                  </div>
                ));
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
