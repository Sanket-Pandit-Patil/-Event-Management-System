import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONES = [
  { label: 'Eastern Time (ET)', iana: 'America/New_York' },
  { label: 'Pacific Time (PT)', iana: 'America/Los_Angeles' },
  { label: 'Central Time (CT)', iana: 'America/Chicago' },
  { label: 'Mountain Time (MT)', iana: 'America/Denver' },
  { label: 'India (IST)', iana: 'Asia/Kolkata' },
  { label: 'UTC', iana: 'UTC' },
  { label: 'London (GMT/BST)', iana: 'Europe/London' },
  { label: 'Central European (CET)', iana: 'Europe/Paris' },
  { label: 'Japan (JST)', iana: 'Asia/Tokyo' },
  { label: 'Australian Eastern (AEST)', iana: 'Australia/Sydney' }
];

export const getTimezoneIANA = (labelOrIana) => {
  const found = TIMEZONES.find(
    (tz) => tz.label.toLowerCase() === labelOrIana.toLowerCase() || tz.iana.toLowerCase() === labelOrIana.toLowerCase()
  );
  return found ? found.iana : 'America/New_York';
};

export const getTimezoneLabel = (ianaOrLabel) => {
  const found = TIMEZONES.find(
    (tz) => tz.iana.toLowerCase() === ianaOrLabel.toLowerCase() || tz.label.toLowerCase() === ianaOrLabel.toLowerCase()
  );
  return found ? found.label : ianaOrLabel;
};

/**
 * Format a Date object or ISO string in a target timezone
 */
export const formatInTimezone = (date, tzLabelOrIana, pattern = 'MMM DD, YYYY at hh:mm A') => {
  if (!date) return '';
  const iana = getTimezoneIANA(tzLabelOrIana);
  return dayjs(date).tz(iana).format(pattern);
};

/**
 * Formats date part: "Oct 14, 2025"
 */
export const formatDateOnly = (date, tzLabelOrIana) => {
  return formatInTimezone(date, tzLabelOrIana, 'MMM DD, YYYY');
};

/**
 * Formats time part: "11:30 PM"
 */
export const formatTimeOnly = (date, tzLabelOrIana) => {
  return formatInTimezone(date, tzLabelOrIana, 'hh:mm A');
};

/**
 * Convert user selected local date ("YYYY-MM-DD") and time ("HH:mm") in specific timezone to UTC Date object
 */
export const combineDateAndTimeToUTC = (dateStr, timeStr, tzLabelOrIana) => {
  const iana = getTimezoneIANA(tzLabelOrIana);
  const dateTimeStr = `${dateStr} ${timeStr}`;
  return dayjs.tz(dateTimeStr, 'YYYY-MM-DD HH:mm', iana).toDate();
};

/**
 * Extract YYYY-MM-DD and HH:mm from a date in a target timezone
 */
export const extractDateAndTimeInTimezone = (date, tzLabelOrIana) => {
  if (!date) return { dateStr: dayjs().format('YYYY-MM-DD'), timeStr: '09:00' };
  const iana = getTimezoneIANA(tzLabelOrIana);
  const d = dayjs(date).tz(iana);
  return {
    dateStr: d.format('YYYY-MM-DD'),
    timeStr: d.format('HH:mm')
  };
};

export default dayjs;
