"use strict";

const menu = document.querySelector(".links");
const btn = document.querySelector(".m-btn");
btn.onclick = () => {
    menu.classList.toggle("mobile-menu");
    if (menu.classList.contains("mobile-menu")) {
        btn.querySelector("img").src = "/icons/cross-svgrepo-com.svg";
    } else {
        btn.querySelector("img").src = "/icons/burger-menu-svgrepo-com.svg";
    }
};
