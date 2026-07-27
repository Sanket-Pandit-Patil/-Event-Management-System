import { create } from 'zustand';
import { apiFetch } from '../utils/api';

export const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  logs: [],
  logsLoading: false,
  logsError: null,

  fetchEvents: async (profileId = null) => {
    set({ loading: true, error: null });
    try {
      const url = profileId ? `/api/events?profileId=${profileId}` : '/api/events';
      const res = await apiFetch(url);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      set({ events: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createEvent: async (eventData) => {
    try {
      const res = await apiFetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create event');

      set((state) => ({
        events: [data, ...state.events]
      }));
      return data;
    } catch (err) {
      throw err;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const res = await apiFetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update event');

      set((state) => ({
        events: state.events.map((ev) => (ev._id === id ? data : ev))
      }));
      return data;
    } catch (err) {
      throw err;
    }
  },

  fetchEventLogs: async (eventId) => {
    set({ logsLoading: true, logsError: null, logs: [] });
    try {
      const res = await apiFetch(`/api/events/${eventId}/logs`);
      if (!res.ok) throw new Error('Failed to fetch event logs');
      const data = await res.json();
      set({ logs: data, logsLoading: false });
    } catch (err) {
      set({ logsError: err.message, logsLoading: false });
    }
  }
}));
