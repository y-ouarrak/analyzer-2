const mongoose = require("mongoose");

/**
 * DeviceState Schema
 * @private
 */
const deviceStateSchema = new mongoose.Schema(
  {
    serial: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    temp: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef DeviceState
 */
module.exports = mongoose.model("DeviceState", deviceStateSchema);
