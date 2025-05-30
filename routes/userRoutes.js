import { Router } from "express";
import passport from "passport";
import { googleAuthCallback } from "../controllers/authController.js";
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getByUsernameOrEmail,
} from "./../controllers/userController.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} from "./../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router.get("/by-username-or-email", protect, getByUsernameOrEmail);

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
