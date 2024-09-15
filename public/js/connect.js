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

socket.on("connection", () => {
    console.log("Connected to server");
});

socket.emit("user", JSON.stringify({ u_id, u_name }));

socket.on("newUser", user => {
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

    userDiv.appendChild(flexUserDiv);
    userDiv.appendChild(connectBtn);

    if(user.u_id !== u_id){
    playground.appendChild(userDiv);
    }
});

socket.on("userLeft", user => {
    const userLeft = document.getElementById(user.u_id);
    userLeft.remove();
    return;
    /*
    const userElement = document.querySelector(
        `.user span:contains(${user.u_name})`
    ).parentNode.parentNode;
    if (userElement) {
        userElement.remove();
    }
    */
});

socket.on("disconnect", () => {
    console.log("User Disconnected");
});

// Sending Request To AN User
connectBtn.onclick = () => {
    const targetUserId = ""; /* get the target user ID from the UI */
    socket.emit("connectToUser", targetUserId);
};

/*
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

socket.on("connection", () => {
    console.log("Connected to server");
});

socket.emit("user", JSON.stringify({ u_id, u_name }));

socket.on("newUser", user => {
    console.log(user);
    playground.innerHTML += `
        <div class="user">
            <div class="flex-user">
                <img src="/icons/user.png" />
                <span>${user.u_name}</span>
            </div>
            <button class="connect">Request</button>
        </div>
    `;
});

socket.on("userLeft", user => {
    console.log(`User ${user.u_name} left`);
    const userElement = document.querySelector(
        `.user span:contains(${user.u_name})`
    ).parentNode.parentNode;
    if (userElement) {
        userElement.remove();
    }
});

socket.on("disconnect", () => {
    console.log("User Disconnected");
});

// Sending Request To AN User
connectBtn.onclick = () => {
    const targetUserId = ""; 
    socket.emit("connectToUser", targetUserId);
};
*/
