/**
 * DSA Strategy: Hash-based Set & Property Diffing Algorithm - O(N + M) time complexity.
 * Computes exact state deltas between previous and current event objects.
 */
function calculateEventDiff(oldEvent, newEvent, oldProfilesMap, newProfilesMap) {
  const changes = [];

  // 1. Compare Profiles using Set Diff
  const oldProfileNames = (oldEvent.profiles || [])
    .map(id => oldProfilesMap[id.toString()] || id.toString())
    .sort();
  const newProfileNames = (newEvent.profiles || [])
    .map(id => newProfilesMap[id.toString()] || id.toString())
    .sort();

  const oldProfilesStr = oldProfileNames.join(', ');
  const newProfilesStr = newProfileNames.join(', ');

  if (oldProfilesStr !== newProfilesStr) {
    changes.push({
      field: 'profiles',
      description: `Profiles changed to: ${newProfilesStr}`,
      previousValue: oldProfilesStr,
      newValue: newProfilesStr
    });
  }

  // 2. Compare Timezone
  if (oldEvent.timezone !== newEvent.timezone) {
    changes.push({
      field: 'timezone',
      description: `Timezone updated to: ${newEvent.timezone}`,
      previousValue: oldEvent.timezone,
      newValue: newEvent.timezone
    });
  }

  // 3. Compare Start Date & Time
  const oldStart = new Date(oldEvent.startTime).getTime();
  const newStart = new Date(newEvent.startTime).getTime();
  if (oldStart !== newStart) {
    changes.push({
      field: 'startTime',
      description: 'Start date/time updated',
      previousValue: new Date(oldEvent.startTime).toISOString(),
      newValue: new Date(newEvent.startTime).toISOString()
    });
  }

  // 4. Compare End Date & Time
  const oldEnd = new Date(oldEvent.endTime).getTime();
  const newEnd = new Date(newEvent.endTime).getTime();
  if (oldEnd !== newEnd) {
    changes.push({
      field: 'endTime',
      description: 'End date/time updated',
      previousValue: new Date(oldEvent.endTime).toISOString(),
      newValue: new Date(newEvent.endTime).toISOString()
    });
  }

  return changes;
}

module.exports = { calculateEventDiff };
