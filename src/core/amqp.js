const amqp = require("amqplib");
const { Subject } = require("rxjs");
const { amqpConfig } = require("../utils/vars");

const Broker = amqp.connect(amqpConfig.uri);
let chanel;

Broker.then((connection) => {
  console.log("AMQP: connected");
  connection.createChannel().then((channel) => {
    channel.checkExchange(amqpConfig.exName);
    chanel = channel;
  });
});

Broker.catch((err) => {
  console.error("AMQP: Connection Error", err);
  process.exit(1);
});

const getEventQueue = (concurrentSubscribers) => {
  const EventsQueue = new Subject();
  Broker.then((connection) => {
    connection.createChannel().then((channel) =>
      channel.checkExchange(amqpConfig.exName).then(() =>
        channel
          .assertQueue(amqpConfig.queueName, {
            arguments: { "x-queue-type": "classic" },
          })
          .then((q) => {
            channel.prefetch(concurrentSubscribers);
            channel
              .bindQueue(q.queue, amqpConfig.exName, amqpConfig.eventRoute)
              .then(() =>
                channel.consume(
                  amqpConfig.queueName,
                  (msg) =>
                    msg &&
                    EventsQueue.next({
                      ...msg,
                      ack: () => channel.ack(msg),
                    }),
                  { noAck: false }
                )
              );
          })
      )
    );
  });

  return EventsQueue;
};

module.exports = {
  Broker,
  getEventQueue,
};
