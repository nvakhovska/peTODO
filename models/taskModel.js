import { Schema, model } from 'mongoose';

const subtaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A subtask must have a title'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  }
});

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'A comment must have text']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const recurrenceSchema = new Schema({
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  interval: {
    type: Number,
    required: true,
    min: 1
  },
  endDate: Date
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'A task must have a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  assignedTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignToAll: {
    type: Boolean,
    default: false
  },
  unassignedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  recurrence: recurrenceSchema
});

const Task = model('Task', taskSchema);
export default Task;