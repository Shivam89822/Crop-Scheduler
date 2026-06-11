const Task = require("../models/task.model");
const ApiError = require("../utils/api-error");
const { isValidObjectId } = require("../utils/object-id");

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

const getTasks = async (filters = {}) => {
  const query = {};

  if (filters.cropId) {
    if (!isValidObjectId(filters.cropId)) {
      throw new ApiError(400, "Invalid crop id");
    }

    query.cropId = filters.cropId;
  }

  if (filters.isDone !== undefined) {
    query.isDone = filters.isDone === "true";
  }

  return Task.find(query).sort({ dueDate: 1, createdAt: 1 });
};

const markTaskComplete = async (taskId) => {
  if (!isValidObjectId(taskId)) {
    throw new ApiError(400, "Invalid task id");
  }

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
  getTasks,
  getTodayTasks,
  markTaskComplete
};
