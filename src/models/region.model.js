const mongoose = require("mongoose");

const { Schema } = mongoose;

const RegionSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("regions", RegionSchema);
