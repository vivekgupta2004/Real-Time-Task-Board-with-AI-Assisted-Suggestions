'use client';

import React from 'react';
import { Layers, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';

export const SummaryCards = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const cards = [
    {
      title: 'Total Tasks',
      count: totalTasks,
      icon: Layers,
      gradient: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/15 border border-violet-400/20',
    },
    {
      title: 'Pending Tasks',
      count: pendingTasks,
      icon: Clock,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/15 border border-amber-400/20',
    },
    {
      title: 'In Progress',
      count: inProgressTasks,
      icon: PlayCircle,
      gradient: 'bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-md shadow-cyan-500/15 border border-sky-400/20',
    },
    {
      title: 'Completed Tasks',
      count: completedTasks,
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-teal-500/15 border border-emerald-400/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center justify-between ${card.gradient}`}
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/85">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5">{card.count}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
              <Icon className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
