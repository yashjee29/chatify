const { Server } = require("socket.io")
const socketAuth = require("./auth")
const {setupPresence} = require("./presence")
const { decryptMessage } = require("../utils/encryption");
const fs = require('fs');
const path = require('path');
let socketIo = null;

const messagesFilePath = path.join(__dirname, '../data/chats.json');

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    socketIo = io;

    io.use(socketAuth);
    
    io.on("connection", (socket) => {
        setupPresence(io, socket);

        socket.on("chat:join", (chatId) => {
            socket.join(chatId);
        })
        
        socket.on("message:delivered", ({ chatId, messageId }) => {
            try {
                const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
                const chat = messages.find(c => c.id == chatId);
                if (chat) {
                    const message = chat.messages.find(m => m.id == messageId);
                    if (message && message.status === 'sent') {
                        message.status = 'delivered';
                        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
                        socket.to(chatId).emit("message:delivered", { messageId, chatId });
                    }
                }
            } catch (err) {
                console.error('Error updating message delivered status:', err);
            }
        });
        
        socket.on("message:read", ({ chatId, messageId }) => {
            try {
                const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
                const chat = messages.find(c => c.id == chatId);
                if (chat) {
                    const message = chat.messages.find(m => m.id == messageId);
                    if (message && (message.status === 'delivered' || message.status === 'sent')) {
                        message.status = 'read';
                        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
                        socket.to(chatId).emit("message:read", { messageId });
                    }
                }
            } catch (err) {
                console.error('Error updating message read status:', err);
            }
        });
    });

    return io;
}

const getSocketIo = () => {
    return socketIo;
}

module.exports = {
    initSocket,
    getSocketIo
};
