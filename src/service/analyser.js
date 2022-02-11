const { captureRejections } = require("node-cache");
const { Subject, async } = require("rxjs");
const { filter, mergeMap } = require("rxjs/operators");
const { deviceState, Alert } = require("../models");
const { lastAlert, devices, state } = require("../utils/cache");
const analyzer = new Subject();

lastAlert.on("expired", async (key, value) => {
  console.log(key);
  const d = await deviceState.deleteOne({
    serial: key,
  });
  console.log(d);
});

analyzer
  .pipe(
    filter((data) => !!data),
    mergeMap(async ({ payload }) => {
      try {
        const event = JSON.parse(payload);
        return {
          event,
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    }),
    filter((data) => !!data)
  )
  .subscribe(async ({ event }) => {
    try {
      event.serial = event.serial + "";
      if (parseFloat(event.temp) > 8 || parseFloat(event.temp) < 2) {
        if (!lastAlert.has(event.serial)) {
          try {
            const data = new deviceState({
              serial: event.serial,
              temp: event.temp,
            });
            await data.save();
          } catch (err) {}
          lastAlert.set(event.serial, new Date(), 60 * 20);
        } else {
          const tmp = new Date();
          if (
            tmp.getTime() - lastAlert.get(event.serial).getTime() >
            2000 * 60 * 20
          ) {
            await deviceState.updateOne(
              { serial: event.serial },
              {
                temp: event.temp,
                date: tmp,
              }
            );
            lastAlert.set(event.serial, new Date(), 60 * 20);
            let _device = {
              name: "",
              region: "",
              province: "",
            };
            if (devices.has(event.serial)) {
              const _tmp = devices.get(event.serial);
              _device = { ..._tmp };
            }
            const alert = new Alert({
              serial: event.serial + "",
              temp: parseFloat(event.temp),
              date: tmp,
              state: parseFloat(event.temp) > 8 ? "UP" : "DOWN",
              name: _device.name,
              region: _device.region,
              province: _device.province,
              type: state[event.serial] || "-",
            });
            await alert.save();
          } else {
            lastAlert.ttl(event.serial, 60 * 20);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

module.exports = analyzer;
