const express = require("express");
const appB = express();
const httpB = require("http").createServer(appB);
const ioB = require("socket.io")(httpB);
const redisAdapterB = require("socket.io-redis");
const redisB = require("ioredis");

ioB.adapter(redisAdapterB({ host: "localhost", port: 6379 }));

BRedis = new redisB();
BRedis.subscribe("send-message");
BRedis.subscribe("send-message-teste");
BRedis.on("message", (channel, message) => {
  console.log("channel", channel);
  console.log("received", JSON.parse(message));
  ioB.emit("send-message", message);
});

ioB.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);
  socket.on("send-message", (message) => {
    console.log("send-message-socket", message);
    // BRedis.publish("send-message", JSON.stringify(message));
  });
  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const port = process.env.PORT || 4000;
httpB.listen(port, () => {
  console.log(`Servidor B rodando na porta ${port}`);
});
