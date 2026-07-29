'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TaskList from '@/components/task/TaskList';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskModal from '@/components/task/TaskModal';
import DeleteConfirmationModal from '@/components/task/DeleteConfirmationModal';
import { useTaskStore } from '@/store/useTaskStore';

export default function DashboardPage() {
  const { viewMode } = useTaskStore();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-4">
        <DashboardHeader />
        <SummaryCards />
        {viewMode === 'kanban' ? <KanbanBoard /> : <TaskList />}
        <TaskModal />
        <DeleteConfirmationModal />
      </div>
    </ProtectedRoute>
  );
}
