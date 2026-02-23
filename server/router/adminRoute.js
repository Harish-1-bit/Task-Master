import express from "express";
import adminController from "../controller/adminController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

// Project Routes
router.post("/projects", adminController.createProject);
router.get("/projects", adminController.getAllProjects);
router.get("/projects/:id", adminController.getProject);
router.put("/projects/:id", adminController.updateProject);
router.delete("/projects/:id", adminController.deleteProject);

// User Management Routes
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUser);
router.put("/users/role/:id", adminController.changeUserRole);
router.put("/users/status/:id", adminController.changeUserStatus);

export default router;
