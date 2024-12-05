import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import cors from "cors";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust to your frontend URL
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    let username = "Anonymous"; // Default username

    console.log("A user connected");

    socket.on("set_username", (user) => {
        username = user;
        console.log(`${username} has joined the chat`);
    });

    socket.on("chat_message", (data) => {
        const message = { username: data.username || username, message: data.message };
        io.emit("message", message);
        console.log(`${message.username}: ${message.message}`);
    });

    socket.on("disconnect", () => {
        console.log(`${username} disconnected`);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
