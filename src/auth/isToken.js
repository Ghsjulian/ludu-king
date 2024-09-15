const myFunction = require("./functions");
const isToken = async (req, res, next) => {
    if (req.cookies["token"]) {
        res.redirect("/")
    }
    next()
};

module.exports = isToken;
