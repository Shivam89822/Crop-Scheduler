const taskService = require("../services/task.service");
const asyncHandler = require("../utils/async-handler");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.query);
  res.status(200).json({
    success: true,
    data: tasks
  });
});

const getTodayTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getTodayTasks();
  res.status(200).json({
    success: true,
    data: tasks
  });
});

const markTaskComplete = asyncHandler(async (req, res) => {
  const task = await taskService.markTaskComplete(req.params.id);
  res.status(200).json({
    success: true,
    data: task
  });
});

module.exports = {
  getTasks,
  getTodayTasks,
  markTaskComplete
};
