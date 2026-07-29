'use client';

import React, { useState } from 'react';
import { Task, TaskStatus } from '@/types/task';
import KanbanCard from './KanbanCard';
import { Clock, PlayCircle, CheckCircle2, ClipboardList } from 'lucide-react';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, task: Task) => void;
  onDropTask: (targetStatus: TaskStatus) => void;
}

const getColumnHeaderConfig = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return {
        icon: Clock,
        columnBg: 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40',
        topBorder: 'border-t-2 border-t-amber-500',
        badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200 dark:border-amber-800',
        headerBorder: 'border-amber-200/80 dark:border-amber-900/40',
        iconBg: 'bg-amber-100/80 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
        emptyText: 'No Pending Tasks',
      };
    case 'in_progress':
      return {
        icon: PlayCircle,
        columnBg: 'bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-900/40',
        topBorder: 'border-t-2 border-t-sky-500',
        badgeBg: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200 border border-sky-200 dark:border-sky-800',
        headerBorder: 'border-sky-200/80 dark:border-sky-900/40',
        iconBg: 'bg-sky-100/80 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300',
        emptyText: 'No Tasks In Progress',
      };
    case 'completed':
      return {
        icon: CheckCircle2,
        columnBg: 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40',
        topBorder: 'border-t-2 border-t-emerald-500',
        badgeBg: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800',
        headerBorder: 'border-emerald-200/80 dark:border-emerald-900/40',
        iconBg: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
        emptyText: 'No Completed Tasks',
      };
  }
};

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  tasks,
  onDragStart,
  onDropTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = getColumnHeaderConfig(status);
  const IconComponent = config.icon;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl border shadow-2xs p-4 transition-all duration-200 min-h-[550px] snap-center shrink-0 w-full md:w-auto ${
        config.columnBg
      } ${config.topBorder} ${
        isDragOver
          ? 'border-2 border-dashed border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-inner scale-[1.01]'
          : ''
      }`}
    >
      <div className={`flex items-center justify-between pb-3.5 mb-4 border-b ${config.headerBorder}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border border-white/80 dark:border-slate-700 shadow-2xs ${config.iconBg}`}>
            <IconComponent className="w-4 h-4 stroke-[2.2]" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full shadow-2xs ${config.badgeBg}`}>
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {tasks.length === 0 ? (
          <div className="h-56 border border-dashed border-slate-300/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center my-auto bg-white dark:bg-slate-900/60 shadow-2xs">
            <ClipboardList className="w-9 h-9 text-slate-400 dark:text-slate-600 mb-2.5 stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{config.emptyText}</p>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">Drag tasks here to update status</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task._id} task={task} onDragStart={onDragStart} />
          ))
        )}

        {isDragOver && (
          <div className="h-24 border-2 border-dashed border-indigo-500 dark:border-indigo-500 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 animate-pulse">
            Drop task here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
