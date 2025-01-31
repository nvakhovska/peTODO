import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config({ path: "./config.env" });

// Get the current directory of the module
const __dirname = dirname(fileURLToPath(import.meta.url));
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILES
const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/data/10tasks.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
);

// FUNCTION TO ASSIGN USERS TO TASKS RANDOMLY
const assignUsersToTasks = async (tasks) => {
  try {
    // Loop through each task and randomly assign users
    const assignedTasks = tasks.map((task) => {
      const randomUsers = [];
      const numberOfUsersToAssign =
        Math.floor(Math.random() * users.length) + 1; // Assign 1 or more users

      // Randomly select users for this task
      while (randomUsers.length < numberOfUsersToAssign) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!randomUsers.includes(randomUser._id)) {
          randomUsers.push(randomUser._id);
        }
      }

      return { ...task, assignedTo: randomUsers };
    });

    return assignedTasks;
  } catch (err) {
    console.error(err);
    throw new Error("Error assigning users to tasks");
  }
};

// UPDATE USERS WITH ASSIGNED TASKS
const updateUserTasks = async (tasksWithUsers) => {
  try {
    // Loop through each task and update the corresponding users' tasks field
    for (const task of tasksWithUsers) {
      for (const userId of task.assignedTo) {
        const user = await User.findById(userId);
        if (user) {
          user.tasks.push(task._id);
          await user.save();
        }
      }
    }
    console.log("Users successfully updated with assigned tasks!");
  } catch (err) {
    console.error("Error updating users with assigned tasks", err);
  }
};

// IMPORT USERS AND ASSIGN TASKS
const importData = async () => {
  try {
    // Import users first
    await User.create(users);
    console.log("Users successfully loaded!");

    // Assign users to tasks randomly
    const tasksWithUsers = await assignUsersToTasks(tasks);

    // Import tasks with assigned users
    const importedTasks = await Task.create(tasksWithUsers);
    console.log("Tasks successfully loaded with assigned users!");

    // Update users with assigned tasks
    await updateUserTasks(importedTasks);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Task.deleteMany();
    await User.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// COMMAND LINE ARGUMENTS

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Incorrect flag. Please use one of the following options:");
  console.log(
    "  --import   : Import tasks into the system and assign users randomly"
  );
  console.log("  --delete   : Delete all tasks and users from the system");
  process.exit();
}
