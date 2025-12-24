/*
  File Purpose:
  - Defines the core TypeScript types used to describe each class session in the weekly schedule.
  - Centralizes the shape of schedule data so that UI components (like `ScheduleCard`) and API layers can rely on a single, well-documented contract.
  - `isCancelled` was added so that we can clearly flag canceled classes (such as the Probabilité class) in the UI without removing them from the schedule history.
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
  /**
   * If true, the class is canceled and should be visually marked as such in the UI.
   * This allows students to see that a previously scheduled class (e.g., Probabilité)
   * will not take place, while still keeping the original slot visible in the calendar.
   */
  isCancelled?: boolean;
  category?: string; // e.g., 'Law', 'Economics'
  /**
   * Hardcoded starting likes for this class (stored in code).
   * The live counter can still be updated dynamically via the likes API (KV on Vercel).
   */
  initialLikes?: number;
}
