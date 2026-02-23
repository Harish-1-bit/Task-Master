import Task from "../model/taskModel.js";
import Comment from "../model/commentModel.js";

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("project")
      .populate("assignedBy")
      .populate("assignedTo")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    console.log(req.params);
    const task = await Task.findById(req.params.id)
      .populate("project", "name category status")
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    if (String(task.assignedTo._id) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only view tasks assigned to you");
    }

    const comments = await Comment.find({ task: task._id })
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({ task, comments });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !["in-progress", "review", "completed"].includes(status)) {
      res.status(400);
      throw new Error(
        "Please provide a valid status (in-progress, review, completed)",
      );
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    if (String(task.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only update tasks assigned to you");
    }

    task.status = status;
    if (status === "completed") {
      task.completedAt = new Date();
    }
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error("Please provide comment text");
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    if (String(task.assignedTo) !== String(req.user._id)) {
      res.status(403);
      throw new Error("You can only comment on tasks assigned to you");
    }

    const comment = await Comment.create({
      task: task._id,
      user: req.user._id,
      text,
    });

    const populated = await comment.populate("user", "name role");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const comments = await Comment.find({ task: task._id })
      .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const employeeController = {
  getMyTasks,
  getTask,
  updateTaskStatus,
  addComment,
  getComments,
};

export default employeeController;
