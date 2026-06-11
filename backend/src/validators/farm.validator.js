const ApiError = require("../utils/api-error");

const validateCreateFarm = (req, res, next) => {
  const { userId, name, area, location } = req.body;

  if (!userId || !name || area === undefined || !location) {
    return next(new ApiError(400, "userId, name, area and location are required"));
  }

  if (typeof area !== "number" || area <= 0) {
    return next(new ApiError(400, "area must be a positive number"));
  }

  return next();
};

module.exports = validateCreateFarm;
