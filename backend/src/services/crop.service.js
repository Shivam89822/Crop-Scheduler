const Crop = require("../models/crop.model");
const Farm = require("../models/farm.model");
const Task = require("../models/task.model");
const ApiError = require("../utils/api-error");
const { isValidObjectId } = require("../utils/object-id");
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

const getCrops = async (filters = {}) => {
  const query = {};

  if (filters.farmId) {
    if (!isValidObjectId(filters.farmId)) {
      throw new ApiError(400, "Invalid farm id");
    }

    query.farmId = filters.farmId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return Crop.find(query).populate("farmId").sort({ createdAt: -1 });
};

const getCropById = async (cropId) => {
  if (!isValidObjectId(cropId)) {
    throw new ApiError(400, "Invalid crop id");
  }

  const crop = await Crop.findById(cropId).populate("farmId");

  if (!crop) {
    throw new ApiError(404, "Crop not found");
  }

  return crop;
};

module.exports = {
  createCropWithSchedule,
  getCrops,
  getCropById
};
