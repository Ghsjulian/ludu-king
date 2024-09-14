const express = require("express");
const ejs = require("ejs");
const app = express();
const server = require("http").createServer(app);
const IO = require("./src/socket/socket.io");
const PORT = 5000;
const HOST = "127.0.0.1";

// SETUP SOCKET CONNECTION
// Set up Express to serve static files from the public folder
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index');
});


server.listen(PORT, () => {
    console.clear();
    IO(server);
    console.log(`\n _______________________________________________________`);
    console.log(`\n [+]  SOCKET CONNECTION ESTABLISHED SUCCESSFULLY !`);
    console.log(`\n [+]  SERVER IS RUNNING ON PORT - ${HOST}:${PORT}`);
    console.log(`\n [+]  GITHUB PROFILE URL : https://github.com/Ghsjulian`);
    console.log(
        `\n [+]  PERSONAL PORTFOLIO URL : https://ghsresume.netlify.app`
    );
    console.log(`\n [+]  WEB DEVELOPER NAME : GHS JULIAN`);
    console.log(` _______________________________________________________\n\n`);
});
