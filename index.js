import fs from 'fs';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import 'dotenv/config';

const PORT = process.env.PORT || 8000
const index = fs.readFileSync('./index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end(index);
});

server.listen(PORT, () => {
  console.log('Listen port 8000');
});

const ws = new WebSocketServer({ server });

ws.on('connection', (connection, req) => {
  console.log(`New connection: ${req.socket.remoteAddress}`);

  connection.on('message', (message) => {
    console.log('Received: ' + message);
  
    for (const client of ws.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;
      if (client === connection) continue;
      client.send(message, { binary: false });
    }
  });
});
