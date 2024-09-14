const IO = app => {
    const io = require("socket.io")(app);
    const clients = {};
    // Set up Socket.IO
    io.on("connection", socket => {
        console.log("a user connected");
        console.log(socket.id);
        const clientId = socket.id;
        clients[clientId] = socket;
        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("a user disconnected");
        });
        // Handle messages from clients
        socket.on("message", (message, recipientId) => {
            console.log(
                `received message: ${message} And User Id : ${recipientId}`
            );
            // Broadcast the message to all connected clients
            // clients[recipientId].emit("message", message);
             io.emit("message", message);
        });
        // Exaqmple Of Connecting Two Users
    });
};

module.exports = IO;
