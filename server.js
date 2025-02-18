// server.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// Configurar pasta public
app.use(express.static('public'));

// Ler certificados
const options = {
  key: fs.readFileSync('./certs/private-key.pem'),
  cert: fs.readFileSync('./certs/certificate.pem')
};

// Criar servidor HTTPS
const server = https.createServer(options, app);
const io = require('socket.io')(server);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Usuário conectado');

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');
  });

  socket.on('offer', (offer, roomId) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', (answer, roomId) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });
});

// Iniciar servidor
server.listen(3000, () => {
  console.log('Servidor HTTPS rodando em https://localhost:3000');
  console.log('Para acessar do celular: https://192.168.2.138:3000');
});