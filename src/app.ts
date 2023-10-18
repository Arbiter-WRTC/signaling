import express from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

const app = express();

const httpServer = createServer(app);
const ioServer = new Server(httpServer, { 
  cors: { origin: '*' },
});

app.use(cors());

type ClientConnectProps = {
  type: string;
  id: string;
};

let sfuSocket: Socket;
const clients = new Map();

ioServer.on('connection', (socket: Socket) => {
  console.log('ioServer connection');
  /**
   * Client generates a UUID on its end
   * Sends with the clientConnect signal
   * Is UUID already in Map?
   *  Replace Value with new Socket
   * Else
   *  Create a new KV Pair with UUID as key, socket as value
   */
  socket.on('clientConnect', (data: ClientConnectProps) => {
    const { type } = data;
    if (type === 'sfu') {
      sfuSocket = socket;
      console.log('SFU Connected, Storing Socket');
    } else if (type === 'client') {
      if (!sfuSocket) {
        socket.emit('error', 'SFU not connected, try again later');
        return;
      }
      console.log(`Client ${socket.id} Connected`);
      clients.set(socket.id, socket);
    } else {
      socket.emit('error', 'Missing valid type property');
    }
  });

  socket.on('producerHandshake', () => {
    console.log('ioServer:  signal event received.');
    sfuSocket.emit('test');
    if (socket === sfuSocket) {
      // TODO: Handle receiving signal from SFU
    } else {
      // TODO: Handle receiving signal from a client
      // emit('signal', { ...data, sender: socket.id })
    }
  });

  socket.on('newProducer', () => {
    console.log('ioServer:  newProducer event received.');
  });

  socket.on('consumerCatchUp', () => {
    console.log('ioServer:  consumerCatchUp event received.');
  });

  socket.on('consumerHandshake', () => {
    console.log('ioServer:  consume event received.');
  });
});

export default httpServer;