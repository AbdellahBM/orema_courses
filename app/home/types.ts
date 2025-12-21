/*
  Defines the types used for the class schedule.
*/

export interface ClassSession {
  id: string;
  subject: string;
  day: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string;
  location: string;
  room?: string;
  professor: string;
  isNextWeek?: boolean;
  notConfirmed?: boolean; // If true, class is not yet confirmed
  category?: string; // e.g., 'Law', 'Economics'
  /**
   * Hardcoded starting likes for this class (stored in code).
   * The live counter can still be updated dynamically via the likes API (KV on Vercel).
   */
  initialLikes?: number;
}
