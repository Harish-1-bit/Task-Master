import express from "express";
import employeeController from "../controller/employeeController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();

// All employee routes require authentication + employee role
router.use(protect, authorize("employee", "manager", "admin"));

// Task Routes
router.get("/tasks", employeeController.getMyTasks);
router.get("/tasks/:id", employeeController.getTask);
router.put("/tasks/status/:id", employeeController.updateTaskStatus);

// Comment Routes
router.post("/tasks/comment/:id", employeeController.addComment);
router.get("/tasks/comments/:id", employeeController.getComments);

export default router;
