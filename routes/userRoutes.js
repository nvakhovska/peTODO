import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "./../controllers/userController.js";
import { signup, login } from "./../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router
  .route("/")
  .get(getAllUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
