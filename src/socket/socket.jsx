import { io } from "socket.io-client";

let socket = null;
// let isConnected = false;

export const connectSocket = (token) => {

    socket = io("/", {
        auth: {
            token,
        },
        transports: ["websocket"],
        autoConnect: true
    });

    socket.on("connect", (err) => {
        // isConnected = true;
    })

    socket.on("disconnect", () => {
        // isConnected = false;
    })
    return socket;
}

export const disconnectSocket = () => {
  if(socket){
    socket.disconnect();
    socket = null;
    // isConnected = false;
  }
}

export const getSocket = () => {
    // if(!isConnected){
    //     console.warn("Socket is not connected. Please connect the socket first.");
    // }
    return socket;
}