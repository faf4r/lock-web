import express, { json, urlencoded } from "express";
import mqtt from "mqtt";

const mqtt_host = "121.41.80.56";
const mqtt_port = "1883";
const topic = "/lock";

const mqtt_client = mqtt.connect(`mqtt://${mqtt_host}:${mqtt_port}`);
mqtt_client.on("connect", () => console.log("mqtt server connected."));

const app = express();
const server_port = 8888;

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use("/", express.static("public"));

app.post("/open_door", (req, res) => {
  if (req.body.signal === "open_door") {
    mqtt_client.publish(topic, "open_door");
    res.send({message: "success"});
  } else {
    res.send({message: "error"});
  }
});

app.listen(server_port, () =>
  console.log(`Server listening on http://127.0.0.1:${server_port}`)
);
