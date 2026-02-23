import express from "express";
import managerController from "../controller/managerController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// All manager routes require authentication + manager role
router.use(protect, authorize("manager"));

// Project Routes
router.get("/projects/available", managerController.getAvailableProjects);
router.post("/projects/select/:id", managerController.selectProject);
router.post("/projects/release/:id", managerController.releaseProject);
router.get("/projects/my", managerController.getMyProjects);
router.get("/projects/progress/:id", managerController.getProjectProgress);

// Task Routes
router.post("/tasks", managerController.createTask);
router.get("/tasks", managerController.getTasks);
router.put("/tasks/:id", managerController.updateTask);
router.put("/tasks/assign/:id", managerController.assignTask);
router.delete("/tasks/:id", managerController.deleteTask);

// Employees
router.get("/employees", managerController.getEmployees);

// Update Project
router.put("/projects/:id", managerController.updateProject);

export default router;
