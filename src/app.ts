import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();

const httpServer = createServer(app);
const ioServer = new Server(httpServer, { 
  cors: { origin: '*' }
});

app.use(cors());

ioServer.on('connection', (socket) => {
  console.log('ioServer connection')

  socket.on('connect', () => {
    console.log('ioServer:  connect event received.');
  });

  socket.on('signal', () => {
    console.log('ioServer:  signal event received.');
  });

  socket.on('newProducer', () => {
    console.log('ioServer:  newProducer event received.');
  });

  socket.on('consumerCatchUp', () => {
    console.log('ioServer:  consumerCatchUp event received.');
  });

  socket.on('consume', () => {
    console.log('ioServer:  consume event received.');
  });
});

export default httpServer;