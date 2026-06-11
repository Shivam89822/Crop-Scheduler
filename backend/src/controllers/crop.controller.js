const cropService = require("../services/crop.service");
const asyncHandler = require("../utils/async-handler");

const createCrop = asyncHandler(async (req, res) => {
  const result = await cropService.createCropWithSchedule(req.body);
  res.status(201).json({
    success: true,
    data: result
  });
});

const getCropById = asyncHandler(async (req, res) => {
  const crop = await cropService.getCropById(req.params.id);
  res.status(200).json({
    success: true,
    data: crop
  });
});

module.exports = {
  createCrop,
  getCropById
};
