import { create } from 'zustand';
import { apiFetch } from '../utils/api';

export const useProfileStore = create((set, get) => ({
  profiles: [],
  selectedProfile: null, // null means "All Profiles"
  loading: false,
  error: null,

  fetchProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch('/api/profiles');
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      set({ profiles: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  setSelectedProfile: (profile) => {
    set({ selectedProfile: profile });
  },

  createProfile: async (name) => {
    try {
      const res = await apiFetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create profile');

      set((state) => ({
        profiles: [...state.profiles, data].sort((a, b) => a.name.localeCompare(b.name)),
        selectedProfile: state.selectedProfile || data
      }));
      return data;
    } catch (err) {
      throw err;
    }
  }
}));
