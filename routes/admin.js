const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");

const { JWT_ADMIN_PASSWORD } = require("../config");

adminRouter.post("/signup", async function(req, res) {
    const { email, password, firstName, lastName } = req.body;

    try {
        await adminModel.create({
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
adminRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({
            email: email,
            password: password
        });

        if (!admin) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
        res.json({ token });

    } catch (err) {
        console.error("❌ Signin Error:", err);
        res.status(500).json({
            message: "Signin failed",
            error: err.message
        });
    }
});

adminRouter.post("/course", async function(req, res) {
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        mesaage: "Course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res) {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.UpdateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    }, { new: true });

    res.json({
        mesaage: "Course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res) {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        mesaage: "Course updated",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}