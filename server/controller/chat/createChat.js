const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { onlineUsers } = require('../../socket/presence');

const chatsPath = path.join(__dirname, "..", "..", "data", "chats.json");
const userPath = path.join(__dirname, "..", "..", "data", "users.json");

const getChats = () => {
    if(!fs.existsSync(chatsPath)) {
        fs.writeFileSync(chatsPath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(chatsPath, "utf-8"));
}

const saveChats = (chats) => {
    fs.writeFileSync(chatsPath, JSON.stringify(chats, null, 2));
}

const createChat = (req, res) => {
    try{
        const userId = req.user.id;
        const { targetUserId } = req.body;

        if(!targetUserId) {
            return res.status(400).json({ message: "Target user ID is required" });
        }

        const chats = getChats();

        const existingChat = chats.find(chat =>
            chat.participants.includes(userId) &&
            chat.participants.includes(targetUserId)
        );

        const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));

        if(existingChat) {
            const otherUser = users.find(u => u.id === targetUserId);
            if (!otherUser) {
               return res.status(404).json({ message: "User not found" });
            }
            const formattedChat = {
                id: existingChat.id,
                createdAt: existingChat.createdAt,
                user: {
                    id: otherUser.id,
                    name: otherUser.name,
                    email: otherUser.email,
                    online: onlineUsers.has(otherUser.id)
                }
            };
            return res.status(200).json(formattedChat);
        }

        const newChat = {
            id: uuidv4(),
            participants: [userId, targetUserId],
            messages: [],
            createdAt: new Date().toISOString()
        };

        chats.push(newChat);
        saveChats(chats);
        
        const otherUser = users.find(u => u.id === targetUserId);
        const formattedNewChat = {
            id: newChat.id,
            createdAt: newChat.createdAt,
            user: {
                id: otherUser.id,
                name: otherUser.name,
                email: otherUser.email,
                online: onlineUsers.has(otherUser.id)
            }
        };
        
        // const creatorSocketId = onlineUsers.get(targetUserId);
        // if(creatorSocketId && req.io){
        //     console.log("Emitting new chat to user:", targetUserId);
        //     req.io.to(creatorSocketId).emit("chat:new", formattedNewChat);
        // }

        res.status(201).json(formattedNewChat);
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create chat" });
    }
}

module.exports = createChat;