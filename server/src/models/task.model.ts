import { Schema, model, models, Document, Types } from 'mongoose';

export interface ISubtask {
  title: string;
  completed: boolean;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: Date;
  owner: Types.ObjectId;
  subtasks: ISubtask[];
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
  },
  { _id: true }
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
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
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

export const Task = models.Task || model<ITask>('Task', taskSchema);
export default Task;
