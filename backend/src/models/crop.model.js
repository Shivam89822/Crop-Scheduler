const mongoose = require("mongoose");
const { CROP_STATUSES, CROP_TYPES } = require("../constants/crop.constants");

const cropSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true
    },
    type: {
      type: String,
      enum: Object.values(CROP_TYPES),
      required: true
    },
    variety: {
      type: String,
      required: true,
      trim: true
    },
    sowingDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(CROP_STATUSES),
      default: CROP_STATUSES.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Crop", cropSchema);
