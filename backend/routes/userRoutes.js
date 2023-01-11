import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  advisorSessions,
  getExpert,
  approveUser,
  verify,
  updateAdvisorProfile,
  updateUserProfile,
  resetPassword,
  payTip
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { roleAccess } from "../middleware/roleMiddleware.js";
import { advisorRole } from "../middleware/roleMiddleware.js";



// Common routes
router.route("/register").post(registerUser)
router.post("/login", authUser);
router.post("/resetPassword", resetPassword);

// User Specific routes
router.route("/experts").get(protect, getExpert)
router.route("/verification").post(protect, verify);
router.route("/updateUserProfile").put(protect, updateUserProfile);
router.route("/payTip").post(protect, payTip);


// Advisor specific routes
router
  .route("/advisorSession")
  .get(advisorRole, advisorSessions)

  router.route("/updateAdvisorProfile").put(protect, advisorRole, updateAdvisorProfile);

// Admin specific routes
router
  .route("/allUsers")
  .get(protect, roleAccess, getUsers)

router
  .route("/:id/approveUser")
  .put(protect, roleAccess, approveUser)

router
  .route("/:id")
  .delete(protect, roleAccess, deleteUser)
  .put(protect, roleAccess, updateUser)
  .get(protect, roleAccess, getUserById);

export default router;
