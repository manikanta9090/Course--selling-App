const { Router } = require("express");
const { userModel } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

const userRouter = Router();

userRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    try {
        await userModel.create({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    } catch (err) {
        return res.status(500).json({
            message: "Error creating user",
            error: err.message
        })
    }
    res.json({
        mesaage: "signup succeeded"
    })
})

userRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email, password });

        if (!user) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);
        res.json({ token });

    } catch (err) {
        console.error("❌ Signin Error:", err);
        res.status(500).json({
            message: "Signin failed",
            error: err.message
        });
    }
});

userRouter.get("/purchases", function(req, res) {
    res.json({
        mesaage: "signup endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}