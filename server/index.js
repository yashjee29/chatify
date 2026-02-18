const express = require("express");
const cors = require("cors")
const http = require("http");
require("dotenv").config();

const { initSocket, getSocketIo } = require("./socket");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/messages");

const app = express();

//middlewares
app.use(cors({origin: "*"}));
app.use(express.json());

//server+socket
const server = http.createServer(app);
initSocket(server);

app.use((req, res, next) => {
    req.io = getSocketIo();
    next();
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

//health
app.get("/api/health", (req, res) => {
    res.status(200).send("Server is healthy");
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});