import Project from "../model/projectModel.js";
import Task from "../model/taskModel.js";
import User from "../model/userModel.js";
import Comment from "../model/commentModel.js";

const getAvailableProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      status: "open",
      assignedManager: null,
    })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const selectProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    if (project.assignedManager) {
      res.status(400);
      throw new Error("Project is already assigned to a manager");
    }
    if (project.status !== "open") {
      res.status(400);
      throw new Error("Only open projects can be selected");
    }

    project.assignedManager = req.user._id;
    project.status = "in-progress";
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const releaseProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    if (String(project.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only release projects assigned to you");
    }

    project.assignedManager = null;
    project.status = "open";
    project.assignedEmployees = [];
    await project.save();

    // Unassign all tasks
    await Task.updateMany(
      { project: project._id },
      { assignedTo: null, status: "in-progress" },
    );

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ assignedManager: req.user._id })
      .populate("assignedEmployees")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project,
      priority,
      category,
      deadLine,
      assignedTo,
    } = req.body;
    if (!title || !description || !project || !deadLine) {
      res.status(400);
      throw new Error(
        "Please provide title, description, project, and deadline",
      );
    }
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      res.status(404);
      throw new Error("Project not found");
    }
    if (String(projectDoc.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only create tasks in your own projects");
    }

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      category,
      deadLine,
      assignedBy: req.user._id,
      assignedTo: assignedTo || null,
    });

    // If assigned to an employee, add them to project's assignedEmployees
    if (assignedTo) {
      if (!projectDoc.assignedEmployees.includes(assignedTo)) {
        projectDoc.assignedEmployees.push(assignedTo);
        await projectDoc.save();
      }
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, priority } = req.query;
    const filter = {};
    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Only show tasks from manager's own projects
    if (!projectId) {
      const myProjects = await Project.find({
        assignedManager: req.user._id,
      }).select("_id");
      filter.project = { $in: myProjects.map((p) => p._id) };
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email skills")
      .populate("project", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    // Verify manager owns the project
    const project = await Project.findById(task.project);
    if (String(project.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only update tasks in your own projects");
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      res.status(400);
      throw new Error("Please provide employeeId");
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const project = await Project.findById(task.project);
    if (String(project.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only assign tasks in your own projects");
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== "employee") {
      res.status(400);
      throw new Error("Invalid employee");
    }

    task.assignedTo = employeeId;
    await task.save();

    // Add employee to project's assignedEmployees if not already
    if (!project.assignedEmployees.includes(employeeId)) {
      project.assignedEmployees.push(employeeId);
      await project.save();
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const project = await Project.findById(task.project);
    if (String(project.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only delete tasks in your own projects");
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ _id: task._id });
  } catch (error) {
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const employees = await User.find({
      role: "employee",
      isActive: true,
    }).select("-password");
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    )
      .populate("assignedManager")
      .populate("assignedEmployees")
      .populate("createdBy");
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

const getProjectProgress = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Verify manager owns the project (wait, checking my mapping, if manager is assigned)
    if (String(project.assignedManager) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only view progress of your own projects");
    }

    const tasks = await Task.find({ project: project._id }).populate(
      "assignedTo",
      "name email skills",
    );
    const countTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "in-progress",
    ).length;
    const reviewTasks = tasks.filter((t) => t.status === "review").length;

    const tasksIds = tasks.map((t) => t._id);
    const comments = await Comment.find({ task: { $in: tasksIds } })
      .populate("user")
      .populate("task")
      .sort({ createdAt: -1 });

    const progressStats = {
      total: countTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      review: reviewTasks,
      completionPercentage:
        countTasks > 0 ? Math.round((completedTasks / countTasks) * 100) : 0,
    };

    res.status(200).json({ tasks, comments, progressStats });
  } catch (error) {
    next(error);
  }
};

const managerController = {
  getAvailableProjects,
  selectProject,
  releaseProject,
  getMyProjects,
  createTask,
  getTasks,
  updateTask,
  assignTask,
  deleteTask,
  getEmployees,
  updateProject,
  getProjectProgress,
};

export default managerController;
