const express = require("express");
const { purchaseModel, courseModel } = require("../db");
const { userMiddleware } = require("../Middleware/user");
const Router = express.Router;

const courseRouter = Router();

courseRouter.post("/purchase",userMiddleware ,async function(req,res){    // { "courseId" : "68418a968ef4cf1cbdf6b10d" } 
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId : userId,
        courseId : courseId, 
    });

    res.json({
        msg : "you have successfully purchased a course",
    })
}); 

courseRouter.get("/preview" ,async function(req,res){

    const courses = await courseModel.find({});

    res.json({
        msg : "Available Courses",
        courses,
    }); 
});

module.exports = {
    courseRouter : courseRouter
}