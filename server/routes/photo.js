const express = require('express');
const router = express.Router();
const { PhotoModel } = require("../models/Photo");
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const multer = require('multer');
const fs = require('fs');
const { json } = require('body-parser');
const {findPhotoModelById} = require("../middleware/photoMiddleware");


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
    console.log(req.body);
    
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

router.delete("/tmp_photo_delete", (req, res)=>{
    
    console.log(`[SERVER] [PHOTO ROUTER] [TMP PHOTO DELETE DELETE] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);
    if(!req?.body?.photoPath) return res.json({success: true});

    
    // fs.unlinkSync(req?.body?.photoPath);
    return res.json({success: true});
});


const PHOTO_BASE_PATH = `uploads/photo/`;
router.post("/add", auth, (req,res) => {

    console.log(`[SERVER] [PHOTO ROUTER] [ADD POST] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);
    // console.log(req);


    // 서버 임시 tmp(임시) 폴더에 이미지 파일 이 있는지
    fs.stat(req?.body?.photoPath, function(err){
        if(!err){
            //  이미지 파일이 있다면 photo 폴더로 이동
            fs.rename(req?.body?.photoPath, PHOTO_BASE_PATH+req?.body?.photoName, function(err){
                if(err) return res.json({ success:false, err, });

                req.body = {...req.body, 
                    photoPath: `uploads\\photo\\${req.body.photoName}`,
                    authorName: req.user.authorName,
                    authorKey: req.user.key,
                };
                console.log("#################################################################");
                console.log("#################################################################");
                console.log("##########################TEST############################");
                console.log(req.user);
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
                                id:photoModel._id,
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


router.post('/get_photo_info', (req, res)=> {
    console.log(`[SERVER] [PHOTO ROUTER] [GET_PHOTO_INFO POST] path: ${req.route.path}, RESULT: ${JSON.stringify(req.body)} `);
    PhotoModel.findOne({_id:req.body.photoId }, (err, doc)=>{
        if(err) res.json({success: false, err,})
        console.log(`[SERVER] [PHOTO ROUTER] [GET_PHOTO_INFO POST] path: ${req.route.path}, RESULT: ${JSON.stringify(doc)} `);

        return res.status(200).json({success : true, result:doc});
    });

});

router.post('/get_author_info', (req, res)=> {
    console.log(`[SERVER] [PHOTO ROUTER] [GET_AUTHOR_INFO POST] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);
    // console.log(req.body);
    
    User.findOne({key:req.body.key}, (err, doc)=>{
        if(err) return res.json({success: false, err});

        return res.status(200).json({success : true, result:{
            authorName: doc.authorName,
            key: doc.key,
            personalImgName: doc.personalImgName,
            personalImgPath: doc.personalImgPath,
            photo: doc.photo,
        }});
    });


    
});

router.delete('/delete', auth, (req, res)=>{

    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO_DELETE DELETE] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);

    // 서버에서 포토 파일 삭제
    fs.unlink(req.body.path, ()=>{});
    //해당 photo db 삭제
    PhotoModel.findOneAndDelete({_id:req.body.id}, (err, doc, res)=>{
        if(err) return res.json({success: false, err});
        
    });

    const userPhotoData = req.user.photo;
    const cmp = userPhotoData.splice(userPhotoData.map(x=>x._id).indexOf(req.body._id),1);

    // user db에서 해당 포토 데이터 삭제
    User.findOneAndUpdate({_id:req.user._id}, {photo: userPhotoData}, (err, doc, any)=>{
        if(err) return res.json({success: false, err});
        return res.json({success:true})
        // console.log(res);
    });

});

router.patch('/modify', auth, (req, res) =>{
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO_MODIFY PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);

    const modifyData = req.body.data;

    const userPhotoData = req.user.photo;
    const cmp = userPhotoData.splice(userPhotoData.map(x=>x.path).indexOf(modifyData.photoPath),1);
    userPhotoData.push({
        id: cmp[0].id,
        path: PHOTO_BASE_PATH+ modifyData.photoName,
        name: modifyData.photoName,
        type: modifyData.photoType,
    });
    
    // user db에서 해당 포토 데이터 변경
    User.findOneAndUpdate({_id:req.user._id}, {photo: userPhotoData}, (err, doc, any)=>{
        if(err) return res.json({success: false, err});

        // console.log(doc);
    });
    
    //해당 photo db 변경
    PhotoModel.findOneAndUpdate({_id:cmp[0].id}, 
        {
            title:modifyData.title, 
            description: modifyData.description,
            tagList: modifyData.tagList,
            photoName: modifyData.photoName,
            photoPath: PHOTO_BASE_PATH+ modifyData.photoName,
            photoType: modifyData.photoType,
        } ,(err, doc, res)=>{
        if(err) return res.json({success: false, err});
        
    });

    // 이미지가 변경되었을 경우,
    if(req.body.isPhotoChange){
        // 기존 이미지 파일 삭제
        fs.unlink(cmp[0].path, ()=>{
            // // 서버 임시 tmp(임시) 폴더에 이미지 파일 이 있는지
            fs.stat(modifyData.photoPath, function(err){
                if(!err){
                    //  이미지 파일이 있다면 photo 폴더로 이동
                    fs.rename(modifyData.photoPath, PHOTO_BASE_PATH+modifyData.photoName, function(err){
                        if(err) return res.json({ success:false, err, });
                    });
                    
                }
            });
        });
    }

    return res.json({success: true});
});

router.patch('/new', auth, findPhotoModelById, (req, res)=>{
    
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO NEW PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.user.key)} `);
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO NEW PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO NEW PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.photo)} `);

    // PhotoModel.find(req.body._id, (err, docs)=>{
    //     console.log(docs);
    // });
    console.log(req.photo.new.indexOf(req.user.key));

    if(req.photo.new.indexOf(req.user.key) === -1){
        // 아직 New를 누르지 않았다.
        PhotoModel.findOneAndUpdate({_id: req.body._id}, {$push: {new: req.user.key}}, (err, data)=>{
            if(err) return res.json({success: false, err})

        });

    }else{
        // New한 상태
        const tmp = req.photo.new.splice(req.photo.new.indexOf(req.user.key),1);
        PhotoModel.findOneAndUpdate({_id: req.body._id}, {new: req.photo.new}, (err, data)=>{
            if(err) return res.json({success: false, err})

        });
        

    }
    // PhotoModel.findOneAndUpdate({_id: req.body._id}, {$push: {new: req.user.key}}, (err, data)=>{
    //     console.log(err);
    //     console.log(data);
    // });
    // console.log(req.user.key);


    return res.json({success:true});
});

// 포토 화면에 들어갈 시, 사용자가 해당 이미지에 대한 New를 눌렀는지 확인함
router.post('/is_new', auth, findPhotoModelById, (req, res)=>{
    

    // photo db의 new 배열에 user key가 있으면 => 사용자가 해당 이미지에 이전에 New를 눌렀음 
    const result = req.photo?.new.indexOf(req.user.key) !== -1;
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO IS NEW PATCH] path: ${req.route.path}, BODY : ${JSON.stringify(req.body)} `);
    console.log(`[SERVER] [PHOTO ROUTER] [PHOTO IS NEW PATCH] path: ${req.route.path}, RESULT: ${JSON.stringify(result)} `);

    return res.json({success:true, result});
});


module.exports = router;