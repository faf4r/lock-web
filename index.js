import moment from "moment"
import express, { json, urlencoded } from "express";
import mqtt from "mqtt";

const mqtt_host = "127.0.0.1";
const mqtt_port = "1883";
const topic = "/lock";

function getClientIp(req) {
	return req.headers['x-forwarded-for'] ||
	req.ip ||
	req.connection.remoteAddress ||
	req.socket.remoteAddress ||
	req.connection.socket.remoteAddress ||
	'';
}

function ipv6ToV4(ip) {
	if(ip.split(',').length>0){
		ip = ip.split(',')[0]
	}
	ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
	return ip
}

const mqtt_client = mqtt.connect(`mqtt://${mqtt_host}:${mqtt_port}`);
mqtt_client.on("connect", () => console.log("mqtt server connected."));

const app = express();
const server_port = 8888;

app.use(json()); // for parsing application/json
app.use(urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use("/", express.static("public"));

app.post("/open_door", (req, res) => {
  let ipv6 = getClientIp(req);
  let ipv4 = ipv6ToV4(ipv6);
  console.log(`【${moment().format("YYYY-MM-DD HH:mm:ss")}】IPv4: ${ipv4} IPv6: ${ipv6}`);
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
