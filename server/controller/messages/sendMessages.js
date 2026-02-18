const fs = require('fs');
const path = require('path');
const { encryptMessage, decryptMessage } = require('../../utils/encryption');
const messagesFilePath = path.join(__dirname, '../../data/chats.json');

const getChats = () => {
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
    return messages;
}

const saveChats = (messages) => {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
}

const sendMessages = async (req, res) => {
    try{
        const { chatId, message, tempId } = req.body;
        const senderId = req.user.id;

        if(!chatId || !message || !senderId){
            return res.status(400).json({error: "chatId, message and senderId are required."});
        }

        const messages = getChats();
        const chat = messages.find(c => c.id == chatId);
        
        if(!chat){
            return res.status(404).json({error: "Chat not found."});
        }

        const isFirstMessage = chat.messages.length === 0;
        
        const newMessage = {
            id: Date.now(),
            chatId,
            senderId,
            text: encryptMessage(message),
            time: new Date().toISOString(),
            status: 'sent'
        };
        chat.messages.push(newMessage);
        saveChats(messages);

        await req.io.to(chatId).emit("message:receive", {
            chatId,
            message: {
                ...newMessage,
                text: decryptMessage(newMessage.text),
                status: 'sent',
                tempId
            }
        });

        if(isFirstMessage && !chat.isGroup){
            const users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "data", "users.json"), "utf-8"));
            const receiverId = chat.participants.find(p => p !== senderId);
            const receiver = users.find(u => u.id === receiverId);
            const receiverSocketId = require('../../socket/presence').onlineUsers.get(receiverId);
            if(receiverSocketId && req.io && receiver){
                req.io.to(receiverSocketId).emit("chat:new", {
                    id: chat.id,
                    createdAt: chat.createdAt,
                    user: {
                        id: senderId,
                        name: req.user.name,
                        email: req.user.email,
                        online: true
                    }
                });
            }
        }

        res.status(201).json({message: "Message sent successfully.", data: newMessage});
    }catch(err){
        console.error("Error sending message:", err);
        res.status(500).json({error: "Internal server error."});
    }
}

module.exports = sendMessages;