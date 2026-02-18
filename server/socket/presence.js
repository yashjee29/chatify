const onlineUsers = new Map();

const setupPresence = (io, socket) => {
    const userId = socket.user.id;

    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("user:online", userId);

    socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user:offline", userId);
    });
};

module.exports = {onlineUsers, setupPresence};