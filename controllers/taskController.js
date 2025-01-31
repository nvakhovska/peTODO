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
    const newTask = await Task.create(req.body);

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
    await Task.findByIdAndDelete(req.params.id);
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
    // Extract the custom userName from the request (like user_id_1)
    const userName = req.params.userName;
    console.log(userName);

    // Find the user document based on the custom userId (username)
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
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
}
