import { ClassSession } from "./types";

/*
  File Purpose:
  - Provides the static data source for the weekly class schedule used by the home page.
  - Each entry conforms to `ClassSession`, enabling UI components to render consistent cards.
  - The Probabilité class on Thursday (id "9") is explicitly marked with `isCancelled: true`
    so that the UI can communicate that this class has been canceled without deleting it
    from the schedule.
  - The "قانون المواريث والحقول المالية" class (id "10") is marked with `isRescheduled: true`
    to indicate it has been postponed to a later date.
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
    day: "الجمعة",
    date: "2025-12-26",
    time: "10:00",
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

  // Thursday - Dec 25, 2025
  {
    id: "9",
    subject: "probabilité",
    day: "الخميس",
    date: "2025-12-25",
    time: "10:00",
    location: "ملحقة 1",
    room: "2",
    professor: "الأستاذ بلال الصبار",
    category: "Economics",
     // This class has been canceled; keep it in the list but visually mark it in the UI.
    isCancelled: true,
    initialLikes: 0,
  },
  {
    id: "10",
    subject: "قانون المواريث والحقول المالية",
    day: "الخميس",
    date: "2025-12-25",
    time: "14:00",
    location: "كلية الحقوق المركز بوخالف",
    room: "5",
    professor: "الأستاذ عبد النور الأندلسي",
    category: "Law",
    // This class has been rescheduled/postponed to a later date.
    isRescheduled: true,
    initialLikes: 0,
  },

  // Saturday - Dec 27, 2025
  {
    id: "7",
    subject: "Fiscalité",
    day: "السبت",
    date: "2025-12-27", 
    time: "10:00",
    location: "ملحقة 1",
    room: "2",
    professor: "الأستاذ صهيب الحداد",
    category: "Economics",
    initialLikes: 0,
  },
];
