import React from 'react';
import { Compass } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F6FBF5] relative overflow-hidden font-sans">
      {/* Soft decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-50/50 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100 ring-4 ring-white">
              <Compass size={28} />
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">
            Voyage<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Your global guide to seamless travel</p>
        </div>

        <div className="bg-white border border-emerald-100/50 rounded-[2.5rem] shadow-2xl shadow-emerald-200/50 p-10 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="relative z-10">
            {children}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs">
            © 2024 VoyageAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
