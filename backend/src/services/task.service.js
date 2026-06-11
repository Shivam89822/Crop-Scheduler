const Task = require("../models/task.model");
const ApiError = require("../utils/api-error");

const getTodayTasks = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return Task.find({
    dueDate: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).sort({ dueDate: 1 });
};

const markTaskComplete = async (taskId) => {
  const task = await Task.findByIdAndUpdate(
    taskId,
    { isDone: true },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

module.exports = {
  getTodayTasks,
  markTaskComplete
};
