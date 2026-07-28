import React from 'react';
import { Task } from '@/types/task';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const isCompleted = task.status === 'completed';
  const dueDateFormatted = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';
  const createdAtFormatted = new Date(task.createdAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            {task.status}
          </span>
          {task.priority && (
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${
                task.priority === 'high'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : task.priority === 'medium'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              {task.priority} priority
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1" title="Due Date">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Due: {dueDateFormatted}</span>
        </div>
        <div className="flex items-center gap-1" title="Created Date">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Created: {createdAtFormatted}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
