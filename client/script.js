// client/script.js
const socket = io();

const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

let playerName = '';

socket.on('connect', () => {
    console.log('Conectado ao servidor');
    playerName = prompt('Digite seu nome:');
    if (playerName.trim().length > 0) {
        socket.emit('name', playerName.trim());
    } else {
        playerName = `Cliente-${Math.floor(Math.random() * 1000)}`;
        socket.emit('name', playerName);
    }
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
});

socket.on('message', ({ type, text, sender }) => {
    if (type === 'join' || type === 'leave') {
        // Mensagem de evento (entrada ou saída de jogador)
        const eventMessage = document.createElement('li');
        eventMessage.classList.add('event-message');
        eventMessage.textContent = text;
        chatMessages.appendChild(eventMessage);
    } else {
        // Mensagem de chat
        const messageElement = document.createElement('li');
        messageElement.classList.add('chat-message');
        const messageSender = (sender === socket.id) ? 'Você' : sender;
        messageElement.textContent = `${messageSender}: ${text}`;
        chatMessages.appendChild(messageElement);
    }
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message.length > 0) {
        // Exibir a própria mensagem no chat


        // Enviar a mensagem para o servidor
        socket.emit('send message', { text: message, sender: playerName });
        
        messageInput.value = '';
    }
});
