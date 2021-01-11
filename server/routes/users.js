const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { authorNameUnique } = require("../middleware/userMiddleware");
const fs = require('fs');


// 회원가입 api
router.post("/register", (req, res) => {

    req.body = {...req.body, key:Date.now() *123};
    console.log(req.body)
    const user = new User(req.body);

    

    user.save((err, doc)=>{
        if(err) return res.json({ success: false, err: err.keyPattern });
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
        personalImgName: req.user.personalImgName,
        personalImgPath: req.user.personalImgPath,
        upperImgName: req.user.upperImgName,
        upperImgPath: req.user.upperImgPath,
        instruction: req.user.instruction,
        homepage: req.user.homepage,
        twitter: req.user.twitter,
        key: req.user.key,

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
            console.log("test11111111111111111111111111111111111111111111111111111111111111111");
            return res.json({
                success: false,
                message: "등록된 이메일이 아닙니다."
            });
        }

        user.comparePassword(req.body.password, (err, isMatch)=>{
            console.log("test222222222222222222222222222222222222222222222222222222222222");
            if (!isMatch) {
                console.log("test333333333333333333333333333333333333333333333");
                return res.json({
                success: false,
                message: "비밀번호가 일치하지 않습니다.",});
            }

            user.generateToken((err, user) => {
                // client에 200, cooke에 token, exp 저장
                console.log("test4444444444444444444444444444444444444444444");
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

const UPPER_PHOTO_BASE_PATH = `uploads/user/upper/`;
const PERSONAL_PHOTO_BASE_PATH = `uploads/user/personal/`;
router.patch('/modified_personal_info', auth, authorNameUnique, (req, res)=>{
    console.log(`[SERVER] [USERS ROUTER] [MODIFIED PERSONAL INFO PATCH] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);

    if(fs.existsSync(req?.body?.upperPhoto?.path)){
        // 임시 폴더에 파일이 있을 경우( === 즉 사용자가, 이미지를 변경한 경우), 서버.user.upper 폴더로 이동

        fs.rename(req?.body?.upperPhoto?.path, UPPER_PHOTO_BASE_PATH+req?.body?.upperPhoto?.name, function(err){
            if(err) return res.json({ success:false, err, });

            // 기존 이미지 제거
            fs.unlink(req.user.upperImgPath, ()=>{});
        });
    }

    if(fs.existsSync(req?.body?.personalPhoto?.path)){

        // 임시 폴더에 파일이 있을 경우( === 즉 사용자가, 이미지를 변경한 경우), 서버.user.personal 폴더로 이동
        fs.rename(req?.body?.personalPhoto?.path, PERSONAL_PHOTO_BASE_PATH+req?.body?.personalPhoto?.name, function(err){
            if(err) return res.json({ success:false, err, });

            // 기존 이미지 제거
            fs.unlink(req.user.personalImgPath, ()=>{});
        });
    }

    req.body = {
        ...req.body, 
        upperPhoto: {...req.body.upperPhoto, path :`uploads\\user\\upper\\${req.body.upperPhoto.name}`}, 
        personalPhoto: {...req.body.personalPhoto, path :`uploads\\user\\personal\\${req.body.personalPhoto.name}`} 
    };

    req.body = {...req.body, photoPath: `uploads\\photo\\${req.body.photoName}`};
    User.findOneAndUpdate(
        { _id:req.user._id}, 
        {
            personalImgName: req.body.personalPhoto.name,
            personalImgPath: req.body.personalPhoto.path,
            upperImgName: req.body.upperPhoto.name,
            upperImgPath: req.body.upperPhoto.path,
            instruction: req.body.instruction,
            authorName: req.body.authorName,
            homepage: req.body.homepage,
            twitter: req.body.twitter,
        },
        (err)=>{
            if(err) return res.json({ success:false, err:err.keyPattern});

            return res.json({
                success: true,
            });
        }
    );
    

});

router.post('/get_personal_info', auth, (req, res)=>{
    
    let isUser = (parseInt(req.body.key) === req.user.key);
    // 해당 본인 페이지라면
    console.log("################################################");
    console.log(typeof req.body.key);
    console.log(typeof req.user.key);
    // isUser = (req.body.key === req.user.key);
    // if(req.body.key === req.user.key){
    //     isUser =true;
    // else isUser = false;

    console.log(isUser);
    User.findOne({key: req.body.key}, (err, doc)=>{

        if(err) {
            console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, ERR DATA: ${JSON.stringify(err)} `);
            return res.json({success: false, err});
        };

        if(!doc){
            console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, NO FIND DATA `);
            return res.json({success: false});
        }

        console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(doc)} `);

        return res.json({
            success:true, 
            result: { 
                personalImgName : doc.personalImgName,
                personalImgPath : doc.personalImgPath,
                upperImgName : doc.upperImgName,
                upperImgPath : doc.upperImgPath,
                instruction : doc.instruction,
                twitter : doc.twitter,
                homepage : doc.homepage,
                email : doc.email,
                authorName : doc.authorName,
                key : doc.key,
                photo : doc.photo,
                isUser : isUser,
                follow : doc.follow,
                follower : doc.follower,
            } });
    });
});

router.post('/follow', auth, (req, res)=>{
    
    console.log(`[SERVER] [USERS ROUTER] [FOLLOW POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(req.body.key)} `);
    console.log(`[SERVER] [USERS ROUTER] [FOLLOW POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(req.user.key)} `);


    // follow 할경우
    if(req.body.follow){
        // 해당 작품의 작가의 팔로워 추가
        User.findOneAndUpdate({key: req.body.key}, {$push: {follower: req.user.key} }, (err, doc)=>{
            if(err) return res.json({success: false, err});
            // return res.json({success: true});
        });

        // 유저의 팔로우 추가
        User.findOneAndUpdate({key: req.user.key}, {$push: {follow: req.body.key} }, (err, doc)=>{
            if(err) return res.json({success: false, err});
            return res.json({success: true});
        });

    }else{
        // follow 취소할 경우
        // 해당 작품의 작가의 팔로워 추가
        User.findOneAndUpdate({key: req.body.key}, {$pull: {follower: req.user.key} }, (err, doc)=>{
            if(err) return res.json({success: false, err});
        });

        // 유저의 팔로우 추가
        User.findOneAndUpdate({key: req.user.key}, {$pull: {follow: req.body.key} }, (err, doc)=>{
            if(err) return res.json({success: false, err});
            return res.json({success: true});
        });
    }

    
});

router.post('/is_follow', auth, (req,res) => {

    User.findOne({key: req.user.key}, (err, doc)=>{
        if(err) return res.json({success: false, err});

        const result = doc.follow.includes(req.body.key);
        return res.json({success: true, result,});

    });
});


module.exports=router;


// export{};