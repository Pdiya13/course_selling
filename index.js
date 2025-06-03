const express = require('express');
const mongoose = require("mongoose");
const {userRouter } = require('./routes/user');
const {courseRouter} = require('./routes/course');
const {adminRouter} = require('./routes/admin');
const app = express();

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

async function main(){
    await mongoose.connect("mongodb+srv://admin:admin%401234@cluster0.umssmfx.mongodb.net/Course_selling");
    app.listen(3000);
    console.log("listening on port 3000");
}

main();
