import Project from "../model/projectModel.js";
import User from "../model/userModel.js";
import Task from "../model/taskModel.js";

const createProject = async (req, res, next) => {
  try {
    const { name, description, category, priority, deadLine, budget, tags } =
      req.body;
    console.log(name, description, category, priority, deadLine, budget, tags);
    if (!name || !description || !category || !deadLine) {
      res.status(400);
      throw new Error(
        "Please provide name, description, category, and deadline",
      );
    }
    const project = await Project.create({
      name,
      description,
      category,
      priority,
      deadLine,
      budget,
      tags,
      createdBy: req.user._id,
    });
    await project.populate("createdBy");
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("createdBy")
      .populate("assignedManager")
      .populate("assignedEmployees")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy")
      .populate("assignedManager")
      .populate("assignedEmployees");

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const tasks = await Task.find({ project: project._id })
      .populate("assignedTo")
      .populate("assignedBy");

    res.status(200).json({ project, tasks });
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
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !["admin", "manager", "employee"].includes(role)) {
      res.status(400);
      throw new Error("Please provide a valid role (admin, manager, employee)");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: role },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const changeUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.isActive = !user.isActive;
    await user.save();

    res
      .status(200)
      .json({ _id: user._id, name: user.name, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

const adminController = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getAllUsers,
  getUser,
  changeUserRole,
  changeUserStatus,
};

export default adminController;
