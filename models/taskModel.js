import { Schema, model } from "mongoose";

const subtaskSchema = new Schema({
  title: {
    type: String,
    required: [true, "A subtask must have a title"],
    trim: true,
    maxlength: [
      50,
      "A subtask name must have less or equal then 50 characters",
    ],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
});

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: [true, "A comment must have text"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const recurrenceSchema = new Schema({
  type: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true,
  },
  interval: {
    type: Number,
    required: true,
    min: 1,
  },
  endDate: Date,
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, "A task must have a title"],
    trim: true,
    maxlength: [
      50,
      "A subtask name must have less or equal then 50 characters",
    ],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "in-progress", "completed"],
      message: "Status is either: pending, in-progress or completed",
    },
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: false,
    default: "low",
  },
  dueDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  assignToAll: {
    type: Boolean,
    default: false,
  },
  unassignedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  recurrence: recurrenceSchema,
});

// taskSchema.pre('aggregate', function (next) {
//   console.log(this.pipeline());
//   next();
// });

const Task = model("Task", taskSchema);
export default Task;
