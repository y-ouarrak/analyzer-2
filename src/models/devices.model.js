const mongoose = require("mongoose");

/**
 * device Schema
 * @private
 */
const deviceSchema = new mongoose.Schema({
  name: String,
  serial: {
    type: String,
    unique: true,
  },
  ref: String,
  created: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: Number,
  },
  stockType: {
    type: String,
    index: true,
  },
  province: {
    type: mongoose.ObjectId,
    ref: "regions",
  },
  region: {
    type: mongoose.ObjectId,
    ref: "regions",
  },
});

/**
 * @typedef device
 */
module.exports = mongoose.model("device", deviceSchema);
