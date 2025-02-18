const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Um usuário conectou');

  socket.on('audio-stream', (data) => {
    socket.broadcast.emit('audio-stream', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectou');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});