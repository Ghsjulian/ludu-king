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
                var u_data = JSON.parse(user);
                u_data.sock_id = socket.id;
                const id = u_data.u_id;
                if (!this.users[id]) {
                    this.users[id] = u_data;
                    // console.log(this.users);
                    this.io.emit("newUser", u_data);
                    const active_users = Object.values(this.users);
                    this.io.emit("activeUsers", active_users);
                    // Send new user to all clients
                }
                console.log(`${u_data.u_name} Connected`);
                // ALL ACTIVE USERS
                socket.on("activeUsers", () => {
                    const active_users = Object.values(this.users);
                    this.io.emit("activeUsers", active_users);
                });
                // IF DISCONNECT
                socket.on("disconnect", () => {
                    console.log(`${u_data.u_name} Disconnected`);
                    delete this.users[id];
                    this.io.emit("userLeft", u_data); // Send user left event to all clients
                });
                // CONNECT WITH A USER
                socket.on("connectToUser", targetUserId => {
                    if (this.users[targetUserId]) {
                        // console.log(`Connecting ${id} to ${targetUserId}`);
                        this.io
                            .to(this.users[targetUserId].sock_id)
                            .emit("newConnection", id);
                        socket.emit("newConnection", targetUserId);
                        console.log("Connected New User....");
                    } else {
                        console.log(`User ${targetUserId} not found`);
                    }
                });
            });
        });
    }
}
module.exports = new SocketManager();
