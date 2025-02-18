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

// Armazenar informações sobre clientes conectados
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('🟢 Nova conexão:', socket.id);
  connectedClients.set(socket.id, {
    role: 'unknown',
    lastActivity: Date.now()
  });

  // Log do número total de clientes
  console.log('📊 Total de clientes conectados:', connectedClients.size);

  socket.on('register-role', (role) => {
    console.log(`🔷 Cliente ${socket.id} registrou-se como: ${role}`);
    connectedClients.get(socket.id).role = role;
  });

  socket.on('audio-stream', (data) => {
    const client = connectedClients.get(socket.id);
    console.log(`📨 Recebendo áudio de ${socket.id} (${client?.role || 'unknown'})`);
    console.log(`   Tamanho do chunk: ${data.size} bytes`);
    console.log(`   Tipo do dado:`, typeof data, data instanceof Blob ? 'Blob' : 'Outro formato');
    
    // Broadcast para todos os receptores
    socket.broadcast.emit('audio-stream', data);
    console.log('   ✈️ Áudio transmitido para outros clientes');
  });

  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
    connectedClients.delete(socket.id);
    console.log('📊 Total de clientes restantes:', connectedClients.size);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});