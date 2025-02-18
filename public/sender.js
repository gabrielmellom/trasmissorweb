// sender.js
const WebSocket = require('ws');
const mic = require('mic');

const ws = new WebSocket('ws://seu-servidor-render.onrender.com:8080'); // Substitua pelo URL do seu servidor no Render

const micInstance = mic({
    rate: '44100',
    channels: '2',
    debug: true,
    exitOnSilence: 6,
});

const micInputStream = micInstance.getAudioStream();

micInputStream.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data); // Envia o áudio para o servidor
    }
});

micInstance.start();

console.log('Enviando áudio ao vivo...');