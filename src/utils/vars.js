const path = require("path");
const dorEnv = require("dotenv-safe");

// import .env variables
if (process.env.NODE_ENV !== "production") {
  dorEnv.config({
    path: path.join(__dirname, "../../.env"),
    sample: path.join(__dirname, "../../.env.example"),
  });
}

module.exports = {
  env: process.env.NODE_ENV,
  logs: process.env.NODE_ENV === "production" ? "combined" : "dev",
  mongo: {
    uri:
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
  amqpConfig: {
    uri: process.env.AMQP_URI,
    exName: process.env.AMQP_EVENTS_EX_NAME,
    queueName: process.env.AMQP_EVENTS_QUEUE,
    eventRoute: process.env.AMQP_EVENTS_ROUTING,
  },
  redisUri: process.env.REDIS_URI,
};
