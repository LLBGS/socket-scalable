const express = require("express");
const appC = express();
const httpC = require("http").createServer(appC);
const ioC = require("socket.io")(httpC);
const redisAdapterC = require("socket.io-redis");
const redisC = require("ioredis");

ioC.adapter(redisAdapterC({ host: "localhost", port: 6379 }));

const CRedis = new redisC();
CRedis.subscribe("send-message");
CRedis.on("message", (channel, message) => {
  console.log("received", JSON.parse(message));
  ioC.emit("send-message", message);
});

ioC.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);
  socket.on("send-message", (message) => {
    console.log("send-message-socket", message);
    // BRedis.publish("send-message", JSON.stringify(message));
  });
  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const port = process.env.PORT || 4002;
httpC.listen(port, () => {
  console.log(`Servidor C rodando na porta ${port}`);
});
