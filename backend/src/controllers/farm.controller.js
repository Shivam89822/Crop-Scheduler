const farmService = require("../services/farm.service");
const asyncHandler = require("../utils/async-handler");

const createFarm = asyncHandler(async (req, res) => {
  const farm = await farmService.createFarm(req.body);
  res.status(201).json({
    success: true,
    data: farm
  });
});

const getFarms = asyncHandler(async (req, res) => {
  const farms = await farmService.getFarms();
  res.status(200).json({
    success: true,
    data: farms
  });
});

module.exports = {
  createFarm,
  getFarms
};
