const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");
const { JWT_ADMIN_PASSWORD } = require("../config");

adminRouter.post("/signup", async(req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        await adminModel.create({ email, password, firstName, lastName });
        res.json({ message: "Signup succeeded" });
    } catch (err) {
        res.status(500).json({
            message: "Error creating admin",
            error: err.message
        });
    }
});

adminRouter.post("/signin", async(req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email, password });

        if (!admin) {
            return res.status(403).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);
        res.json({ token });
    } catch (err) {
        res.status(500).json({
            message: "Signin failed",
            error: err.message
        });
    }
});

adminRouter.post("/course", adminMiddleware, async(req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = req.body;

    const course = await courseModel.create({
        title,
        description,
        imageUrl,
        price,
        creatorId: adminId
    });

    res.json({
        message: "Course created",
        courseId: course._id
    });
});

adminRouter.put("/course", adminMiddleware, async(req, res) => {
    const adminId = req.userId;
    const { title, description, imageUrl, price, courseId } = req.body;

    await courseModel.updateOne({ _id: courseId, creatorId: adminId }, { title, description, imageUrl, price });

    res.json({ message: "Course updated" });
});

adminRouter.get("/course/bulk", adminMiddleware, async(req, res) => {
    const adminId = req.userId;

    const courses = await courseModel.find({ creatorId: adminId });

    res.json({ courses });
});

module.exports = { adminRouter };