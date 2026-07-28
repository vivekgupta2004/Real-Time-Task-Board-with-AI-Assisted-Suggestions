'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Sparkles,
  Zap,
  Bell,
  ShieldCheck,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Bot,
  Layers,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Background Blur Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Powered by Google Gemini AI & Real-Time Sync</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Organize Tasks. <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Automate Subtasks.</span> Collaborate Live.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Experience an intelligent task management system with real-time Socket.IO synchronization, AI-powered subtask generation, and Firebase notifications.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Go to Dashboard ({user?.name || 'User'})</span>
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition duration-150"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl transition duration-150 shadow-sm"
              >
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Modern Productivity
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built with production-grade Next.js 15, Express, MongoDB & Google Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">AI Subtask Generator</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate actionable, structured subtask lists automatically using Google Gemini AI for faster project breakdown.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Sync</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Socket.IO keeps all connected clients in sync instantly when tasks or subtasks are updated across devices.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Automatic Status Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Parent task status updates dynamically (Pending → In Progress → Completed) based on subtask completion.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Notifications</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Stay informed with Firebase push notifications and real-time in-app notification sync.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Dashboard</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Filter by status, search title keywords, sort deadlines, and manage priority levels seamlessly.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Strict Validation & Auth</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Protected routes, JWT authentication, and strict Zod validation schemas across client and server.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-indigo-900 text-white py-16 px-4 text-center my-8 max-w-7xl mx-auto rounded-3xl w-full">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Organize Your Work?</h2>
        <p className="text-indigo-200 text-sm max-w-lg mx-auto mb-8">
          Join thousands of developers using real-time AI-assisted task board management.
        </p>
        <Link
          href={isAuthenticated ? '/dashboard' : '/signup'}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition shadow-lg"
        >
          <span>{isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} TaskBoardAiX21cc. All rights reserved.</p>
      </footer>


    </div>
  );
}
