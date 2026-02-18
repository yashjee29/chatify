const fs = require('fs');
const path = require('path');
const { onlineUsers } = require('../../socket/presence');
const userPath = path.join(__dirname, "..", "..", "data", "users.json");

const getUsers = (req, res) => {
    try{
        const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
        const filteredUsers = users.filter(user => user.id !== req.user.id).map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            online: onlineUsers.has(user.id)
        }));
        res.json(filteredUsers);
    } catch (error) {
        res.status(500).json({ message: "Failed to get users" });
    }
}

module.exports = getUsers;