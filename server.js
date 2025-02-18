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
  console.log('Novo usuário conectado:', socket.id);

  socket.on('audio-stream', (data) => {
    console.log('Recebendo áudio de:', socket.id, 'Tamanho:', data.size, 'bytes');
    io.emit('audio-stream', data);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectou:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});