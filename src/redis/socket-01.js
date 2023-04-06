const express = require("express");
const appA = express();
const httpA = require("http").createServer(appA);
const ioA = require("socket.io")(httpA);
const redisA = require("ioredis");
const ARedis = new redisA();

ioA.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("send-message", (message) => {
    console.log("send-message", message);
    ARedis.publish("send-message", JSON.stringify(message));
  });

  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;
httpA.listen(port, () => {
  console.log(`Servidor A rodando na porta ${port}`);
});
