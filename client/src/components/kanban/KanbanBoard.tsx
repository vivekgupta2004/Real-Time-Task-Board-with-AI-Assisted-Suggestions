'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Task, TaskStatus } from '@/types/task';
import KanbanColumn from './KanbanColumn';
import Pagination from '@/components/common/Pagination';
import toast from 'react-hot-toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const formatStatusName = (status: TaskStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
  }
};

export const KanbanBoard = () => {
  const { tasks, pagination, isLoading, error, fetchTasks, updateTask, setPage } = useTaskStore();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAnimRef = useRef<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stopAutoScroll = () => {
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task._id);
  };

  const handleBoardDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current || !draggedTask) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX;

    const edgeThreshold = 60;
    let speed = 0;

    if (clientX > 0 && clientX < rect.left + edgeThreshold) {
      const ratio = (rect.left + edgeThreshold - clientX) / edgeThreshold;
      speed = -Math.max(4, Math.round(ratio * 14));
    } else if (clientX > rect.right - edgeThreshold && clientX < window.innerWidth) {
      const ratio = (clientX - (rect.right - edgeThreshold)) / edgeThreshold;
      speed = Math.max(4, Math.round(ratio * 14));
    }

    if (speed !== 0) {
      if (!scrollAnimRef.current) {
        const step = () => {
          if (containerRef.current) {
            containerRef.current.scrollLeft += speed;
            scrollAnimRef.current = requestAnimationFrame(step);
          }
        };
        scrollAnimRef.current = requestAnimationFrame(step);
      }
    } else {
      stopAutoScroll();
    }
  };

  const handleDropTask = async (targetStatus: TaskStatus) => {
    stopAutoScroll();
    if (!draggedTask) return;

    const currentStatus = draggedTask.status;
    if (currentStatus === targetStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await updateTask(draggedTask._id, { status: targetStatus });

      if (targetStatus === 'completed') {
        toast.success(
          draggedTask.subtasks && draggedTask.subtasks.length > 0
            ? 'Task & all subtasks completed!'
            : 'Task marked as Completed!'
        );
      } else {
        toast.success(`Task moved to ${formatStatusName(targetStatus)}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task status';
      toast.error(msg);
    } finally {
      setDraggedTask(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col space-y-4 shadow-xs"
          >
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-8 text-center max-w-md mx-auto my-8 shadow-xs">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3 stroke-[1.8]" />
        <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300">Failed to Load Tasks</h3>
        <p className="text-sm text-rose-700 dark:text-rose-400 mt-1 mb-5">{error}</p>
        <button
          onClick={() => fetchTasks()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >

          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div>
      <div
        ref={containerRef}
        onDragOver={handleBoardDragOver}
        onDragLeave={stopAutoScroll}
        onDragEnd={stopAutoScroll}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory md:snap-none pb-4"
      >
        <KanbanColumn
          status="pending"
          title="Pending"
          tasks={pendingTasks}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />

        <KanbanColumn
          status="in_progress"
          title="In Progress"
          tasks={inProgressTasks}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />

        <KanbanColumn
          status="completed"
          title="Completed"
          tasks={completedTasks}
          onDragStart={handleDragStart}
          onDropTask={handleDropTask}
        />
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default KanbanBoard;
