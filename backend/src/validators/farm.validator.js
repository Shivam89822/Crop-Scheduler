const ApiError = require("../utils/api-error");

const validateCreateFarm = (req, res, next) => {
  const { name, area, location } = req.body;

  if (!name || area === undefined || !location) {
    return next(new ApiError(400, "name, area and location are required"));
  }

  if (typeof name !== "string" || !name.trim()) {
    return next(new ApiError(400, "name must be a non-empty string"));
  }

  if (typeof location !== "string" || !location.trim()) {
    return next(new ApiError(400, "location must be a non-empty string"));
  }

  if (typeof area !== "number" || Number.isNaN(area) || area <= 0) {
    return next(new ApiError(400, "area must be a positive number"));
  }

  return next();
};

module.exports = validateCreateFarm;
