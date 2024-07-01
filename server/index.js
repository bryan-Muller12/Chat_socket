// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Servir a página HTML estática
app.use(express.static('client'));

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Solicita o nome do jogador ao conectar
    socket.emit('request name');

    socket.on('name', (name) => {
        socket.broadcast.emit('message', { type: 'join', text: `${name} entrou no chat`, sender: name });
    });

    socket.on('disconnect', (name) => {
        console.log('Cliente desconectado:', socket.id);
        socket.broadcast.emit('message', { type: 'leave', text: `${name} desconectou`, sender: name });
    });

    socket.on('send message', ({ text, sender }) => {
        io.emit('message', { type: 'text', text, sender });
    });
});

server.listen(PORT, () => {
    console.log(`Servidor está ouvindo na porta ${PORT}`);
});
