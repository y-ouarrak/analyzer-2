const { getEventQueue } = require("./core/amqp");
const analyser = require("./service/analyser");
const { filter, mergeMap } = require("rxjs/operators");

const mongoose = require("./utils/mongoose");

const eventQueue = getEventQueue(1000);
// open mongoose connection
mongoose.connect();

eventQueue
  .pipe(
    filter(({ content }) => !!content),
    mergeMap(async ({ ack, content, properties }) => {
      ack();
      return {
        payload: content.toString(),
      };
    }),
    filter((data) => !!data)
  )
  .subscribe((msg) => analyser.next(msg));
