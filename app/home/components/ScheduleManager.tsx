'use client';

import React, { useState, useMemo } from 'react';
import { scheduleData } from '../data';
import ScheduleCard from './ScheduleCard';
import { Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { areAllClassesPassedForDay, isClassPassed } from '../utils/dateUtils';

/*
  Manages the schedule view, including filtering by day and searching.
  Features:
  - Day Tabs with Dates
  - Search/Filter
  - Animated transitions
  - Day tabs with reduced opacity when all classes have passed
*/

export default function ScheduleManager() {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filter logic
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

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'short' }).format(date);
  };

  // Check if all classes for a day have passed
  const isDayPassed = (day: string) => {
    return areAllClassesPassedForDay(day, scheduleData);
  };

  return (
    <div className="px-4 pb-32 max-w-md mx-auto relative z-10">
      
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

      {/* Day Tabs - Scrollable */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide day-tabs-scroll -mx-4 px-4 snap-x snap-mandatory">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setSelectedDay('All')}
            className={`
              flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 snap-start shrink-0
              ${selectedDay === 'All' 
                ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30 scale-105' 
                : 'bg-white text-gray-500 active:bg-gray-50 shadow-sm border border-gray-100'}
            `}
          >
            <span className="text-sm font-bold">الكل</span>
            <span className="text-[10px] opacity-80 mt-1">جميع الأيام</span>
          </button>

          {days.map(({ day, date }) => {
            const dayPassed = isDayPassed(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all duration-300 snap-start shrink-0
                  ${dayPassed ? 'opacity-85' : ''}
                  ${selectedDay === day 
                    ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/30 scale-105' 
                    : 'bg-white text-gray-500 active:bg-gray-50 shadow-sm border border-gray-100'}
                `}
              >
                <span className="text-sm font-bold">{day}</span>
                <span className="text-[10px] opacity-80 mt-1">{formatDate(date)}</span>
              </button>
            );
          })}
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
  );
}
