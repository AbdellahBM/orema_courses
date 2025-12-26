'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import BackgroundTexture from '../home/components/BackgroundTexture';
import { BookOpen, RefreshCw, MessageCircle, ArrowRight, Instagram, Quote, Lightbulb, TrendingUp, Calendar } from 'lucide-react';

/*
  About Us page component.
  Displays detailed information about the OREMA organization based on user-provided content.
  Enhanced for desktop with a two-column layout, better spacing, and improved visual hierarchy.
  Sections:
  - Header: Logo and identity.
  - Intro: Mission statement.
  - History: Formation and timeline.
  - Principles: Core values (Dialogue, Knowledge, Renaissance, Renewal).
  - Mission: Strategic vision.
  - Testimonials: Quotes from key figures.
*/

const principles = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'الحوار',
    description: 'مبدأ أساسي وأصيل للتفاعل مع الذات والآخر، ومسلك لتدبير الاختلافات والعلاقات، وقيمة أساسية لترسيخ أخلاق التعايش والعمل المشترك.'
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'العلم',
    description: 'مبدأ سامٍ هو صلب الوظيفة الأولى للجامعة المغربية، نسعى لترسيخه بين الطلاب باعتباره غايتهم الكبرى وسبيل النهوض الحضاري.'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'النهضة',
    description: 'غاية غايات منظمتنا، والأفق الأرحب لأعمالنا التي نعمل من خلالها على إعداد الإنسان القادر على تحقيق نهضة الوطن والأمة.'
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'التجديد',
    description: 'مبدأ مهم يحفظ منظمتنا من الجمود، وحافز دائم للتطوير والإبداع في الوسائل والأفكار.'
  }
];

const testimonials = [
  {
    quote: "الجامعة يمكن أن تتسع لتصبح بالإضافة إلى كونها فضاء للتدريس والبحث العلمي منتدى ثقافياً علمياً معرفياً يطور فيه الطالب بمبادرة منه ما قد لا ينجح فيه الأستاذ والمؤسسة.",
    author: "المقرئ أبو زيد",
    role: "مفكر وداعية مغربي"
  },
  {
    quote: "لابد من اعتبار الطلبة شريكاً أساسياً في إصلاح الجامعة، منظمة التجديد الطلابي تقدم نموذجاً للعمل الأخلاقي الديمقراطي الحقيقي الذي يخدم العلم.",
    author: "أحمد الريسوني",
    role: "رئيس سابق للاتحاد العالمي لعلماء المسلمين"
  }
];

const milestones = [
  { year: 'نهاية السبعينيات', event: 'انطلاق العمل الطلابي في صيغة تربوية' },
  { year: 'التسعينيات', event: 'الإعلان عن الفصائل الإسلامية في إطار الاتحاد الوطني' },
  { year: 'أكتوبر 1996', event: 'التجربة الوحدوية - فصيل طلبة الوحدة والتواصل' },
  { year: 'مارس 2003', event: 'ميلاد منظمة التجديد الطلابي الرسمي' }
];

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-slate-50 relative font-sans selection:bg-blue-100 selection:text-blue-900 py-8 px-4 lg:py-16" dir="rtl">
      <BackgroundTexture />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-7xl mx-auto"
      >
        {/* Hero Header - Full Width */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative z-10"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto bg-white rounded-3xl shadow-2xl p-6 lg:p-8 mb-8 flex items-center justify-center">
                <Image
                  src="/اللوغو فقط.png"
                  alt="شعار OREMA"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-relaxed">
                منظمة التجديد الطلابي
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 font-medium leading-loose max-w-4xl mx-auto">
                منظمة شبابية مغربية، مدنية ومستقلة، تعمل أساساً في الوسط الطلابي، وتسعى إلى تأهيل جيل طلابي معتز بدينه ووطنه، ملتزم بقيم العلم والعدل والوسطية والحوار.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Column */}
          <div className="space-y-8">
            
            {/* History Section with Timeline */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-blue-600 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">نشأة المنظمة</h2>
              </div>
              <div className="bg-blue-50/50 rounded-2xl p-6 text-slate-700 leading-8 text-base border border-blue-100 mb-6">
                <p>
                  تشكلت منظمة التجديد الطلابي بعد مسيرة طويلة من العمل الطلابي انطلقت منذ نهاية السبعينيات. تبلورت في التسعينيات وتوجت بتجربة وحدوية أدمجت الفعاليات الطلابية ضمن فصيل "طلبة الوحدة والتواصل" في أكتوبر 1996، لتتطور وتعلن عن ميلاد <strong>منظمة التجديد الطلابي</strong> في مارس 2003 كمنظمة مدنية مستقلة.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                      <div className="text-sm font-bold text-blue-900 mb-1">{milestone.year}</div>
                      <div className="text-sm text-slate-600 leading-6">{milestone.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/grid.svg')] z-0" />
              <div className="relative z-10">
                <Lightbulb className="w-10 h-10 mb-6 text-yellow-400" />
                <h2 className="text-2xl font-bold mb-6">رسالتنا</h2>
                <p className="leading-9 text-slate-200 font-light text-lg">
                  "تأهيل جيل طلابي معتز بدينه ووطنه، وملتزم بقيم العلم والعدل والوسطية والحوار، ومساهم في خدمة الجامعة ونهضة الوطن والأمة، عبر منظمة طلابية شورية وتجديدية."
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Principles Grid */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-yellow-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">مبادئنا</h2>
              </div>
              <div className="grid gap-6">
                {principles.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-600 transition-colors flex items-center justify-center text-blue-700 group-hover:text-white">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-7 text-justify">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-green-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800">قالوا عنها</h2>
              </div>
              <div className="space-y-6">
                {testimonials.map((t, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                    <div className="flex gap-4 mb-4">
                      <Quote className="w-8 h-8 text-green-200 shrink-0 rotate-180" />
                      <p className="text-slate-700 italic leading-8 text-base">
                        "{t.quote}"
                      </p>
                    </div>
                    <div className="text-right pr-12">
                      <div className="text-sm font-bold text-green-900">{t.author}</div>
                      <div className="text-xs text-slate-500 mt-1">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer Section - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 lg:p-10"
        >
          {/* Quote */}
          <div className="text-center mb-8 pb-8 border-b border-slate-100">
            <p className="text-slate-600 italic text-base lg:text-lg leading-9 max-w-3xl mx-auto">
              "لسنا الكل بل جزء من الكل يدفعنا الأمل والإيمان بالواجب إلى التطلع نحو النهضة، متمسكين بالحوار منهجاً، وبالعلم مطلباً، وبالتجديد حقيقة ومنطلقاً."
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://www.instagram.com/orema.tanger"
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-purple-200"
            >
              <Instagram className="w-5 h-5" />
              <span>تابعنا على إنستغرام</span>
            </Link>
            
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors active:scale-95 shadow-lg"
            >
              <ArrowRight className="w-5 h-5" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </motion.div>

        <div className="text-center mt-8 text-slate-400 text-sm font-medium pb-8">
          © {new Date().getFullYear()} منظمة التجديد الطلابي - فرع طنجة
        </div>
      </motion.div>
    </main>
  );
}
