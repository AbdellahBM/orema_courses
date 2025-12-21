'use client';

import React from 'react';
import { ClassSession } from '../types';
import { MapPin, User, Clock, Calendar, BookOpen, GraduationCap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLikes } from '../hooks/useLikes';
import { isClassPassed } from '../utils/dateUtils';

/*
  Modern profile-style card component with like functionality.
  Optimized for compact layout with better space management.
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
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  
  const passed = isClassPassed(session.date, session.time);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: passed ? 0.85 : 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={passed ? {} : { y: -4, scale: 1.01 }}
      className={`relative group ${passed ? 'pointer-events-none' : ''}`}
    >
      {/* Main Card */}
      <div className={`bg-white rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 overflow-hidden ${
        passed 
          ? 'opacity-85 grayscale' 
          : 'hover:shadow-xl hover:border-blue-200/60'
      }`}>
        
        {/* Content */}
        <div className="p-4">
          {/* Header Section - Compact */}
          <div className="flex items-start gap-3 mb-3">
            {/* Icon Avatar - Smaller */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-200 shrink-0 ${
              passed ? 'opacity-60' : ''
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
                <h3 className={`text-lg font-bold leading-tight flex-1 line-clamp-2 ${
                  passed ? 'text-slate-400' : 'text-slate-900'
                }`}>
                  {session.subject}
                </h3>
                {/* Like Button */}
                {!passed && (
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 shrink-0 ${
                      isLiked
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
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
                  passed ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <User className="w-3 h-3" />
                  <span className="font-medium">{session.professor}</span>
                </div>
              </div>
              
              {/* Time and Location - Compact Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`flex items-center gap-1 text-xs ${
                  passed ? 'text-slate-400' : 'text-blue-600'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span className="font-semibold">{session.time}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className={`flex items-center gap-1 text-xs ${
                  passed ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium truncate max-w-[120px]">{session.location}</span>
                </div>
                {session.room && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      passed 
                        ? 'bg-slate-50 text-slate-400' 
                        : 'bg-slate-100 text-slate-700'
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
              passed ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Calendar className="w-3 h-3" />
              <span className="font-medium">{session.date}</span>
            </div>
            
            {/* Category Tags - Compact */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {session.notConfirmed && (
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  passed 
                    ? 'bg-slate-50 text-slate-400 border-slate-200' 
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  غير مؤكد
                </div>
              )}
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                passed 
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
