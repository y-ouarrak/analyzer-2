const mongoose = require("mongoose");

const alerts = ["UP", "DOWN", "SENSOR", "UPDATE", "OFFLINE", "ERROR"];

const alertSchema = mongoose.Schema(
  {
    region: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Region",
    },
    province: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Province",
    },
    alertedAt: {
      type: Date,
      required: true,
      default: new Date(),
    },
    stockType: {
      type: String,
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: alerts,
      default: "ERROR",
    },
    name: {
      type: String,
      trim: true,
    },
    serial: {
      type: String,
      trim: true,
      require: true,
    },
    state: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "State",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Alert
 */
const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;
