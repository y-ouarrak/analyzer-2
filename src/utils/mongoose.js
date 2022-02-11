const mongoose = require("mongoose");
// const logger = require('./logger');
const { mongo, env } = require("./vars");
const { deviceState, Devices } = require("../models");
const { lastAlert, devices } = require("./cache");
// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on("error", (err) => {
  // logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// print mongoose logs in dev env
if (env === "development") {
  mongoose.set("debug", true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      keepAlive: 1,
      useNewUrlParser: true,
    })
    .then(async () => {
      console.log("mongoDB connected...");
      const _devices = await Devices.find()
        .populate("region", "name")
        .populate("province", "name");
      for (const _device of _devices) {
        devices.set(
          _device.serial,
          {
            name: _device.name,
            serial: _device.serial,
            region: _device.region.name,
            province: _device.province.name,
          },
          0
        );
      }
      const events = await deviceState.find();
      for (const event of events) {
        lastAlert.set(event.serial, event.date, 60 * 20);
      }
    });
  return mongoose.connection;
};
