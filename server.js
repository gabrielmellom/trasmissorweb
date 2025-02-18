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
  connectedClients.set(socket.id, {
    role: 'unknown',
    lastActivity: Date.now()
  });

  console.log('📊 Total de clientes conectados:', connectedClients.size);

  socket.on('register-role', (role) => {
    console.log(`🔷 Cliente ${socket.id} registrado como: ${role}`);
    connectedClients.get(socket.id).role = role;
  });

  socket.on('audio-stream', async (data) => {
    const client = connectedClients.get(socket.id);
    console.log(`📨 Recebendo áudio de ${socket.id} (${client?.role || 'unknown'})`);
    
    if (!(data instanceof Blob)) {
      console.warn(`⚠️ Dados recebidos não são Blob. Tipo: ${typeof data}`);
      return;
    }

    try {
      const buffer = await data.arrayBuffer();
      console.log(`   🔄 Convertendo Blob para ArrayBuffer (${buffer.byteLength} bytes)`);
      
      // Enviar para os receptores
      socket.broadcast.emit('audio-stream', buffer);
      console.log('   ✈️ Áudio transmitido para os receptores');
    } catch (error) {
      console.error('❌ Erro ao converter áudio:', error);
    }
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
