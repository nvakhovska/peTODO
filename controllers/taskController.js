import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import { fetchAggregatedData } from "../database/aggregation.js";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllTasks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Task.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;

  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      task,
    },
  });
});

export const createTask = catchAsync(async (req, res, next) => {
  const newTask = await Task.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      task: newTask,
    },
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      task: task,
    },
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await fetchAggregatedData({
    model: Task,
    matchConditions: {
      status: { $in: ["in-progress", "pending"] },
      assignedTo: { $exists: true, $not: { $size: 0 } },
    },
    unwindFields: ["assignedTo"],
    groupBy: {
      _id: { user: "$assignedTo", status: "$status" },
      count: { $sum: 1 },
    },
    projectFields: {
      user: "$_id.user",
      status: "$_id.status",
      taskCount: "$count",
      _id: 0,
    },
  });

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

export const getTaskForUser = catchAsync(async (req, res, next) => {
  // Extract the custom userName from the request (like user_id_1)
  const { userName } = req.params;
  console.log(userName);

  // Find the user document based on the custom userId (username)
  const user = await User.findOne({ username: userName });
  if (!user) {
    return next(new AppError("No user found with that userName", 404));
  }

  // Get today's date at midnight to compare tasks due for today
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Set the time to midnight

  // Aggregate tasks that are assigned to the user, in-progress or pending, and due today or in the future
  const tasks = await Task.aggregate([
    {
      $match: {
        assignedTo: { $elemMatch: { $eq: user._id } },
        status: { $in: ["in-progress", "pending"] },
        dueDate: { $gte: today },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        priority: 1,
        assignedTo: 1,
      },
    },
    {
      $lookup: {
        from: "users", // the users collection
        localField: "assignedTo", // field in tasks to match with _id in users
        foreignField: "_id", // match with _id in users collection
        as: "assignedUsers", // alias for the users with matched IDs
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        priority: 1,
        assignedTo: {
          $map: {
            input: "$assignedUsers",
            as: "user",
            in: "$$user.username", // Map the usernames
          },
        },
      },
    },
  ]);

  // Respond with the filtered tasks, now with usernames in assignedTo
  res.status(200).json({
    status: "success",
    data: tasks,
  });
});
