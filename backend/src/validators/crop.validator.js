const ApiError = require("../utils/api-error");
const { CROP_TYPES } = require("../constants/crop.constants");
const { isValidObjectId } = require("../utils/object-id");

const validateCreateCrop = (req, res, next) => {
  const { farmId, type, variety, sowingDate } = req.body;

  if (!farmId || !type || !variety || !sowingDate) {
    return next(new ApiError(400, "farmId, type, variety and sowingDate are required"));
  }

  if (!isValidObjectId(farmId)) {
    return next(new ApiError(400, "farmId must be a valid Mongo ObjectId"));
  }

  if (!Object.values(CROP_TYPES).includes(type)) {
    return next(new ApiError(400, "Invalid crop type"));
  }

  if (typeof variety !== "string" || !variety.trim()) {
    return next(new ApiError(400, "variety must be a non-empty string"));
  }

  if (Number.isNaN(new Date(sowingDate).getTime())) {
    return next(new ApiError(400, "Invalid sowingDate"));
  }

  return next();
};

module.exports = validateCreateCrop;
