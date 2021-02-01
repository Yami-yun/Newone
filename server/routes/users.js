const express = require('express');
const router = express.Router();
const multer = require('multer');
const { User } = require("../models/User");
const { AdminModel } = require("../models/Admin");
const { auth } = require("../middleware/auth");
const { authorNameUnique } = require("../middleware/userMiddleware");
const { transporter } = require("../config/email");
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 회원가입 api
router.post("/register", (req, res) => {

    req.body = {...req.body, key:Date.now() *123};
    const user = new User(req.body);

    // 회원가입 정보를 user db에 저장
    user.save((err, doc)=>{
        if(err) return res.json({ success: false, err: err.keyPattern });
        // console.log(`[SERVER] [USER ROUTER] [REGISTER POST] path: ${req.route.path}, Body: ${JSON.stringify(req.body)} `);

        return res.status(200).json({
            success: true
        });
    });
});

// 페이지 이동 시, 접근 권환 확인 api
router.get("/auth", auth, (req, res) => {

    //AdminModel.countToday();

    res.status(200).json({
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
        alarm: req.user.alarm,
        role:req.user.role,
    });
});

// logout api
router.get("/logout", auth, (req, res) => {
    // console.log(`[SERVER] [USER ROUTER] [LOGOUT GET] path: ${req.route.path}, Find Model: ${JSON.stringify(req.user)} `);

    //db에서 토큰 초기화
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
        // console.log(`[SERVER] [USER ROUTER] [LOGIN POST] path: ${req.route.path}, Find Model: ${JSON.stringify(user)} `);
        // 이메일 등록 여부 확인
        if(!user){
            return res.json({
                success: false,
                message: "등록된 이메일이 아닙니다."
            });
        }

        // 비밀번호 비교
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if (!isMatch) {
                return res.json({
                success: false,
                message: "비밀번호가 일치하지 않습니다.",});
            }

            // 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                AdminModel.countToday(user.key);

                //cooke에 token, exp 저장
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
        fs.stat(req?.user?.personalImg, function(err){
            if(err) return res.json({success: false});

            // img 있으면 제거 후, client에서 받은 이미지 재 등록
            fs.unlink(req?.user?.personalImg, ()=>{
                upload(req, res, err => {
                    if (err) {
                        // console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
                        return req.json({ success: false, err })
                    }
                    
                    User.findOneAndUpdate({_id:req.user._id}, {personalImg:res?.req?.file?.path}, (err, doc, res) => {
                        if(err){
                            return req.json({ success: false, err});
                        }
                        
                    });
                    // console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, FILE: ${JSON.stringify(res?.req?.file)} `);
                    return res.status(200).json({ success: true, result: res?.req?.file?.path });
                });
            });
        });
        
    }else{
        // 아직 이미지가 등록이 안되었을 경우,s
        upload(req, res, err => {
            if (err) {
                // console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
                return req.json({ success: false, err })
            }
            
            User.findOneAndUpdate({_id:req.user._id}, {personalImg:res?.req?.file?.path}, (err, doc, res) => {
                if(err){
                    return req.json({ success: false, err});
                }
            });
            // console.log(`[SERVER] [USERS ROUTER] [MODIFIED_PERSONAL_IMG POST] path: ${req.route.path}, FILE: ${JSON.stringify(res?.req?.file)} `);
            return res.status(200).json({ success: true, result: res?.req?.file?.path });
            
        });
    }
    
});

const UPPER_PHOTO_BASE_PATH = `uploads/user/upper/`;
const PERSONAL_PHOTO_BASE_PATH = `uploads/user/personal/`;
// 개인 정보 변경
router.patch('/modified_personal_info', auth, authorNameUnique, (req, res)=>{
    // console.log(`[SERVER] [USERS ROUTER] [MODIFIED PERSONAL INFO PATCH] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);

    let [rbody, ruser] = [req.body, req.user];
    if(rbody.upperPhoto.path !== rbody.preUpperPhoto.path){
        // 이전 이미지 경로와 바뀐 이미지 경로가 다르면 > 이미지 변경됨
        if(fs.existsSync(rbody.upperPhoto?.path)){
            // 임시 폴더에 파일이 있을 경우, 서버.user.upper 폴더로 이동
    
            fs.rename(rbody.upperPhoto?.path, UPPER_PHOTO_BASE_PATH+rbody.upperPhoto?.name, function(err){
                if(err) return res.json({ success:false, err, });

                // 기존 파일 제거
                fs.unlink(rbody.preUpperPhoto.path, ()=>{});
            });
        }
    }

    if(rbody.personalPhoto.path !== rbody.prePersonalPhoto.path){
        // 이전 이미지 경로와 바뀐 이미지 경로가 다르면 > 이미지 변경됨
        if(fs.existsSync(rbody.personalPhoto?.path)){

            // 임시 폴더에 파일이 있을 경우( === 즉 사용자가, 이미지를 변경한 경우), 서버.user.personal 폴더로 이동
            fs.rename(rbody.personalPhoto?.path, PERSONAL_PHOTO_BASE_PATH+rbody.personalPhoto?.name, function(err){
                if(err) return res.json({ success:false, err, });

                // 기존 이미지 제거
                fs.unlink(rbody.prePersonalPhoto.path, ()=>{});
            });
        }
    }

    // req에서 받아온 path는 tmp 경로이기 때문에 user 경로로 바꾸어서 db에 저장한다.
    rbody = {
        ...rbody, 
        upperPhoto: {...rbody.upperPhoto, path :`uploads\\user\\upper\\${rbody.upperPhoto.name}`}, 
        personalPhoto: {...rbody.personalPhoto, path :`uploads\\user\\personal\\${rbody.personalPhoto.name}`} 
    };

    // db에 변경된 데이터 저장
    User.findOneAndUpdate(
        { _id:ruser._id}, 
        {
            personalImgName: rbody.personalPhoto.name,
            personalImgPath: rbody.personalPhoto.path,
            upperImgName: rbody.upperPhoto.name,
            upperImgPath: rbody.upperPhoto.path,
            instruction: rbody.instruction,
            authorName: rbody.authorName,
            homepage: rbody.homepage,
            twitter: rbody.twitter,
        },
        (err)=>{
            if(err) return res.json({ success:false, err:err.keyPattern});

            return res.json({
                success: true,
            });
        }
    );
    

});

// 개인 페이지의 유저 정보 반환
router.post('/get_personal_info', auth, (req, res)=>{
    
    let isUser = (parseInt(req.body.key) === req.user.key);
    // 해당 본인 페이지인지 확인

    User.findOne({key: req.body.key}, (err, doc)=>{

        if(err) {
            // console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, ERR DATA: ${JSON.stringify(err)} `);
            return res.json({success: false, err});
        };

        if(!doc){
            // console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, NO FIND DATA `);
            return res.json({success: false});
        }

        // console.log(`[SERVER] [USERS ROUTER] [GET PERSONAL INFO POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(doc)} `);

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
                alarm: doc.alarm,
            } });
    });
});

// 팔로우 api
router.post('/follow', auth, (req, res)=>{    
    // console.log(`[SERVER] [USERS ROUTER] [FOLLOW POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(req.body.key)} `);
    // console.log(`[SERVER] [USERS ROUTER] [FOLLOW POST] path: ${req?.route?.path}, RESULT DATA: ${JSON.stringify(req.user.key)} `);

    // follow 할경우
    if(req.body.follow){
        // 해당 작품의 작가의 팔로워 추가
        User.findOneAndUpdate({key: req.body.key}, {$push: {follower: req.user.key} }, (err, doc)=>{
            if(err) return res.json({success: false, err});
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

// 팔로우 여부 확인하는 api
router.post('/is_follow', auth, (req,res) => {

    User.findOne({key: req.user.key}, (err, doc)=>{
        console.log("############### test1");
        if(err) return res.json({success: false, err});
        console.log("############### test2");
        console.log(err, doc);

        const result = doc.follow.includes(req.body.key);
        return res.json({success: true, result,});

    });
});

// 작가 이름 검색 api
router.get('/search_author', (req, res)=>{

    User.find({authorName: {$regex: ".*" + req.query.searchTxt + ".*"} }, (err, doc)=>{
            if(err) return res.json({ success:false, err });
        
            return res.json({ success:true, result: doc });
        
        }).limit(100);
});

router.post('/get_verified_code', (req, res) =>{
    const min = 100000;
    const max = 999999;
    const verificationNumber = Math.floor(Math.random()*(max-min+1) ) + min;

    const mailOptions = {
        from: '"Newone" <yunyami0605@naver.com>',
        to: req.body.email,
        subject: `[Newone] ${req.body.str} 인증 관련 이메일 입니다.`,
        text: "반갑습니다. 인증 번호 : " + verificationNumber + " 를 입력해주세요. 감사합니다.",
    };

    transporter.sendMail(mailOptions, (err, info)=>{
        if(err){
            return res.json({ success:false, err });
        }

        return res.json({ success:true, verificationNumber});
        
    });
});


// 비밀번호 변경 api
router.post('/modify_password', (req, res) =>{

    bcrypt.genSalt(saltRounds, function(err, salt){
        //hash 비밀번호를 db에 저장
        bcrypt.hash(req.body.password, salt, function(err, hash){
            if(err) return res.json({success:false, err});

            User.findOneAndUpdate({email: req.body.email}, {password: hash}, (err, doc)=>{
                if(err) return res.json({success:false, err});
                res.json({ success:true });
            });

        });
    });

});

module.exports=router;
