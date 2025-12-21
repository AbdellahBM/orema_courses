/*
  Utility functions for checking if classes have passed.
  Compares class date and time with current date and time.
*/

export function isClassPassed(date: string, time: string): boolean {
  const now = new Date();
  
  // Parse the class date and time
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  // Create a Date object for the class start time
  const classDateTime = new Date(year, month - 1, day, hours, minutes);
  
  // Compare with current time
  return classDateTime < now;
}

export function areAllClassesPassedForDay(day: string, sessions: Array<{ day: string; date: string; time: string }>): boolean {
  const daySessions = sessions.filter(s => s.day === day);
  if (daySessions.length === 0) return false;
  
  // Check if all sessions for this day have passed
  return daySessions.every(session => isClassPassed(session.date, session.time));
}



