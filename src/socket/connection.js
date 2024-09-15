const socketIO = require("socket.io");
const User = require("../models/Users");

class SocketManager {
    constructor() {
        this.io = socketIO();
        this.activeUsers = [];
        this.users = {}; // store connected users with their socket IDs
        this.UserModel = User; // Mongoose user model
    }

    static async getUser(id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                console.log(`User not found: ${id}`);
                return;
            }
            this.activeUsers.push(user);
        } catch (error) {
            console.log(error);
        }
    }

    init(server) {
        this.io.attach(server);
        this.io.on("connection", socket => {
            socket.on("user", user => {
                const u_data = JSON.parse(user);
                const id = u_data.u_id;
                if (!this.users[id]) {
                    this.users[id] = u_data;
                    this.io.emit("newUser", u_data); // Send new user to all clients
                }
                console.log(`${u_data.u_name} Connected`);

                // IF DISCONNECT
                socket.on("disconnect", () => {
                    console.log(`${u_data.u_name} Disconnected`);
                    delete this.users[id];
                    this.io.emit("userLeft", u_data); // Send user left event to all clients
                });
                // CONNECT WITH A USER
                socket.on("connectToUser", targetUserId => {
                    if (this.users[targetUserId]) {
                        console.log(`Connecting ${id} to ${targetUserId}`);
                        this.users[targetUserId].emit("newConnection", id);
                        socket.emit("newConnection", targetUserId);
                    } else {
                        console.log(`User ${targetUserId} not found`);
                    }
                });
            });
        });
    }
}
module.exports = new SocketManager();
