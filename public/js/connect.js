"use strict";

const getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

const connectBtn = document.querySelector(".connect");
const playground = document.querySelector(".playground");
const socket = io();
const u_name = getCookie("u_name");
const u_id = getCookie("u_id");

const updateUser = user => {
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.id = user.u_id;
    const flexUserDiv = document.createElement("div");
    flexUserDiv.className = "flex-user";
    const userImg = document.createElement("img");
    userImg.src = "/icons/user.png";
    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = user.u_name;
    flexUserDiv.appendChild(userImg);
    flexUserDiv.appendChild(userNameSpan);
    const connectBtn = document.createElement("button");
    connectBtn.className = "connect";
    connectBtn.id = user.u_id;
    connectBtn.textContent = "Request";
    connectBtn.onclick = () => {
        Connect(user.u_id);
    };
    userDiv.appendChild(flexUserDiv);
    userDiv.appendChild(connectBtn);
    if (user.u_id !== u_id) {
        playground.appendChild(userDiv);
    }
};

socket.on("connection", () => {
    console.log("Connected to server");
});

socket.emit("user", JSON.stringify({ u_id, u_name }));

socket.on("activeUsers", users => {
    console.log(users);
    Object.values(users).forEach(user => {
        updateUser(user);
    });
});

socket.on("newUser", user => {
    updateUser(user);
});

socket.on("userLeft", user => {
    const userLeft = document.getElementById(user.u_id);
    userLeft.remove();
});

socket.on("disconnect", () => {
    console.log("User Disconnected");
});

// SEND MESSAGES
const sendMessage = message => {
    socket.emit("sendMessage", message);
};

// UIPDATE BUTTON
const updateButton = (type, id) => {
    if (type === "REQUEST") {
        const thisBtn = document.getElementById(id);
        const conn = thisBtn.querySelector(".connect");
        conn.onclick = () => {
            sendMessage("ACCEPTED");
        };
        conn.style.backgroundColor = "#ff2f05";
        conn.style.color = "#ffffff";
        conn.style.border = "1px solid #ff2f05";
        conn.textContent = "Accept Request";
    } else if (type === "ACCEPTED") {
        const thisBtn = document.getElementById(id);
        const conn = thisBtn.querySelector(".connect");

        // Add play Function here
        conn.onclick = () => {
            sendMessage("ACCEPTED");
        };
        conn.style.backgroundColor = "#07b929";
        conn.style.color = "#ffffff";
        conn.style.border = "1px solid #05af1a";
        conn.textContent = "Play Now";
    }
};
// CONNECTING WITH A USER
const Connect = id => {
    const thisBtn = document.getElementById(id);
    const conn = thisBtn.querySelector(".connect");
    // conn.disabled = true;
    conn.style.backgroundColor = "#00700b";
    conn.textContent = "Request Sent";
    socket.emit("connectToUser", id);
    sendMessage("REQUEST");
};

// Handle new connection event

socket.on("newConnection", userId => {
    console.log(`Connected to user ${userId}`);
});

// Handle receive message event
socket.on("receiveMessage", (message, u_id) => {
    updateButton(message, u_id);
    console.log(message);
    console.log(u_id);
    // alert(message.user.u_id);
    // console.log(`Received message from ${userId}: ${message}`);
});
