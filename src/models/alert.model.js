const mongoose = require("mongoose");

/**
 * alert Schema
 * @private
 */
const alertSchema = new mongoose.Schema(
  {
    serial: {
      type: String,
      required: true,
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
    state: {
      type: String,
      required: true,
    },
    type: String,
    name: String,
    region: String,
    province: String,
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef alert
 */
module.exports = mongoose.model("alert", alertSchema);
