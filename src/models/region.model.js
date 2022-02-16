const mongoose = require("mongoose");

const regionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Region
 */
const Region = mongoose.model("Region", regionSchema);

module.exports = Region;
