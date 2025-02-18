const WebSocket = require('ws');
const { play } = require('sound-play');
const fs = require('fs');
const path = require('path');

const ws = new WebSocket('ws://seu-servidor-render.onrender.com:8080'); // Substitua pelo URL do seu servidor

// Cria um arquivo temporário para armazenar o áudio recebido
const tempFilePath = path.join(__dirname, 'temp_audio.wav');

ws.on('message', (chunk) => {
  // Salva o áudio recebido em um arquivo temporário
  fs.appendFileSync(tempFilePath, chunk);

  // Reproduz o áudio
  play(tempFilePath)
    .then(() => {
      console.log('Áudio reproduzido com sucesso!');
    })
    .catch((err) => {
      console.error('Erro ao reproduzir áudio:', err);
    });

  // Limpa o arquivo temporário após a reprodução
  fs.unlinkSync(tempFilePath);
});

console.log('Recebendo áudio ao vivo...');