import { ClassSession } from "./types";

/*
  Data for the class schedule.
  Contains the list of support classes for the week with precise ISO dates.
  Base start date: Monday, Dec 22, 2025.
  Note: `initialLikes` is the hardcoded starting value (editable in code).
*/

export const scheduleData: ClassSession[] = [
  // Tuesday - Dec 23, 2025
  {
    id: "1",
    subject: "Histoire de la pensée économique",
    day: "الثلاثاء",
    date: "2025-12-23",
    time: "12:00",
    location: "ملحقة 1",
    room: "1",
    professor: "الأستاذ محمد بويردن",
    category: "Economics",
    initialLikes: 0,
  },
  {
    id: "2",
    subject: "النظرية العامة للقانون الدستوري",
    day: "الإثنين",
    date: "2025-12-22",
    time: "12:00",
    location: "كلية الحقوق المركز بوخالف",
    room: "5",
    professor: "الأستاذ إبراهيم الصمدي",
    category: "Law",
    initialLikes: 0,
  },
  {
    id: "3",
    subject: "Contrôle de gestion",
    day: "الإثنين",
    date: "2025-12-22",
    time: "13:00",
    location: "ملحقة 1",
    room: "3",
    professor: "الأستاذة هدى السبيطي",
    category: "Economics",
    initialLikes: 0,
  },
  {
    id: "4",
    subject: "المواريث",
    day: "الإثنين",
    date: "2025-12-22",
    time: "14:00",
    location: "كلية الحقوق المركز بوخالف",
    room: "5",
    professor: "الأستاذ عبد النور الأندلسي",
    category: "Law",
    initialLikes: 0,
  },
  
  // Tuesday - Dec 23, 2025
  {
    id: "5",
    subject: "Comptabilité approfondie",
    day: "الثلاثاء",
    date: "2025-12-23",
    time: "10:00",
    location: "ملحقة 1",
    room: "2",
    professor: "الأستاذ زكرياء الوردي",
    category: "Economics",
    initialLikes: 0,
  },
  {
    id: "6",
    subject: "مدخل إلى دراسة القانون",
    day: "الثلاثاء",
    date: "2025-12-23",
    time: "12:00",
    location: "كلية الحقوق المركز بوخالف",
    room: "6",
    professor: "الأستاذ محمد المثيوي",
    category: "Law",
    initialLikes: 0,
  },

  // Wednesday - Dec 24, 2025
  {
    id: "8",
    subject: "Compatibilité analytique",
    day: "الأربعاء",
    date: "2025-12-24",
    time: "10:00",
    location: "ملحقة 1",
    room: "2",
    professor: "الأستاذ محمد الشليق",
    category: "Economics",
    initialLikes: 0,
  },

  // Saturday - Jan 27, 2026
  {
    id: "7",
    subject: "Fiscalité",
    day: "السبت",
    date: "2026-01-27", 
    time: "10:00",
    location: "ملحقة 1",
    room: "2",
    professor: "الأستاذ صهيب الحداد",
    category: "Economics",
    initialLikes: 0,
  },
];
