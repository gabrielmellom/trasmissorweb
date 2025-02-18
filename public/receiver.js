// receiver.js
const WebSocket = require('ws');
const speaker = require('speaker');

const ws = new WebSocket('ws://seu-servidor-render.onrender.com:8080'); // Substitua pelo URL do seu servidor no Render

const audioOutput = new speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,
});

ws.on('message', (message) => {
    audioOutput.write(message); // Reproduz o áudio recebido
});

console.log('Recebendo áudio ao vivo...');