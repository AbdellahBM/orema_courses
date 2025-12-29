'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { scheduleData } from '../data';
import ScheduleCard from './ScheduleCard';
import DesktopScheduleView from './DesktopScheduleView';
import { Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isClassPassed } from '../utils/dateUtils';

/*
  File Purpose:
  - Manages the schedule view, including filtering, search, and the horizontal day tabs row.
  - Provides an at-a-glance navigation between days while only showing upcoming classes by default.
  - Updated so that the current (or next upcoming) day is selected and scrolled into view initially,
    while past days remain accessible by sliding horizontally.
  - Desktop calendar now renders in a full-bleed container so cards can slide to the viewport edges without side padding constraints.
*/

// Determine which date should be selected by default (today's or the next upcoming date).
const getInitialSelectedDate = (): string => {
  const todayISO = new Date().toISOString().slice(0, 10);
  const sortedByDate = [...scheduleData].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sortedByDate.find((session) => session.date >= todayISO);
  return upcoming ? upcoming.date : 'All';
};

export default function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState<string>(getInitialSelectedDate);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dayButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Extract unique dates with their day names, sorted by date
  // This ensures each date appears in the day list, even if multiple dates share the same day name
  const days = useMemo(() => {
    const uniqueDates = new Map<string, string>();
    scheduleData.forEach(session => {
      if (!uniqueDates.has(session.date)) {
        uniqueDates.set(session.date, session.day);
      }
    });
    return Array.from(uniqueDates.entries())
      .map(([date, day]) => ({ day, date }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date chronologically
  }, []);

  // Filter logic for Mobile
  const filteredSessions = useMemo(() => {
    return scheduleData.filter(session => {
      // When "All" is selected, only show classes from today onwards (exclude past classes)
      if (selectedDate === 'All') {
        const isPassed = isClassPassed(session.date, session.time);
        if (isPassed) return false;
      }
      
      const matchesDate = selectedDate === 'All' || session.date === selectedDate;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        session.subject.toLowerCase().includes(searchLower) ||
        session.professor.toLowerCase().includes(searchLower) ||
        session.location.toLowerCase().includes(searchLower);
        
      return matchesDate && matchesSearch;
    }).sort((a, b) => {
        // Sort by date then time
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });
  }, [selectedDate, searchTerm]);

  // Filter logic for Desktop (ignores selectedDay, shows all matching search)
  const desktopSessions = useMemo(() => {
    return scheduleData.filter(session => {
      const searchLower = searchTerm.toLowerCase();
      return (
        session.subject.toLowerCase().includes(searchLower) ||
        session.professor.toLowerCase().includes(searchLower) ||
        session.location.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });
  }, [searchTerm]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'short' }).format(date);
  };

  // Check if all classes for a date have passed
  const isDatePassed = (date: string) => {
    const dateSessions = scheduleData.filter(s => s.date === date);
    if (dateSessions.length === 0) return false;
    return dateSessions.every(session => isClassPassed(session.date, session.time));
  };

  // On mount, scroll the horizontal day tabs so that the current/next day is the first visible,
  // keeping past days off-screen unless the user manually slides back.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || days.length === 0) return;

    const todayISO = new Date().toISOString().slice(0, 10);
    const targetDay = days.find((d) => d.date >= todayISO) ?? days[0];
    const targetButton = dayButtonRefs.current[targetDay.date];

    if (targetButton) {
      const offset = Math.max(targetButton.offsetLeft - 16, 0); // small padding
      container.scrollTo({ left: offset, behavior: 'auto' });
    }
  }, [days]);

  return (
    <div className="pb-32 w-full relative z-10">
      <div className="px-4 w-full max-w-md md:max-w-7xl mx-auto">
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن مادة أو أستاذ..."
            className="block w-full pr-10 pl-3 py-3 rounded-xl border-none ring-1 ring-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 bg-white/90 backdrop-blur transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
          {/* Day Tabs - Fixed "All" button + Scrollable Days */}
          <div className="mb-8 flex gap-2 items-start -mx-4 px-4">
            {/* Fixed "All" Button */}
            <motion.button
              onClick={() => setSelectedDate('All')}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 shrink-0
                ${selectedDate === 'All' 
                  ? 'bg-blue-900 text-white scale-105' 
                  : 'bg-white text-gray-500 border border-gray-100'}
              `}
            >
              <span className="text-sm font-bold">الكل</span>
              <span className="text-[10px] opacity-80 mt-1">جميع الأيام</span>
            </motion.button>

            {/* Scrollable Days Container */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto pb-2 scrollbar-hide day-tabs-scroll snap-x snap-mandatory"
            >
              <div className="flex gap-2 min-w-max">
                {days.map(({ day, date }) => {
                  const datePassed = isDatePassed(date);
                  return (
                    <motion.button
                      key={date}
                      ref={(el) => {
                        dayButtonRefs.current[date] = el;
                      }}
                      onClick={() => setSelectedDate(date)}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all duration-300 snap-start shrink-0
                        ${datePassed ? 'opacity-85' : ''}
                        ${selectedDate === date 
                          ? 'bg-blue-900 text-white scale-105' 
                          : 'bg-white text-gray-500 border border-gray-100'}
                      `}
                    >
                      <span className="text-sm font-bold">{day}</span>
                      <span className="text-[10px] opacity-80 mt-1">{formatDate(date)}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6 pb-32">
            <AnimatePresence mode="popLayout">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, index) => (
                  <ScheduleCard key={session.id} session={session} index={index} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Filter className="w-8 h-8" />
                  </div>
                  <p className="text-gray-500 font-medium">لا توجد حصص مطابقة للبحث</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block w-full">
        <DesktopScheduleView sessions={desktopSessions} />
      </div>
    </div>
  );
}
