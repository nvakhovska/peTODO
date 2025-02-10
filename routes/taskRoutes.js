import { Router } from "express";
import {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats,
  getTaskForUser,
} from "../controllers/taskController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const router = Router();

router.route("/task-stats").get(getTaskStats);
router.route("/task-for-user/:id").get(protect, getTaskForUser);

router
  .route("/")
  .get(protect, getAllTasks)
  .post(createTask);

router
  .route("/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(protect, restrictTo("admin"), deleteTask);

export default router;
