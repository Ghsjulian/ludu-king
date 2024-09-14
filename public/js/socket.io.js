"use strict";

const socket = io();
socket.emit("message", "Hello This Is Message!", "12345");
socket.on("message", (message) => {
    alert(message);
});
