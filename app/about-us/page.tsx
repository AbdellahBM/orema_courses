'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BackgroundTexture from '../home/components/BackgroundTexture';

/*
  About Us page component.
  Displays a message in Arabic indicating that the content is not available yet.
  The content will be available soon.
*/

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative font-sans selection:bg-blue-100 selection:text-blue-900">
      <BackgroundTexture />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-blue-900"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>

          <h1 className="text-2xl font-black text-blue-900 mb-4">من نحن ؟</h1>
          
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            المحتوى غير متاح حالياً
          </p>
          
          <p className="text-sm text-slate-500 mb-8">
            سيتم توفير المحتوى قريباً
          </p>

          <Link
            href="/"
            className="inline-block bg-blue-900 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200 shadow-md active:shadow-lg"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

