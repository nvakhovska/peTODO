import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import { fetchAggregatedData } from "../database/aggregation.js";

export async function getAllTasks(req, res) {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

export async function getTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    console.log(task);
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
}

export async function createTask(req, res) {
  try {
    const newTask = await create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
}

export async function updateTask(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
}

export async function deleteTask(req, res) {
  try {
    await findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
}

export async function getTaskStats(req, res) {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
}

export async function getTaskForUser(req, res) {
  try {
    // Extract the custom userId from the request (like user_id_1)
    const userName = req.params.userName;

    // Find the user document based on the custom userId
    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Get today's date at midnight to compare tasks due for today
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set the time to midnight
    today = today.toISOString().split(".")[0] + "Z";

    // Aggregate tasks that are assigned to the user, in-progress or pending, and due today or in the future
    const tasks = await fetchAggregatedData({
      model: Task,
      matchConditions: {
        assignedTo: { $elemMatch: { $eq: userName } },
        status: { $in: ["in-progress", "pending"] },
        dueDate: { $gte: today },
      },
      projectFields: {
        title: 1,
        description: 1,
        status: 1,
        dueDate: 1,
        priority: 1,
        assignedTo: 1,
      },
    });

    // Respond with the filtered tasks
    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
}
