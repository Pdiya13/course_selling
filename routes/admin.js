const express = require("express");
const Router = express.Router;
const {adminModel} = require("../db");
const adminRouter = Router();

adminRouter.post("/signup" , function(req,res){

});

adminRouter.post("/signin" , function(req,res){

});

adminRouter.post("/course" , function(req,res){

});

adminRouter.put("/course" , function(req,res){

});

adminRouter.get("/course/bulk" , function(req,res){

});

module.exports = {
    adminRouter : adminRouter,
}