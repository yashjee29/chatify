const fs = require('fs');
const path = require('path');
const { onlineUsers } = require('../../socket/presence');

const chatPath = path.join(__dirname, "..", "..", "data", "chats.json");
const userPath = path.join(__dirname, "..", "..", "data", "users.json");

const getMyChats = (req, res) => {
    try{
        const userId = req.user.id;
        const chats = JSON.parse(fs.readFileSync(chatPath, "utf-8"));
        const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
        const myChats = chats
            .filter(chat => chat.participants.includes(userId) && chat.messages && chat.messages.length > 0)
            .map(chat =>{

                if(chat.isGroup){
                    const participants = chat.participants.map(participantId => {
                        const user = users.find(u => u.id === participantId);
                        if(!user) return null;
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            isOnline: onlineUsers.has(user.id),
                        }
                    }).filter(Boolean);

                    return {
                        id: chat.id,
                        createdAt: chat.createdAt,
                        isGroup: true,
                        groupName: chat.groupName,
                        participants
                    }
                }
                const otherUserId = chat.participants.find(p => p !== userId);
                const otherUser = users.find(u => u.id === otherUserId);
                
                if(!otherUser){
                    return null;
                }
                
                return {
                    id: chat.id,
                    createdAt: chat.createdAt,
                    user: {
                        id: otherUser.id,
                        name: otherUser.name,
                        email: otherUser.email,
                        online: onlineUsers.has(otherUser.id)
                    }
                };
            })
            .filter(chat => chat !== null);
        res.json(myChats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get chats" });
    }
}

module.exports = getMyChats;