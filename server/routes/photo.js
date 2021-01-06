const express = require('express');
const router = express.Router();
const { PhotoModel } = require("../models/Photo");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const multer = require('multer');
const fs = require('fs');
const { json } = require('body-parser');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/tmp/');
    },
    filename: function (req, file, cb) {
        // cb(null, `test.png`);
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage: storage }).single("file");

// 사용자가 로컬에서 불러온 이미지를 임시 저장한다.
router.post("/upload", (req, res)=>{

    console.log("##################################################");
    console.log("##################################################");
    console.log("##################################################");
    console.log("##################################################");
    console.log("####################TEST$$$$$#####################");
    
    // console.log(req);
    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            console.log(`[SERVER] [PHOTO ROUTER] [UPLOAD POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
            return req.json({ success: false, err })
        }
        console.log(`[SERVER] [PHOTO ROUTER] [UPLOAD POST] path: ${req.route.path}, TEMP IMG FILE: ${JSON.stringify(res?.req?.file)} `);
        return res.json({ success: true, filePath: res?.req?.file?.path, fileName: res?.req?.file?.filename })
    });

});


const PHOTO_BASE_PATH = `uploads/photo/`;
router.post("/add", auth, (req,res) => {

    console.log(`[SERVER] [PHOTO ROUTER] [ADD POST] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);
    console.log(req);


    // 서버 임시 tmp(임시) 폴더에 이미지 파일 이 있는지
    fs.stat(req?.body?.photoPath, function(err){
        if(!err){
            //  이미지 파일이 있다면 photo 폴더로 이동
            fs.rename(req?.body?.photoPath, PHOTO_BASE_PATH+req?.body?.photoName, function(err){
                if(err) return res.json({ success:false, err, });

                req.body = {...req.body, photoPath: `uploads\\photo\\${req.body.photoName}`};

                const photoModel = new PhotoModel(req.body);
                
                // photo db 저장
                photoModel.save((err, doc)=>{
                    if(err) return res.json({ success:false, err});
                })
                // user 에 img id, path, name 저장
                User.findOneAndUpdate(
                    { _id:req.user._id}, 
                    {
                        $push: {
                            photo: {
                                path:req.body.photoPath,
                                name:req.body.photoName,
                                type:req.body.photoType,
                            }
                        }
                    },
                    (err, res)=>{
                    if(err) return res.json({ success:false, err});
                });


                
                return res.json({ success:true });
            })
            
        }else{
            console.log("############### No Find");
            return res.status(200),json({ success: true });
        }
        
    });
    
});

module.exports = router;