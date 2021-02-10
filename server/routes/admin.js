const express = require('express');
const router = express.Router();

const { AdminModel } = require("../models/Admin");
const { User } = require("../models/User");
const { PhotoModel } = require("../models/Photo");

const { auth } = require("../middleware/auth");

// 일일 접속자 수 데이터를 반환하는 api
router.get('/data', auth, (req, res)=>{
    AdminModel.find({}, (err, docs)=>{
        if(err) res.json({success:false, err});
        console.log("#######################");
        console.log(docs);
        return res.json({success:true, result: docs});
    })
    
});

// 모든 작가 정보를 반환하는 api
router.get('/all_user_data', auth, (req, res)=>{

    User.find({}, {authorName:1, email:1, createDate:1, follow:1, follower:1}, (err, docs)=>{
        if(err) res.json({success:false, err});
        
        return res.json({success:true, result: docs});
    })
    
});

// 모든 작품 정보를 반환하는 api
router.get('/all_photo_data', auth, (req, res)=>{

    PhotoModel.find({}, {authorName:1, title:1, createDate:1, _id:1}, (err, docs)=>{
        if(err) res.json({success:false, err});
        
        return res.json({success:true, result: docs});
    })
    
});

// 관리자 페이지에서 작가 정보 삭제 api
router.delete('/user_info', auth, (req, res)=>{

    User.findOneAndDelete({authorName: req.body.authorName}, (err, doc)=>{
        if(err) res.json({success:false, err});
        
        // 해당 작가에 대한 작품들도 다같이 삭제함
        PhotoModel.deleteMany({authorName: req.body.authorName},(err) => {
            if(err) res.json({success:false, err});

            return res.json({success:true});
        })
    })
});

// 관리자 페이지에서 작품 정보 삭제 api
router.delete('/photo_info', auth, (req, res)=>{

    PhotoModel.findOneAndDelete({_id: req.body._id}, (err, doc)=>{
        if(err) res.json({success:false, err});

        return res.json({success:true});
    })
});

module.exports=router;
