const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);
app.use((err, req, res, next) => {
    console.error("🔥 Unhandled Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

async function main() {
    await mongoose.connect("mongodb+srv://juttumanikanta52_db_user:v40DOLfx3RZlmz78@cluster0.yqehxnx.mongodb.net/Coursera-app")
    app.listen(3000);
    console.log("connected to MongoDB");
}
main();