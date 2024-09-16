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
                if (this.users[id]) {
                    return;
                } else {
                    this.users[id] = u_data;
                    const active_users = Object.values(this.users);
                    this.activeUsers.push(active_users);
                    this.io.emit("newUser", u_data);
                    socket.on("activeUsers", () => {
                    this.io.emit("activeUsers", this.activeUsers);
                });
                }
                console.log(`${u_data.u_name} Connected`);
                // ALL ACTIVE USERS
                /**/
                
                // IF DISCONNECT
                socket.on("disconnect", () => {
                    console.log(`${u_data.u_name} Disconnected`);
                    delete this.users[id];
                    this.io.emit("userLeft", u_data); // Send user left event to all clients
                });
                // CONNECT WITH A USER
                socket.on("connectToUser", targetUserId => {
                    if (this.users[targetUserId]) {
                        console.log(
                            `Connecting ${u_data.u_id} to ${targetUserId}`
                        );
                        // Establish a connection between the two users
                        this.io
                            .to(this.users[targetUserId].sock_id)
                            .emit("newConnection", u_data.u_id);
                        socket.emit("newConnection", targetUserId);
                        console.log("Connected New User....");

                        // Set up event handler for sending messages
                        socket.on("sendMessage", message => {
                            this.io
                                .to(this.users[targetUserId].sock_id)
                                .emit("receiveMessage", message, u_data.u_id);
                            console.log(
                                `Sent message from ${u_data.u_id} to ${targetUserId}: ${message}`
                            );
                        });
                    } else {
                        console.log(`User ${targetUserId} not found`);
                    }
                });
            });
        });
    }
}
module.exports = new SocketManager();
