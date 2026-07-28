import { Schema, model, models, Document, Types } from 'mongoose';

export interface ISubtask {
  _id: Types.ObjectId;
  title: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt?: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  completedAt: Date | null;
  owner: Types.ObjectId;
  subtasks: Types.DocumentArray<Document & ISubtask>;
  createdAt: Date;
  updatedAt: Date;
}

const subtaskSchema = new Schema<ISubtask>(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true, timestamps: { createdAt: true, updatedAt: false } }
);

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task owner is required'],
      index: true,
    },
    subtasks: [subtaskSchema],
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ owner: 1, priority: 1 });

export const Task = models.Task || model<ITask>('Task', taskSchema);
export default Task;
