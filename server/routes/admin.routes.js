import express from "express";
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";
import { verifyAdminToken } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.post("/create", createAdmin);
router.post("/login", loginAdmin);

// Protected routes (require admin authentication)
router.use(verifyAdminToken); // All routes below require admin authentication

router.post("/logout", logoutAdmin);
router.get("/profile", getCurrentAdmin);
router.put("/profile", updateAdminProfile);
router.put("/change-password", changeAdminPassword);

// Admin management routes
router.get("/all", getAllAdmins);
router.delete("/:adminId", deleteAdmin);

export default router;
