const express = require("express");
require('dotenv').config();
const app = express();

const dbConfig = require("./config/dbConfig");

const port = process.env.PORT || 5000;

const usersRoute = require("./routes/usersRoute")
const chatsRoute = require("./routes/chatsRoute");
const messagesRoute = require("./routes/messagesRoute")

app.use(express.json());


const server = require("http").createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// check the connection of socket from client
io.on("connection", (socket) => {
    // socket events will be here
    socket.on("join-room", (userId) => {
        // console.log("user joined", userId);
        socket.join(userId);
    });

    // send message to clients (who are in the same room)

    socket.on("send-message", (message) => {
        io.to(message.members[0]).to(message.members[1]).emit("receive-message", message);
    });

    // // send message to receipent
    // socket.on("send-message", ({text, sender, receipent}) => {
    //     // send message to receipent (Diana)
    //     io.to(receipent).emit("receive-message", {
    //         text,
    //         sender,
    //     });
    // });

    // console.log("connected with socketid", socket.id);

    // socket.on("send-new-message-to-all", (data) => {
    //     // console.log(data);

    //     // send to all the clients
    //     socket.emit("new-message-from-server", data);
    // });
});

app.use("/api/users", usersRoute);
app.use("/api/chats", chatsRoute);
app.use("/api/messages", messagesRoute);

server.listen(port, () => console.log(`Server running on port ${port}`));