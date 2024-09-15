const myFunction = require("./functions");
const isLogin = async (req, res, next) => {
    try {
        if (req.cookies["token"]) {
            const user = await myFunction.decodeJWT(req.cookies["token"]);
            if (user) {
                next();
            } else {
                throw new Error("Invalid User Access Token !");
            }
        } else {
            throw new Error("Unauthorized User !");
        }
    } catch (error) {
        res.redirect("/login");
        // return res.send(error.message);
    }
};

module.exports = isLogin;
