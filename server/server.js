const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

let players = {};

wss.on('connection', ws => {
  const id = Math.random().toString(36).slice(2);
  players[id] = { x: 0, y: 1.6, z: 0 };

  ws.send(JSON.stringify({ type: 'init', id }));

  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.type === 'update') {
      players[id] = data.position;
    }
    broadcast();
  });

  ws.on('close', () => {
    delete players[id];
    broadcast();
  });
});

function broadcast() {
  const packet = JSON.stringify({ type: 'players', players });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(packet);
    }
  });
}

console.log(`LIAMSTER69 FPS server running on port ${PORT}`);
