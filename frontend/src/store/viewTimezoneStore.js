import { create } from 'zustand';

export const useViewTimezoneStore = create((set) => ({
  viewTimezone: 'Eastern Time (ET)',
  setViewTimezone: (tzLabel) => set({ viewTimezone: tzLabel })
}));
