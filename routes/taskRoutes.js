import { Router } from 'express';
import {getAllTasks, createTask, getTask, updateTask, deleteTask, getTaskStats} from '../controllers/taskController.js';

const router = Router();

router.route('/task-stats').get(getTaskStats);

router
  .route('/')
  .get(getAllTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;
