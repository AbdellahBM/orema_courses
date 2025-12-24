'use client';

import React from 'react';
import { ClassSession } from '../types';
import { MapPin, User, Clock, Calendar, BookOpen, GraduationCap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLikes } from '../hooks/useLikes';
import { isClassPassed } from '../utils/dateUtils';

/*
  File Purpose:
  - Renders a modern, compact card for a single `ClassSession`, including professor, time, location, and interaction controls.
  - Integrates the likes system so students can express interest in specific classes while keeping the layout space-efficient.
  - Updated to visually flag canceled classes (via `session.isCancelled`) such as the Probabilité class, clearly indicating that
    the class will not take place while still showing its original schedule slot.
*/

interface ScheduleCardProps {
  session: ClassSession;
  index: number;
}

export default function ScheduleCard({ session, index }: ScheduleCardProps) {
  const { likes, isLiked, toggleLike, isLoading } = useLikes(
    session.id,
    session.initialLikes ?? 0
  );
  const categoryLabel = session.category === 'Law' ? 'قانون' : 'اقتصاد';
  const categoryColor = session.category === 'Law' 
    ? 'bg-blue-50 text-blue-700 border-blue-200' 
    : 'bg-yellow-50 text-yellow-800 border-yellow-300';
  
  const passed = isClassPassed(session.date, session.time);
  const cancelled = session.isCancelled;
  const rescheduled = session.isRescheduled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: passed || cancelled || rescheduled ? 0.85 : 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileTap={passed || cancelled || rescheduled ? {} : { scale: 0.98 }}
      className={`relative group ${passed || cancelled || rescheduled ? 'pointer-events-none' : ''}`}
    >
      {/* Main Card */}
      <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 overflow-hidden ${
        passed || cancelled || rescheduled
          ? 'opacity-85 grayscale' 
          : session.category === 'Law' 
            ? 'active:shadow-xl active:border-blue-200/60' 
            : 'active:shadow-xl active:border-yellow-300/60'
      }`}>
        
        {/* Content */}
        <div className="p-4">
          {/* Header Section - Compact */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon Avatar - Smaller */}
            <div className={`w-12 h-12 rounded-xl ${
              session.category === 'Law' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-md shadow-blue-200 text-white' 
                : 'bg-yellow-400 shadow-md shadow-yellow-200 text-white'
            } flex items-center justify-center shrink-0 ${
              passed || cancelled || rescheduled ? 'opacity-60' : ''
            }`}>
              {session.category === 'Law' ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <BookOpen className="w-6 h-6" />
              )}
            </div>

            {/* Subject and Info - Compact */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold leading-tight line-clamp-2 ${
                    passed || cancelled || rescheduled ? 'text-slate-400' : 'text-slate-900'
                  }`}>
                    {session.subject}
                  </h3>
                  {session.notConfirmed && !passed && !cancelled && !rescheduled && (
                    <span className="inline-block mt-1 text-xs font-bold text-red-600 animate-pulse">
                      ⚠️ غير مؤكد
                    </span>
                  )}
                  {cancelled && (
                    <span className="inline-block mt-1 text-xs font-bold text-red-600">
                      ❌ تم إلغاء هذه الحصة
                    </span>
                  )}
                  {rescheduled && !cancelled && (
                    <span className="inline-block mt-1 text-xs font-bold text-orange-600">
                      📅 تم تأجيل هذه الحصة
                    </span>
                  )}
                </div>
                {/* Like Button */}
                {!passed && !cancelled && !rescheduled && (
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 shrink-0 ${
                      isLiked
                        ? 'bg-red-50 text-red-600 border border-red-200 active:bg-red-100'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 active:bg-slate-100'
                    }`}
                  >
                    <motion.div
                      animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`}
                      />
                    </motion.div>
                    {/* Always show the counter (including 0) */}
                    <span className="text-[10px] font-bold tabular-nums">
                      {isLoading ? '…' : likes}
                    </span>
                  </button>
                )}
              </div>
              
              {/* Professor - Inline with time/location */}
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <div className={`flex items-center gap-1 text-xs ${
                  passed || cancelled || rescheduled ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <User className="w-3 h-3" />
                  <span className="font-medium">{session.professor}</span>
                </div>
              </div>
              
              {/* Time and Location - Compact Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`flex items-center gap-1 text-xs ${
                  passed || cancelled || rescheduled ? 'text-slate-400' : 'text-green-600'
                }`}>
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="font-semibold">{session.time}</span>
                </div>
                <span className="text-slate-300 shrink-0">•</span>
                <div className={`flex items-center gap-1 text-xs flex-1 min-w-0 ${
                  passed || cancelled || rescheduled ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="font-medium break-words">{session.location}</span>
                </div>
                {session.room && (
                  <>
                    <span className="text-slate-300 shrink-0">•</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 ${
                      passed || cancelled || rescheduled
                        ? 'bg-slate-50 text-slate-400' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                      قاعة {session.room}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Date and Tags in one row */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className={`flex items-center gap-1.5 text-xs ${
              passed || cancelled || rescheduled ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span className="font-medium">{session.date}</span>
            </div>
            
            {/* Category Tags - Compact */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {session.notConfirmed && !cancelled && (
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                  passed || cancelled
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-red-50 text-red-700 border-red-400 shadow-red-100'
                }`}>
                  ⚠️ غير مؤكد
                </div>
              )}
              {cancelled && (
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                  passed || cancelled
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-red-50 text-red-700 border-red-400 shadow-red-100'
                }`}>
                  ❌ ملغاة
                </div>
              )}
              {rescheduled && !cancelled && (
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border-2 shadow-sm ${
                  passed
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-orange-50 text-orange-700 border-orange-400 shadow-orange-100'
                }`}>
                  📅 مؤجلة
                </div>
              )}
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                passed || cancelled
                  ? 'bg-slate-50 text-slate-400 border-slate-200' 
                  : categoryColor
              }`}>
                {categoryLabel}
              </div>
              {session.isNextWeek && (
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  passed 
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  الأسبوع المقبل
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
