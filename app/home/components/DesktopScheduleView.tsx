import React, { useMemo, useRef, useEffect, useState } from 'react';
import { ClassSession } from '../types';
import ScheduleCard from './ScheduleCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DesktopScheduleViewProps {
  sessions: ClassSession[];
}

export default function DesktopScheduleView({ sessions }: DesktopScheduleViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const rtlScrollTypeRef = useRef<'default' | 'negative' | 'reverse'>('negative');

  const getRtlScrollType = () => {
    // Detect browser RTL scrollLeft behavior
    const outer = document.createElement('div');
    const inner = document.createElement('div');
    outer.style.width = '100px';
    outer.style.height = '100px';
    outer.style.overflow = 'scroll';
    outer.style.visibility = 'hidden';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    outer.style.direction = 'rtl';
    inner.style.width = '200px';
    inner.style.height = '100px';
    outer.appendChild(inner);
    document.body.appendChild(outer);

    outer.scrollLeft = 0;
    let type: 'default' | 'negative' | 'reverse';
    if (outer.scrollLeft > 0) {
      type = 'default';
    } else {
      outer.scrollLeft = 1;
      type = outer.scrollLeft === 0 ? 'negative' : 'reverse';
    }

    document.body.removeChild(outer);
    return type;
  };

  const getMaxScroll = (el: HTMLElement) => Math.max(el.scrollWidth - el.clientWidth, 0);

  // Normalize RTL so we always work with a stable "distance from start" in [0..max]
  // Start = right edge (the initial position in RTL), End = left edge.
  const getDistanceFromStart = (el: HTMLElement) => {
    const max = getMaxScroll(el);
    const t = rtlScrollTypeRef.current;
    if (t === 'negative') return Math.min(Math.max(-el.scrollLeft, 0), max);
    if (t === 'reverse') return Math.min(Math.max(el.scrollLeft, 0), max);
    // default: scrollLeft starts at max and goes down to 0
    return Math.min(Math.max(max - el.scrollLeft, 0), max);
  };

  const setDistanceFromStart = (el: HTMLElement, distance: number, behavior: ScrollBehavior) => {
    const max = getMaxScroll(el);
    const clamped = Math.min(Math.max(distance, 0), max);
    const t = rtlScrollTypeRef.current;
    let nextScrollLeft = 0;
    if (t === 'negative') nextScrollLeft = -clamped;
    else if (t === 'reverse') nextScrollLeft = clamped;
    else nextScrollLeft = max - clamped;
    el.scrollTo({ left: nextScrollLeft, behavior });
  };

  const getStep = useMemo(() => {
    const container = containerRef.current;
    if (!container) return 424;
    const firstCol = container.querySelector<HTMLElement>('[data-day-col="true"]');
    const colWidth = firstCol?.getBoundingClientRect().width ?? 400;
    const gap = parseFloat(getComputedStyle(container).gap || '0') || 0;
    return Math.round(colWidth + gap);
  }, [sessions.length]);

  // Group by date to ensure columns are distinct days
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = {
        dayName: session.day,
        date: session.date,
        sessions: []
      };
    }
    acc[session.date].sessions.push(session);
    return acc;
  }, {} as Record<string, { dayName: string; date: string; sessions: ClassSession[] }>);

  // Sort dates
  const sortedDates = Object.keys(sessionsByDate).sort();

  const checkScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const max = getMaxScroll(el);
    const dist = getDistanceFromStart(el);

    const isAtStart = dist <= 10;
    const isAtEnd = dist >= max - 10;

    // In RTL: moving "left" increases distanceFromStart, moving "right" decreases.
    // Show buttons only when there is room to scroll in that direction.
    setShowLeftArrow(!isAtEnd);
    setShowRightArrow(!isAtStart);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      rtlScrollTypeRef.current = getRtlScrollType();
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      // Initial check
      checkScroll();
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [sortedDates]);

  // Scroll to the first upcoming day or today on mount
  useEffect(() => {
    // Only run if we have a container
    if (!containerRef.current) return;
    
    const todayISO = new Date().toISOString().slice(0, 10);
    // Find the first day that is >= today
    const targetDate = sortedDates.find(date => date >= todayISO);
    
    if (targetDate) {
       const element = document.getElementById(`day-${targetDate}`);
       if (element) {
         // Instant scroll to the target element
         // inline: 'start' aligns the element to the "start" of the scrolling container (Right side in RTL)
         element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
       }
    }
    
    // Re-check scroll arrows after initial scroll
    setTimeout(checkScroll, 100);
  }, [sortedDates]);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;

    const max = getMaxScroll(el);
    const current = getDistanceFromStart(el);
    const delta = getStep;

    const next = direction === 'left' ? current + delta : current - delta;
    const clamped = Math.min(Math.max(next, 0), max);

    // If we're already at the edge, do nothing (prevents the “bounce back” feeling).
    if (Math.abs(clamped - current) < 1) return;

    setDistanceFromStart(el, clamped, 'smooth');
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 z-20 bg-white shadow-lg border border-gray-100 p-3 rounded-full hover:bg-blue-50 text-blue-900 transition-colors hidden md:flex items-center justify-center"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Container */}
      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
      >
        {sortedDates.map((date, colIndex) => {
          const { dayName, sessions: daySessions } = sessionsByDate[date];
          daySessions.sort((a, b) => a.time.localeCompare(b.time));

          return (
            <motion.div 
              key={date} 
              id={`day-${date}`}
              data-day-col="true"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: colIndex * 0.1 }}
              className="min-w-[400px] max-w-[450px] flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-3xl p-4 border border-white/60 shadow-sm flex flex-col gap-4 self-start"
            >
              <div className="text-center pb-2 border-b border-gray-100/50">
                 <h3 className="text-xl font-bold text-gray-800">{dayName}</h3>
                 <p className="text-sm text-gray-500 font-medium">
                   {new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'long' }).format(new Date(date))}
                 </p>
              </div>
              <div className="space-y-4">
                {daySessions.map((session, idx) => (
                  <ScheduleCard key={session.id} session={session} index={idx} />
                ))}
              </div>
            </motion.div>
          );
        })}
        
        {sortedDates.length === 0 && (
           <div className="w-full text-center py-20 text-gray-500">
             لا توجد حصص للعرض
           </div>
        )}
      </div>

      {/* Right Arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 z-20 bg-white shadow-lg border border-gray-100 p-3 rounded-full hover:bg-blue-50 text-blue-900 transition-colors hidden md:flex items-center justify-center"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
