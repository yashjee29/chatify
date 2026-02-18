const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
const { onlineUsers } = require("../../socket/presence");

const chatPath = path.join(__dirname, '..', '..', 'data', 'chats.json');
const userPath = path.join(__dirname, '..', '..', 'data', 'users.json');

const getChats = () => {
    if(!fs.existsSync(chatPath)) {
        fs.writeFileSync(chatPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(chatPath));
}

const saveChats = (chats) => {
    fs.writeFileSync(chatPath, JSON.stringify(chats, null, 2));
}

const createGroupChat = (req, res) => {
    try{
        const createrId = req.user.id;
        const { groupName, members } = req.body;

        if(!groupName || !members || members.length < 2) {
            return res.status(400).json({ message: 'Group name and at least 2 members are required' });
        }

        const chats = getChats();
        const users = JSON.parse(fs.readFileSync(userPath, 'utf-8'));
        const newGroupChat = {
            id: uuidv4(),
            isGroup: true,
            groupName,
            admin: createrId,
            participants: [createrId, ...members],
            messages: [],
            createdAt: new Date().toISOString(),
        }

        chats.push(newGroupChat);
        saveChats(chats);
        
        const formattedChat = {
            id: newGroupChat.id,
            createdAt: newGroupChat.createdAt,
            isGroup: newGroupChat.isGroup,
            groupName: newGroupChat.groupName,
            participants: newGroupChat.participants.map(participantId => {
                const user = users.find(u => u.id === participantId);
                return {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    isOnline: onlineUsers.has(user.id),
                }
            })
        }

        newGroupChat.participants.forEach(participantId => {
            if(onlineUsers.has(participantId)) {
                const socketId = onlineUsers.get(participantId);
                req.io.to(socketId).emit('chat:new', formattedChat);
            }
        });
        res.status(201).json(formattedChat);
    }catch(error) {
        console.error('Error creating group chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = createGroupChat;