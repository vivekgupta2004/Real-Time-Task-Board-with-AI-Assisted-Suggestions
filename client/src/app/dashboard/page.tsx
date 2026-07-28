import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TaskList from '@/components/task/TaskList';
import TaskModal from '@/components/task/TaskModal';
import DeleteConfirmationModal from '@/components/task/DeleteConfirmationModal';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-4">
        <DashboardHeader />
        <SummaryCards />
        <TaskList />
        <TaskModal />
        <DeleteConfirmationModal />
      </div>
    </ProtectedRoute>
  );
}
