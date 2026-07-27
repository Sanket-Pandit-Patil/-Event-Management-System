/**
 * DSA Strategy 1: Sweep-line / Interval Overlap Detection Algorithm - O(N log N)
 * Checks if any assigned events overlap in UTC time bounds.
 */
export const detectEventOverlaps = (events) => {
  if (!events || events.length < 2) return new Set();

  // Create start and end interval endpoints
  const intervals = events.map(e => ({
    id: e._id,
    start: new Date(e.startTime).getTime(),
    end: new Date(e.endTime).getTime()
  }));

  // Sort intervals by start time
  intervals.sort((a, b) => a.start - b.start);

  const overlappingEventIds = new Set();

  for (let i = 0; i < intervals.length - 1; i++) {
    const current = intervals[i];
    const next = intervals[i + 1];

    if (current.end > next.start) {
      overlappingEventIds.add(current.id);
      overlappingEventIds.add(next.id);
    }
  }

  return overlappingEventIds;
};

/**
 * DSA Strategy 2: Prefix / Substring Search Algorithm for profiles
 */
export const filterProfilesByQuery = (profiles, query) => {
  if (!query || !query.trim()) return profiles;
  const q = query.trim().toLowerCase();
  return profiles.filter(p => p.name.toLowerCase().includes(q));
};
