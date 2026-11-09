/**
 * External JavaScript utility for Live Date and Time calculations (Assessment Section 8 Requirement).
 * Uses native JavaScript Date API and updates every second.
 */

export interface FormattedDateTime {
  fullDate: string;
  timeString: string;
  timeZone: string;
  dayOfWeek: string;
  isNurseryOpen: boolean;
  statusMessage: string;
  iso: string;
}

/**
 * Formats a Date object into an elegant editorial timestamp and operating status.
 */
export function formatLiveDateTime(date: Date = new Date()): FormattedDateTime {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = dayNames[date.getDay()];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Time formatting with AM/PM
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  const timeString = `${displayHours}:${minutes}:${seconds} ${ampm}`;
  const fullDate = `${dayOfWeek}, ${month} ${day}, ${year}`;

  // Greenhouse / Nursery Open Hours: Mon-Sat 8:00 AM - 7:00 PM, Sun 10:00 AM - 5:00 PM
  const currentHour = date.getHours();
  const isSunday = date.getDay() === 0;
  let isNurseryOpen = false;

  if (isSunday) {
    isNurseryOpen = currentHour >= 10 && currentHour < 17;
  } else {
    isNurseryOpen = currentHour >= 8 && currentHour < 19;
  }

  const statusMessage = isNurseryOpen
    ? "Greenhouse Open • Botanists on Duty"
    : "Greenhouse Resting • Opens at 8:00 AM";

  let timeZone = "Local Time";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    timeZone = "Greenhouse Time";
  }

  return {
    fullDate,
    timeString,
    timeZone,
    dayOfWeek,
    isNurseryOpen,
    statusMessage,
    iso: date.toISOString(),
  };
}

/**
 * Subscribes to live ticking date/time updates every second.
 * Returns an unsubscription function for React useEffect cleanup.
 */
export function subscribeToLiveTime(
  callback: (data: FormattedDateTime) => void
): () => void {
  // Execute immediately
  callback(formatLiveDateTime(new Date()));

  const intervalId = setInterval(() => {
    callback(formatLiveDateTime(new Date()));
  }, 1000);

  return () => clearInterval(intervalId);
}

