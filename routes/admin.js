const express = require("express");
const bcrypt = require('bcrypt');
const Router = express.Router;
const {adminModel, userModel, courseModel} = require("../db");
const adminRouter = Router();
const z = require('zod');
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_SECRET} = require('../config');
const { adminMiddleware } = require("../Middleware/admin");

adminRouter.post("/signup" , async function(req,res){    // { "email" : "lata@gmail.com", "password" : "lata123", "firstName" : "lata",  "lastName" : "patel" } 

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

adminRouter.post("/signin", async function (req, res) {    // { "email" : "lata@gmail.com", "password" : "lata123" }
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
        }, JWT_ADMIN_SECRET);
        res.json({ token });
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

adminRouter.post("/course" ,adminMiddleware,async function(req,res){  // {  "title" : "python",    "description" : "description",   "price" : 4999, "imageUrl" : "https://en.m.wikipedia.org/wiki/File:Python-logo-notext.svg", "creatorId" : "6842c9f4c36e915cd420c66c" }

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

adminRouter.put("/course", adminMiddleware,async function(req,res){   // {  "title" : "python",    "description" : "description",   "price" : 4999, "imageUrl" : "https://en.m.wikipedia.org/wiki/File:Python-logo-notext.svg",  "courseId": "6842caf1c36e915cd420c66f" }
    const adminId = req.userId;
    const {title ,description,price,imageUrl,courseId} = req.body;

    const findCourse = await courseModel.findOne({
        _id : courseId,
        creatorId : adminId,
    });

    if(!findCourse)
    {
        res.json({
            msg : "course not found with specific courseId and CreatorId",
        });
        return;
    }

    const course = await courseModel.updateOne({
        _id : courseId,
        creatorId : adminId,
    },{
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
    });

    res.json({
        msg : "Course Updated",
        courseId : course._id,
    });

});

adminRouter.get("/course/bulk" ,adminMiddleware, async function(req,res){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId : adminId,
    });

    res.json({
        msg : "available courses",
        courses,
    })
});

module.exports = {
    adminRouter : adminRouter,
}