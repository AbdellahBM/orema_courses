'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

/*
  Header component displaying the association and event logos/titles.
  Uses the actual association logo from public folder.
*/

export default function Header() {
  return (
    <header className="pt-6 pb-2 px-6 mb-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {/* Association Logo */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
           <Image
             src="/اللوغو فقط.png"
             alt="شعار المنظمة"
             width={80}
             height={80}
             className="object-contain"
             priority
           />
        </motion.div>
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center flex-1 mx-2"
        >
           <h1 className="text-3xl font-black text-blue-900 leading-none tracking-tight">حصص الدعم</h1>
           <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 text-[10px] font-bold px-3 py-1 rounded-full mt-2 shadow-md transform -rotate-2">
             مجاناً - FREE
           </div>
           <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-wide">طنجة 2025</p>
        </motion.div>

        {/* Event Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg shadow-yellow-100/50 overflow-hidden">
             <Image
               src="/image copy.png"
               alt="شعار الحدث"
               width={85}
               height={85}
               className="object-cover scale-110"
               priority
             />
           </div>
        </motion.div>
      </div>
    </header>
  );
}
