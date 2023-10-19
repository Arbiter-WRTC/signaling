"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const ioServer = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' },
});
app.use((0, cors_1.default)());
// type ClientConnectProps = {
//   type: string;
// };
let na;
console.log(na);
ioServer.on('connection', (socket) => {
    console.log('ioServer connection');
    socket.on('clientConnect', (data) => {
        let a;
        a = 5;
        a = 'foo';
        console.log(a);
        console.log('ioServer:  clientConnect event received.', data);
        // const { type } = data;
        // if (type === 'sfu') {
        //   // TODO: Handle SFU Connected
        //   console.log("SFU Connected, Storing Socket")
        // } else if (type === 'client') {
        //   // TODO: Handle Client Connected
        //   console.log("Client Connected, Storing Socket in Collection")
        // } else {
        //   // TODO: Handle bad clientConnect data
        // }
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
exports.default = httpServer;
