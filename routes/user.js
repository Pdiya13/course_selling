const express = require("express");
const { userModel, courseModel, purchaseModel } = require("../db");
const { email } = require("zod/v4");
const Router = express.Router;
const z = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_ADMIN_SECRET } = require("../config");
const { userMiddleware } = require("../Middleware/user");

const userRouter = Router();

userRouter.post("/signup" ,async function(req,res){
    const body = z.object({
        email : z.string().min(4).max(20).email(),
        password : z.string().min(4).max(30),
        firstName : z.string().min(4).max(30),
        lastName : z.string(),
    });

    const parsedBody = body.safeParse(req.body);

    if(!parsedBody.success)
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

        await userModel.create({
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

userRouter.post("/signin" ,async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email : email,
    });

    if(!user)
    {
        res.status(401).json({
            msg : "Unauthorized!! no user found of this email",
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password,user.password);

    if(passwordMatch)
    {
        const token = jwt.sign({
            id : user._id.toString(),
        },JWT_USER_SECRET);
        res.json(token);
    }
    else {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
});

userRouter.get("/purchases" ,userMiddleware, function(req,res){
    const userId = req.userId;

    const purchases = purchaseModel.find({
        userId,
    });

    res.json({
        purchases,
    })
});

module.exports = {
    userRouter : userRouter,
}
