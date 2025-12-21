'use client';

import React from 'react';
import { ClassSession } from '../types';
import { MapPin, User, Clock, Calendar, BookOpen, GraduationCap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLikes } from '../hooks/useLikes';
import { isClassPassed } from '../utils/dateUtils';

/*
  Modern profile-style card component with like functionality.
  Features clean layout with icon avatar, prominent subject title, and like counter.
  Cards are disabled when the class time has passed.
*/

interface ScheduleCardProps {
  session: ClassSession;
  index: number;
}

export default function ScheduleCard({ session, index }: ScheduleCardProps) {
  const { likes, isLiked, toggleLike } = useLikes(session.id);
  const categoryLabel = session.category === 'Law' ? 'قانون' : 'اقتصاد';
  const categoryColor = session.category === 'Law' 
    ? 'bg-blue-50 text-blue-700 border-blue-200' 
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  
  const passed = isClassPassed(session.date, session.time);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: passed ? 0.5 : 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={passed ? {} : { y: -4, scale: 1.01 }}
      className={`relative group ${passed ? 'pointer-events-none' : ''}`}
    >
      {/* Main Card */}
      <div className={`bg-white rounded-3xl shadow-lg border border-slate-200/80 transition-all duration-300 overflow-hidden ${
        passed 
          ? 'opacity-50 grayscale' 
          : 'hover:shadow-xl hover:border-blue-200/60'
      }`}>
        
        {/* Content */}
        <div className="p-6">
          {/* Header Section - Profile Style */}
          <div className="flex items-start gap-4 mb-5">
            {/* Icon Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0 ${
              passed ? 'opacity-60' : ''
            }`}>
              {session.category === 'Law' ? (
                <GraduationCap className="w-8 h-8" />
              ) : (
                <BookOpen className="w-8 h-8" />
              )}
            </div>

            {/* Subject and Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className={`text-xl font-bold leading-tight flex-1 ${
                  passed ? 'text-slate-400' : 'text-slate-900'
                }`}>
                  {session.subject}
                </h3>
                {/* Like Button - Disabled when passed */}
                {!passed && (
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 shrink-0 ${
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
                        className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
                      />
                    </motion.div>
                    {likes > 0 && (
                      <span className="text-xs font-bold">{likes}</span>
                    )}
                  </button>
                )}
              </div>
              <p className={`text-sm font-medium mb-3 ${
                passed ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {session.professor}
              </p>
              
              {/* Time and Location Row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className={`flex items-center gap-1.5 ${
                  passed ? 'text-slate-400' : 'text-blue-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">{session.time}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${
                  passed ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{session.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mb-4"></div>

          {/* Details Section */}
          <div className="space-y-3 mb-4">
            {/* Date */}
            <div className={`flex items-center gap-2 ${
              passed ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{session.date}</span>
            </div>

            {/* Room if available */}
            {session.room && (
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                passed 
                  ? 'bg-slate-50 text-slate-400 border-slate-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                القاعة {session.room}
              </div>
            )}
          </div>

          {/* Category Tags - Bottom Section */}
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
              passed 
                ? 'bg-slate-50 text-slate-400 border-slate-200' 
                : categoryColor
            }`}>
              {categoryLabel}
            </div>
            {session.isNextWeek && (
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${
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
    </motion.div>
  );
}
