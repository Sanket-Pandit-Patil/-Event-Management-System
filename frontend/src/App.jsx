import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import CreateEventForm from './components/CreateEventForm';
import EventList from './components/EventList';
import EditEventModal from './components/EditEventModal';
import EventLogsModal from './components/EventLogsModal';
import { useProfileStore } from './store/profileStore';
import { useEventStore } from './store/eventStore';

export default function App() {
  const { fetchProfiles, selectedProfile } = useProfileStore();
  const { fetchEvents } = useEventStore();

  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    fetchEvents(selectedProfile ? selectedProfile._id : null);
  }, [selectedProfile]);

  return (
    <div className="app-container">
      <Header />

      <main className="main-grid">
        <CreateEventForm />
        <EventList
          onEditEvent={(event) => setEditingEvent(event)}
          onViewLogsEvent={(event) => setViewingLogsEvent(event)}
        />
      </main>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {viewingLogsEvent && (
        <EventLogsModal
          event={viewingLogsEvent}
          onClose={() => setViewingLogsEvent(null)}
        />
      )}
    </div>
  );
}
