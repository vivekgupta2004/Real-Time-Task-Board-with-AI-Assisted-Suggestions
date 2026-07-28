'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';

export const SummaryCards = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const cards = [
    {
      title: 'Total Tasks',
      count: totalTasks,
      icon: Layers,
      gradient: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-500/20',
    },
    {
      title: 'Pending Tasks',
      count: pendingTasks,
      icon: Clock,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/20',
    },
    {
      title: 'Completed Tasks',
      count: completedTasks,
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-6 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card.gradient}`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/80">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5">{card.count}</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Icon className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;

