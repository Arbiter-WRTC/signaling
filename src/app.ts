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

const handleClientConnect = (socket: Socket, data: ClientConnectProps): void => {
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
};

const handleProducerHandshake = (socket: Socket, data: ProducerHandshakeProps): void => {
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
};

const handleConsumerHandshake = (socket: Socket, data: ConsumerHandshakeProps): void => {
  if (socket === sfuSocket) {
    const client = clients.get(data.clientId);
    if (client) {
      console.log('Sending consumer data to Client from SFU:', data.clientId);
      client.emit('consumerHandshake', data);
    } else {
      console.log('Client not found in the clients Map.');
    }
  } else {
    console.log('Sending consumer data to SFU from:', data.clientId);
    sfuSocket.emit('consumerHandshake', data);
  }
};

const handleClientDisconnect = (socket: Socket): void => {
  console.log('client disconnected');
  if (socket === sfuSocket) {
    return; // Handle SFU Disconnect
  }

  const clientUUID = findUUIDBySocket(socket);
  if (clientUUID) {
    clients.delete(clientUUID);
    for (const [_uuid, sc] of clients) {
      sc.emit('clientDisconnect', { clientId: clientUUID });
    }
  } else {
    console.log('Socket not found in the clients Map.');
  }
};

ioServer.on('connection', (socket: Socket) => {
  console.log('ioServer connection');

  socket.on('clientConnect', (data: ClientConnectProps) => {
    handleClientConnect(socket, data);
  });

  socket.on('producerHandshake', (data: ProducerHandshakeProps) => {
    handleProducerHandshake(socket, data);
  });

  socket.on('consumerHandshake', (data: ConsumerHandshakeProps) => {
    handleConsumerHandshake(socket, data);
  });

  socket.on('disconnect', () => {
    handleClientDisconnect(socket);
  });
});

export default httpServer;
