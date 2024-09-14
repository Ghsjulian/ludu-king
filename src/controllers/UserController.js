class UserController {
    async UserLogin(req, res) {
        res.json({
            message: "this is message from login controllers"
        });
    }
}



module.exports = new UserController()