const express = require("express");
const bcrypt = require('bcrypt');
const Router = express.Router;
const {adminModel, userModel, courseModel} = require("../db");
const adminRouter = Router();
const z = require('zod');
const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require('../config');
const { adminMiddleware } = require("../Middleware/admin");

adminRouter.post("/signup" , async function(req,res){
    const body = z.object({
        email : z.string().min(3).max(100).email(),
        password : z.string().min(3).max(30),
        firstName : z.string(),
        lastName : z.string(),
    });
    const parsedDataWithSuccess = body.safeParse(req.body);

    if(!parsedDataWithSuccess.success)
    {
        res.json({
            message : "Incorrect format",
            error : parsedDataWithSuccess.error,
        })
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let errorThrown = false;
    try{
        const HashedPassword = await bcrypt.hash(password,5);
        console.log(HashedPassword);

        await adminModel.create({
            email : email,
            password : HashedPassword,
            firstName : firstName,
            lastName : lastName,
        });

    }catch(e)
    {
        res.json({
            msg : "duplicate email error!!"
        });
        errorThrown = true;
    }

    if(!errorThrown)
    {
        res.json({
            message : "you are logged in"
        });
    }

});

adminRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const user = await adminModel.findOne({ email });

    if (!user) {
        res.status(401).json({
            msg: "User does not exist in DB",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);  // ✅ Await here

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_SECRET);
        res.json({ token });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

adminRouter.post("/course" ,adminMiddleware,async function(req,res){
    const creatorId = req.userId;

    const {title, description, price, imageUrl} = req.body;

    const course = await courseModel.create({
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
        creatorId : creatorId,
    });

    res.json({
        msg : "course created",
        courseId : course._id,
    });
});

adminRouter.put("/course" , function(req,res){

});

adminRouter.get("/course/bulk" , function(req,res){

});

module.exports = {
    adminRouter : adminRouter,
}