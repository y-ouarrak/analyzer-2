const mongoose = require("mongoose");

const provinceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    region: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Region",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Province
 */
const Province = mongoose.model("Province", provinceSchema);

module.exports = Province;
