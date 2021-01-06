const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const fs = require('fs');
const { json } = require('body-parser');
// const async = require('async');

// 회원가입 api
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

// 
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        // _id: req.user._id,
        // isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        authorName: req.user.authorName,
        photoData: req.user.photo,
        personalImg: req.user.personalImg,

        // role: req.user.role,
    });
});

// logout api
router.get("/logout", auth, (req, res) => {
    console.log(`[SERVER] [USER ROUTER] [LOGOUT GET] path: ${req.route.path}, Find Model: ${JSON.stringify(req.user)} `);
    User.findOneAndUpdate( { _id:req.user._id}, {token:"", tokenExp: ""}, (err, doc) => {
        if(err) return res.json({success: false, err});

        return res.status(200).send({
            success: true,
        });
    });
});

// login api
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
                
                // res 에 쿠키 정보 저장
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/user/personal/');
    },
    filename: function (req, file, cb) {
        // cb(null, `test.png`);
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage }).single("file");

router.post('/modified_personal_img', auth , (req, res) => {
    // personal img가 등록되어 있는지 확인
    if(req.user.personalImg){
        // 서버 경로에 img 유무 확인
        console.log("11111111111111111111111111111111111111111");
        fs.stat(req?.user?.personalImg, function(err){
            if(err) return res.json({success: false});

            // img 있으면 제거 후, client에서 받은 이미지 재 등록
            fs.unlink(req?.user?.personalImg, ()=>{
                upload(req, res, err => {
                    if (err) {
                        console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
                        return req.json({ success: false, err })
                    }
                    
                    User.findOneAndUpdate({_id:req.user._id}, {personalImg:res?.req?.file?.path}, (err, doc, res) => {
                        if(err){
                            return req.json({ success: false, err});
                        }
                        
                    });
                    console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, FILE: ${JSON.stringify(res?.req?.file)} `);
                    return res.status(200).json({ success: true, result: res?.req?.file?.path });
                });
            });
        });
        
    }else{
        // 아직 이미지가 등록이 안되었을 경우,
        console.log("2222222222222222222222222222222222222222");
        upload(req, res, err => {
            if (err) {
                console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
                return req.json({ success: false, err })
            }
            
            User.findOneAndUpdate({_id:req.user._id}, {personalImg:res?.req?.file?.path}, (err, doc, res) => {
                if(err){
                    return req.json({ success: false, err});
                }
                
            });
            console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, FILE: ${JSON.stringify(res?.req?.file)} `);
            return res.status(200).json({ success: true, result: res?.req?.file?.path });
            
        });
    }
    
});

router.get('/info', auth, (req, res) => {

    console.log("###########################test");
    console.log(req.user);
    // User.findOne({id:req.user._id}, (err, doc)=>{
        
    // } )
});

const UPPER_PHOTO_BASE_PATH = `uploads/user/upper/`;
const PERSONAL_PHOTO_BASE_PATH = `uploads/user/personal/`;
router.patch('/modified_personal_info', auth, (req, res)=>{
    console.log(`[SERVER] [USERS ROUTER] [MODIFIED PERSONAL INFO PATCH] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);

    //  이미지 파일이 있다면 photo 폴더로 이동
    fs.rename(req?.body?.upperPhoto?.path, UPPER_PHOTO_BASE_PATH+req?.body?.upperPhoto?.name, function(err){
        if(err) return res.json({ success:false, err, });

        fs.rename(req?.body?.personalPhoto?.path, PERSONAL_PHOTO_BASE_PATH+req?.body?.personalPhoto?.name, function(err){
            req.body = {...req.body, photoPath: `uploads\\photo\\${req.body.photoName}`};

            // user 에 img id, path, name 저장
            User.findOneAndUpdate(
                { _id:req.user._id}, 
                {
                    personalImgName: req.body.personalPhoto.name,
                    personalImgPath: req.body.personalPhoto.path,
                    upperImgName: req.body.upperPhoto.name,
                    upperImgPath: req.body.upperPhoto.path,
                    instruction: req.body.instruction,
                    authorName: req.body.authorName,
                },
                (err, res)=>{
                if(err) return res.json({ success:false, err});
            });
        });


        
        return res.status(200).json({ success:true });
    })
});


module.exports=router;


// export{};