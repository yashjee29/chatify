const fs = require('fs');
const path = require('path');
const { decryptMessage } = require('../../utils/encryption');
const messagesFilePath = path.join(__dirname, '../../data/chats.json');

const getMessages = (req, res) => {
    try{
        const { chatId } = req.params;
        const userId = req.user.id;
        if(!chatId || !userId){
            return res.status(400).json({error: "chatId and userId are required."});
        }
        const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
        const chat = messages.find(c => c.id == chatId);
        if(!chat){
            return res.status(404).json({error: "Chat not found."});
        }
        const chatMessages = chat.messages.map(msg => ({
            ...msg,
            text: decryptMessage(msg.text),
            status: msg.senderId === userId 
                ? (msg.status || 'sent') 
                : (msg.status || 'delivered')
        }));
        res.status(200).json(chatMessages || []);
    }catch(err){
        console.error("Error getting messages:", err);
        res.status(500).json({error: "Internal server error."});
    }
}

module.exports = getMessages;