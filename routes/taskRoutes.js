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
import { protect } from "../controllers/authController.js";

const router = Router();

router.route("/task-stats").get(getTaskStats);
router.route("/task-for-user/:userName").get(getTaskForUser);

router
  .route("/")
  .get(protect, getAllTasks)
  .post(createTask);

router
  .route("/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
