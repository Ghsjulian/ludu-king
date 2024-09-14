const IO = app => {
    const io = require("socket.io")(app);
    // Set up Socket.IO
    io.on("connection", socket => {
        console.log("a user connected");
        // Handle disconnections
        socket.on("disconnect", () => {
            console.log("a user disconnected");
        });
        // Handle messages from clients
        socket.on("message", message => {
            console.log(`received message: ${message}`);
            // Broadcast the message to all connected clients
            io.emit("message", message);
        });
    });
};

module.exports = IO;
