const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const redisAdapter = require("socket.io-redis");
const redis = require("redis");
const PORT = 3000;

// Crie uma conexão com o servidor Redis
const redisClient = redis.createClient();

// Adicione o adaptador Redis ao Socket.IO
io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

// Quando uma conexão é estabelecida, registre um ouvinte para o evento 'send-message'
io.on("connection", (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on("send-message", (data) => {
    // Emite o evento 'send-message' para todos os clientes conectados
    console.log("received::server::" + PORT, data);
    io.emit("send-message", data);
  });

  socket.on("message", (data) => {
    // Emite o evento 'send-message' para todos os clientes conectados
    console.log("received::server::" + PORT, data);
  });
  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

// Inicie o servidor
server.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
