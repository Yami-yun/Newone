const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
// const async = require('async');

router.post("/register", (req, res) => {
    const user = new User(req.body);
    

    user.save((err, doc)=>{
        if(err) return res.json({ success: false, err });
        console.log(`[SERVER] [USER ROUTER] [REGISTER POST] path: ${req.route.path}, Body: ${JSON.stringify(req.body)} `);
        return res.status(200).json({
            success: true
        });
    });
});

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        // isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        // role: req.user.role,
    });
});

router.get("/logout", auth, (req, res) => {
    console.log(`[SERVER] [USER ROUTER] [LOGOUT GET] path: ${req.route.path}, Find Model: ${JSON.stringify(req.user)} `);
    User.findOneAndUpdate( { _id:req.user._id}, {token:"", tokenExp: ""}, (err, doc) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true,
        });
    });

});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log(`[SERVER] [USER ROUTER] [LOGIN POST] path: ${req.route.path}, Find Model: ${JSON.stringify(user)} `);
        if(!user){
            return res.json({
                success: false,
                message: "등록된 이메일이 아닙니다."
            });
        }
        

        user.comparePassword(req.body.password, (err, isMatch)=>{
            console.log("test1");
            if (!isMatch) {
                return res.json({
                success: false,
                message: "비밀번호가 일치하지 않습니다.",});
            }

            user.generateToken((err, user) => {
                // client에 200, cooke에 token, exp 저장
                if (err) return res.status(400).send(err);
                
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token)
                .status(200)
                .json({
                    success: true, userId: user._id
                });
            });

        });
    });
});

module.exports=router;


// export{};