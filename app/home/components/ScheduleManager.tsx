'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { scheduleData } from '../data';
import ScheduleCard from './ScheduleCard';
import DesktopScheduleView from './DesktopScheduleView';
import { Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { areAllClassesPassedForDay, isClassPassed } from '../utils/dateUtils';

/*
  File Purpose:
  - Manages the schedule view, including filtering, search, and the horizontal day tabs row.
  - Provides an at-a-glance navigation between days while only showing upcoming classes by default.
  - Updated so that the current (or next upcoming) day is selected and scrolled into view initially,
    while past days remain accessible by sliding horizontally.
*/

// Determine which day should be selected by default (today's or the next upcoming day).
const getInitialSelectedDay = (): string => {
  const todayISO = new Date().toISOString().slice(0, 10);
  const sortedByDate = [...scheduleData].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sortedByDate.find((session) => session.date >= todayISO);
  return upcoming ? upcoming.day : 'All';
};

export default function ScheduleManager() {
  const [selectedDay, setSelectedDay] = useState<string>(getInitialSelectedDay);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const dayButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Extract unique days with their dates, sorted by date
  const days = useMemo(() => {
    const uniqueDays = new Map<string, string>();
    scheduleData.forEach(session => {
      if (!uniqueDays.has(session.day)) {
        uniqueDays.set(session.day, session.date);
      }
    });
    return Array.from(uniqueDays.entries())
      .map(([day, date]) => ({ day, date }))
      .sort((a, b) => a.date.localeCompare(b.date)); // Sort by date chronologically
  }, []);

  // Filter logic for Mobile
  const filteredSessions = useMemo(() => {
    return scheduleData.filter(session => {
      // When "All" is selected, only show classes from today onwards (exclude past classes)
      if (selectedDay === 'All') {
        const isPassed = isClassPassed(session.date, session.time);
        if (isPassed) return false;
      }
      
      const matchesDay = selectedDay === 'All' || session.day === selectedDay;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        session.subject.toLowerCase().includes(searchLower) ||
        session.professor.toLowerCase().includes(searchLower) ||
        session.location.toLowerCase().includes(searchLower);
        
      return matchesDay && matchesSearch;
    }).sort((a, b) => {
        // Sort by date then time
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });
  }, [selectedDay, searchTerm]);

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

  // Check if all classes for a day have passed
  const isDayPassed = (day: string) => {
    return areAllClassesPassedForDay(day, scheduleData);
  };

  // On mount, scroll the horizontal day tabs so that the current/next day is the first visible,
  // keeping past days off-screen unless the user manually slides back.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || days.length === 0) return;

    const todayISO = new Date().toISOString().slice(0, 10);
    const targetDay = days.find((d) => d.date >= todayISO) ?? days[0];
    const targetButton = dayButtonRefs.current[targetDay.day];

    if (targetButton) {
      const offset = Math.max(targetButton.offsetLeft - 16, 0); // small padding
      container.scrollTo({ left: offset, behavior: 'auto' });
    }
  }, [days]);

  return (
    <div className="px-4 pb-32 w-full max-w-md md:max-w-7xl mx-auto relative z-10">
      
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

      {/* Desktop View */}
      <div className="hidden md:block">
        <DesktopScheduleView sessions={desktopSessions} />
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {/* Day Tabs - Fixed "All" button + Scrollable Days */}
        <div className="mb-8 flex gap-2 items-start -mx-4 px-4">
          {/* Fixed "All" Button */}
          <motion.button
            onClick={() => setSelectedDay('All')}
            whileTap={{ scale: 0.95 }}
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 shrink-0
              ${selectedDay === 'All' 
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
                const dayPassed = isDayPassed(day);
                return (
                  <motion.button
                    key={day}
                    ref={(el) => {
                      dayButtonRefs.current[day] = el;
                    }}
                    onClick={() => setSelectedDay(day)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all duration-300 snap-start shrink-0
                      ${dayPassed ? 'opacity-85' : ''}
                      ${selectedDay === day 
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
  );
}
