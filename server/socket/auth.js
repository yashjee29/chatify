const {verifyToken} = require("../utils/jwt");

module.exports = (socket, next) => {
    try{
        const token = socket.handshake.auth?.token;
        if(!token){
            console.log("No token provided");
            return next(new Error("Authentication error"));
        }
        const decoded = verifyToken(token);
        socket.user = decoded;
        if(!decoded){
            return next(new Error("Authentication error"));
        }
        next();
    }catch(err){
        console.log("Error in socket auth:", err);
        next(new Error("Authentication error"));
    }
};