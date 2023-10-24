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

type ProducerHandshakeProps = {
  clientId: string;
  description: string;
  candidate: string;
};

type ConsumerHandshakeProps = {
  clientId: string;
  remotePeerId: string;
  description: string;
  candidate: string;
};

let sfuSocket: Socket;
const clients: Map<string, Socket> = new Map();

const findUUIDBySocket = (targetSocket: Socket): string | undefined => {
  for (const [uuid, socket] of clients) {
    if (socket === targetSocket) {
      return uuid;
    }
  }
  return undefined;
};

/* eslint-disable max-lines-per-function */
ioServer.on('connection', (socket: Socket) => {
  console.log('ioServer connection');
  socket.on('clientConnect', (data: ClientConnectProps) => {
    const { type, id } = data;
    if (type === 'sfu') {
      sfuSocket = socket;
      console.log('SFU Connected, Storing Socket');
    } else if (type === 'client') {
      if (!sfuSocket) {
        socket.emit('error', 'SFU not connected, try again later');
        return;
      }
      console.log('Client Connected', id);
      clients.set(id, socket);
    } else {
      socket.emit('error', 'Missing valid type property');
    }
  });

  socket.on('producerHandshake', (data: ProducerHandshakeProps) => {
    // console.log("got a producer handshake signal")
    if (socket === sfuSocket) {
      const client = clients.get(data.clientId);
      if (client) {
        console.log('Sending data to Client from SFU:', data.clientId);
        client.emit('producerHandshake', data);
      }
    } else {
      console.log('Sending data to SFU from:', data.clientId);
      sfuSocket.emit('producerHandshake', data);
    }
  });

  socket.on('consumerHandshake', (data: ConsumerHandshakeProps) => {
    if (socket === sfuSocket) {
      const client = clients.get(data.clientId);
      if (client) {
        console.log('Sending consumer data to Client from SFU:', data.clientId);
        client.emit('consumerHandshake', data);
      }
    } else {
      console.log('Sending consumer data to SFU from:', data.clientId);
      sfuSocket.emit('consumerHandshake', data);
    }
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');

    // TODO: Handle SFU Disconnect
    if (socket === sfuSocket) {
      return;
    }

    const clientUUID = findUUIDBySocket(socket);
    if (clientUUID) {
      clients.delete(clientUUID);

      // ESLint complians about this variable name, but need it to allow TS to compile
      for (const [_uuid, sc] of clients) {
        sc.emit('clientDisconnect', { clientId: clientUUID });
      }
    } else {
      console.log('Socket not found in the clients Map.');
    }
  });
});

export default httpServer;
// 600e7cfe-7086-42bb-9585-4b815f2938b8

// 0c494178-74ac-4909-85d7-7129a87755b4
