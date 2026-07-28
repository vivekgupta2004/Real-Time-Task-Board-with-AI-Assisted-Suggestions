'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';

export const SummaryCards = () => {
  const tasks = useTaskStore((state) => state.tasks);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const cards = [
    {
      title: 'Total Tasks',
      count: totalTasks,
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Pending Tasks',
      count: pendingTasks,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Completed Tasks',
      count: completedTasks,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`p-5 rounded-xl border bg-white shadow-sm flex items-center justify-between ${card.color}`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.count}</h3>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
