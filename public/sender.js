const record = require('node-record-lpcm16');
const WebSocket = require('ws');

const ws = new WebSocket('wss://trasmissorweb.onrender.com');
// Inicia a captura de áudio
const audioStream = record.record({
  sampleRate: 44100,
  verbose: false,
});

// Envia o áudio para o servidor
audioStream.stream().on('data', (chunk) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(chunk);
  }
});

console.log('Enviando áudio ao vivo...');