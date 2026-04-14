'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F1F7F4] p-4 lg:p-8 font-sans overflow-hidden">
      {/* Background Accents */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[1080px] bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-white md:min-h-[600px] md:max-h-[90vh]">
        
        {/* Left Side - Vibrant primary Branding */}
        <div className="w-full md:w-[44%] bg-primary-600 p-8 sm:p-10 lg:p-14 flex flex-col relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800" />
           <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
           
           <div className="relative z-10 flex flex-col h-full justify-between">
            <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-900/10">
                <Compass size={22} strokeWidth={2.5} />
              </div>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tighter uppercase">Voyage</span>
            </Link>

            <div className="space-y-6 sm:space-y-10 mt-12 mb-4 md:mt-0 md:mb-0">
              <div className="space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black text-primary-50 uppercase tracking-widest backdrop-blur-sm">
                  <Sparkles size={11} />
                  Operational Protocol 4.1
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase">
                  Elevate <br />
                  <span className="text-primary-300">Your Voyage</span>
                </h2>
                <p className="text-primary-50/70 text-xs sm:text-sm font-medium max-w-[300px] leading-relaxed">
                  Join a synchronized safety matrix designed for the modern explorer. Secure your global profile today.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Clean High-Contrast Form with Flip Animation */}
        <div className="flex-1 p-8 sm:p-10 lg:p-16 bg-white flex flex-col justify-center relative perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, rotateY: 90, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.95 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for snappy feel
                rotateY: { type: "spring", stiffness: 100, damping: 20 }
              }}
              className="w-full max-w-sm mx-auto my-auto h-full flex flex-col justify-center py-4 md:py-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
