const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const saltRounds = 10;
const moment = require("moment");

// 유저정보 스키마
const userSchema = mongoose.Schema({
    key:{
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type:String,
        required: true,     // 필수
        unique: true,       // 유일성
        lowercase: true,
        trim:true,          // 공백 제거해야한다.       
    },
    password: {
        type: String,
        maxlength: 100,
        minglength: 8,
    },
    authorName: {
        type:String,
        maxlength: 50,
        minlength: 2,
        unique: true,
    },
    role : {
        type:Number,
        default: 0 
    },
    photo:[new mongoose.Schema({path: String, name: String, type: Number, id: String})],            // 자신이 창작한 작품 이미지 db
    personalImgName: {
        type:String,
        default: "",
    },
    personalImgPath:{
        type:String,
        default: "",
    },
    upperImgName: {
        type:String,
        default: "",
    },
    upperImgPath:{
        type:String,
        default: "",
    },
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    },
    instruction:{
        type: String,
        default: "",
    },
    twitter:{
        type: String,
        default: "",
    },
    homepage:{
        type: String,
        default: "",
    },
    alarm:[new mongoose.Schema({createDate: { type: Date, default: new Date() }, str: String, isShow: Boolean, photoKey:String})],
    follow:{
        type: Array,
        default: [],
    },
    follower:{
        type: Array,
        default: [],
    },
    createDate:{
        type: Date,
        default: Date.now,
    },
})

// user 모델 db에 데이터 입력 전, 실행
userSchema.pre('save', function(next){
    let user = this;

    // 비밀번호를 넣을 때,
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){

            //hash 비밀번호를 db에 저장
            bcrypt.hash(user.password, salt, function(err,hash){
                if(err) return next(err);
                // console.log(`[SERVER] [USER MODEL] path: /register, pw: ${hash} `);
                user.password = hash;
                next();
            })
        })
    }else{
        // 다른 사항을 넣을 때, 그냥 저장한다.
        next();
    }
});


// 로그인 비번 비교 함수
userSchema.methods.comparePassword = function(requestPassword, cb){
    bcrypt.compare(requestPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

// token 생성 함수
userSchema.methods.generateToken = function(cb){
    let user = this;
    let token = jsonwebtoken.sign(user._id.toHexString(), 'secret');
    // 지금 부터 12시간 후, 날짜 구하기
    let halfDay = moment().add(12, 'hour').valueOf();

    user.tokenExp = halfDay;
    user.token = token;
    // token, exp db에 저장 
    user.save(function(err, user){
        console.log(err);
        if(err) return cb(err);
        cb(null, user);
    });


}


userSchema.statics.findByToken = function(token, cb){
    const user = this;
    // client에서 받은 token을 디코딩한다.
    jsonwebtoken.verify(token, 'secret', function(err, decode){
        // 디코딩 된 토큰값이 db에서 일치하는 토큰 값이 있는지 확인한다.
        user.findOne({"_id": decode, "token": token}, function (err, user){
            if(err) return cb(err);

            // console.log(`Auth return model : ${user}`);

            // 찾은 결과 db값을 cb로 보낸다.
            cb(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
