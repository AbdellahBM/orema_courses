'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

/*
  About Us button component displaying the organization logo with "من نحن ؟" text.
  Positioned on the right side of the screen, matching the style of other social buttons.
  Links to the about-us page when clicked.
*/

export default function AboutUsButton() {
  return (
    <Link href="/about-us">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-16 right-4 z-30 flex items-center gap-0.5 cursor-pointer"
        aria-label="من نحن"
      >
        {/* Logo - fixed, no animation */}
        <Image
          src="/اللوغو فقط.png"
          alt="شعار المنظمة"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
        
        {/* Text Label - always visible with liquid glass background and speaking animation */}
        <motion.span
          animate={{
            scale: [1, 1.08, 1, 1.08, 1],
            x: [0, 3, 0, -3, 0],
            y: [0, -2, 0, -2, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-sm font-semibold text-green-800 bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full shadow-lg border border-white/40 whitespace-nowrap"
          style={{ 
            fontFamily: 'var(--font-el-messiri)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          من نحن ؟
        </motion.span>
      </motion.div>
    </Link>
  );
}

