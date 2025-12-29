const { Router } = require("express");
const courseRouter = Router();

courseRouter.post("/purchase", function(req, res) {
    res.json({
        mesaage: "signup endpoint"
    })
})

courseRouter.get("/preview", function(req, res) {
    res.json({
        mesaage: "signup endpoint"
    })
})
module.exports = {
    courseRouter: courseRouter
}