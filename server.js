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

// Armazena informações sobre clientes conectados
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('🟢 Nova conexão:', socket.id);
  connectedClients.set(socket.id, { role: 'unknown' });

  socket.on('register-role', (role) => {
    console.log(`🔷 Cliente ${socket.id} registrado como: ${role}`);
    connectedClients.get(socket.id).role = role;
  });

  socket.on('audio-stream', (data) => {
    console.log(`📨 Recebendo áudio de ${socket.id}`);

    if (!(data instanceof ArrayBuffer)) {
      console.warn(`⚠️ Dados recebidos não são ArrayBuffer. Tipo: ${typeof data}`);
      return;
    }

    // Enviar para os receptores
    socket.broadcast.emit('audio-stream', data);
    console.log('   ✈️ Áudio transmitido para os receptores');
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
    connectedClients.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
