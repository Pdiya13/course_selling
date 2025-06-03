const express = require("express");
const Router = express.Router;

const CourseRouter = Router();

CourseRouter.post("/purchase" , function(req,res){

}); 

CourseRouter.get("/preview" , function(req,res){
    res.json({
        msg : "your purchased courses",
    })
});

module.exports = {
    CourseRouter : CourseRouter
}