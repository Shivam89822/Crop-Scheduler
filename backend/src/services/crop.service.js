const Crop = require("../models/crop.model");
const Farm = require("../models/farm.model");
const Task = require("../models/task.model");
const ApiError = require("../utils/api-error");
const generateScheduleTasks = require("./schedule/schedule-engine.service");

const createCropWithSchedule = async (payload) => {
  const farm = await Farm.findById(payload.farmId);

  if (!farm) {
    throw new ApiError(404, "Farm not found");
  }

  const crop = await Crop.create(payload);
  const generatedTasks = generateScheduleTasks(crop);

  const tasks = await Task.insertMany(
    generatedTasks.map((task) => ({
      ...task,
      cropId: crop._id
    }))
  );

  return { crop, tasks };
};

const getCropById = async (cropId) => {
  const crop = await Crop.findById(cropId).populate("farmId");

  if (!crop) {
    throw new ApiError(404, "Crop not found");
  }

  return crop;
};

module.exports = {
  createCropWithSchedule,
  getCropById
};
