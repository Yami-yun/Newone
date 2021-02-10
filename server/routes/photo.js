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

    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            // console.log(`[SERVER] [PHOTO ROUTER] [UPLOAD POST] path: ${req.route.path}, ERR: ${JSON.stringify(err)} `);
            return req.json({ success: false, err })
        }
        // console.log(`[SERVER] [PHOTO ROUTER] [UPLOAD POST] path: ${req.route.path}, TEMP IMG FILE: ${JSON.stringify(res?.req?.file)} `);
        return res.json({ success: true, filePath: res?.req?.file?.path, fileName: res?.req?.file?.filename })
    });

});

// 임시 포토 파일 삭제
router.delete("/tmp_photo", (req, res)=>{
    
    // console.log(`[SERVER] [PHOTO ROUTER] [TMP PHOTO DELETE DELETE] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);
    if(!req?.body?.photoPath) return res.json({success: true});

    return res.json({success: true});
});

// 작품 등록 api
const PHOTO_BASE_PATH = `uploads/photo/`;
router.post("/add", auth, (req,res) => {
    // console.log(`[SERVER] [PHOTO ROUTER] [ADD POST] path: ${req?.route?.path}, REQUEST DATA: ${JSON.stringify(req?.body)} `);

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

                console.log("################################");
                console.log("################################");
                console.log(photoModel);
                console.log("################################");
                console.log("################################");

                // follow한 유저에게 작품 정보를 알린다.
                User.updateMany(
                    {follow: {$in: req.user.key}}, 
                    {$push: {alarm: {str:`${req.user.authorName}님이 ${req.body.title} 작품을 등록하였습니다.`, isShow:false, photoKey:photoModel._id.toString(), createDate:new Date()} } }, (err, res)=>{
                        if(err) return res.json({ success:false, err});

                });

                return res.json({ success:true });
            })
        }else{
            return res.json({ success: false, err });
        }
    });
});

//db에서 해당 페이지 포토 정보 가져오기
router.post('/photo_info', (req, res)=> {
    // console.log(`[SERVER] [PHOTO ROUTER] [GET_PHOTO_INFO POST] path: ${req.route.path}, RESULT: ${JSON.stringify(req.body)} `);
    PhotoModel.findOne({_id:req.body.photoId }, (err, doc)=>{
        if(err) res.json({success: false, err,})

        return res.status(200).json({success : true, result:doc});
    });

});

//db에서 작가 정보 가져오기
router.post('/author_info', (req, res)=> {
    // console.log(`[SERVER] [PHOTO ROUTER] [GET_AUTHOR_INFO POST] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);
    
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

// db에서 포토 데이터 삭제
router.delete('/delete', auth, (req, res)=>{
    // console.log(`[SERVER] [PHOTO ROUTER] [PHOTO_DELETE DELETE] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);

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

        return res.json({success:true});
    });
});

// user db에서 해당 포토 데이터를 포토 변경 페이지에서 변경한 데이터로 수정
router.patch('/modify', auth, (req, res) =>{
    // console.log(`[SERVER] [PHOTO ROUTER] [PHOTO_MODIFY PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.body)} `);

    let [rbody, ruser] = [req.body.data, req.user.photo];
    // 현재 로그인한 유저 db에서 photo.path 배열에서   기존 photoPath 데이터를 지운다. 
    const cmp = ruser.splice(ruser.map(x=>x.path).indexOf(rbody.photoPath),1);

    // 변경된 값을 넣는다.
    ruser.push({
        id: cmp[0].id,
        path: PHOTO_BASE_PATH+ rbody.photoName,
        name: rbody.photoName,
        type: rbody.photoType,
    });
    
    // user db에서 해당 포토 데이터 변경
    User.findOneAndUpdate({_id:req.user._id}, {photo: ruser}, (err, doc, any)=>{
        if(err) return res.json({success: false, err});
    });
    
    //해당 photo db 변경
    PhotoModel.findOneAndUpdate({_id:cmp[0].id}, 
        {
            title:rbody.title, 
            description: rbody.description,
            tagList: rbody.tagList,
            photoName: rbody.photoName,
            photoPath: PHOTO_BASE_PATH+ rbody.photoName,
            photoType: rbody.photoType,
        } ,(err, doc, res)=>{
        if(err) return res.json({success: false, err});
    });

    // 이미지가 변경되었을 경우,
    if(req.body.isPhotoChange){
        // 기존 이미지 파일 삭제
        fs.unlink(cmp[0].path, ()=>{
            // // 서버 임시 tmp(임시) 폴더에 이미지 파일 이 있는지
            fs.stat(rbody.photoPath, function(err){
                if(!err){
                    //  이미지 파일이 있다면 photo 폴더로 이동
                    fs.rename(rbody.photoPath, PHOTO_BASE_PATH+rbody.photoName, function(err){
                        if(err) return res.json({ success:false, err, });
                    });
                    
                }
            });
        });
    }
    return res.json({success: true});
});

// 작품에 new 클릭시 해당 유저의 key를 작품 db의 new 필드에 저장한다.
router.patch('/new', auth, findPhotoModelById, (req, res)=>{
    // console.log(`[SERVER] [PHOTO ROUTER] [PHOTO NEW PATCH] path: ${req.route.path}, BODY: ${JSON.stringify(req.photo)} `);

    if(req.photo.new.indexOf(req.user.key) === -1){
        // new를 눌렀을 경우 -> db에 해당 user key 저장
        PhotoModel.findOneAndUpdate({_id: req.body._id}, {$push: {new: req.user.key}}, (err, data)=>{
            if(err) return res.json({success: false, err})

            return res.json({success:true});
        });

    }else{
        // new를 해제했을 경우  -> db에 해당 user key 제거
        const tmp = req.photo.new.splice(req.photo.new.indexOf(req.user.key),1);
        PhotoModel.findOneAndUpdate({_id: req.body._id}, {new: req.photo.new}, (err, data)=>{
            if(err) return res.json({success: false, err})

            return res.json({success:true});
        });
    }
});

// 포토 화면에 들어갈 시, 사용자가 해당 이미지에 대한 New를 눌렀는지 확인함
router.post('/is_new', auth, findPhotoModelById, (req, res)=>{
    // photo db의 new 배열에 user key가 있으면 => 사용자가 해당 이미지에 이전에 New를 눌렀음
    const result = req.photo?.new.indexOf(req.user.key) !== -1;
    // console.log(`[SERVER] [PHOTO ROUTER] [PHOTO IS NEW PATCH] path: ${req.route.path}, RESULT: ${JSON.stringify(result)} `);

    return res.json({success:true, result});
});

// 작품을 추천할 목록을 반환한다.
router.get('/recommend_photo', (req, res)=>{
    // console.log(`[SERVER] [PHOTO ROUTER] [RECOMMEND PHOTO GET] path: ${req.route.path}, BODY : ${JSON.stringify(req.query.tagList)} `);
    
    // 해당 페이지 작품에 있는 모든 테그와 관련된 작품을 추출한다.
    PhotoModel.find({"tagList": {$all: req.query.tagList}}, (err, doc)=>{
        if(err) return res.json({success:false, err});

        return res.json({success:true, result: doc});
    }).limit(8);
});

// 오늘 날짜 등록된 작품의 랭킹 순으로 db에서 가져온다.
router.get('/get_today_lank', (req, res)=>{
    const date = new Date();
    const y = date.getFullYear().toString();
    const m = date.getMonth() + 1 >= 10 ? (date.getMonth() + 1).toString() : "0"+(date.getMonth() + 1).toString();
    const d = date.getDate() + 1 >= 10 ? date.getDate().toString() : "0"+date.getDate().toString();

    // 오늘날짜로 new를 많이 받은 작품들 순으로 가져온다.
    PhotoModel.aggregate([{"$project": {
            "title": 1,
            "photoPath": 1,
            "new": 1,
            "createDate": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createDate" }},
            "length": {"$size": "$new"},
        }},

        {"$sort": {"length": -1}},
        {"$limit": 20},
        {"$match": {"createDate": y+"-"+m+"-"+d } },

    ], (err, doc)=>{
        if(err) return res.json({success:false, err});

        return res.json({ success:true, result: doc });
    });
});

// 최근 등록된 작품 목록을 db에서 가져온다.
router.get('/recent_photo', (req, res)=>{
    // main에서 선택한 category 기준으로 최근 등록 작품 목록 반환
    PhotoModel.find({photoType: req.query.category}, (err, doc)=>{
        if(err) return res.json({success:false, err});

        return res.json({success:true, result: doc});
    })
    .sort({ new: -1 })
    .limit(100);
});

// 인기 테그리스트를 가져온다.
router.get('/famous_tag_list', (req, res)=>{
    // 작품 db에서 모든 테그리스트 배열을 원소화한 후, {tag name : 중복된 갯수} 형식으로 오름차순해서 가져온다.
    PhotoModel.aggregate([
        {"$unwind": "$tagList"},
        {"$group":{
            "_id": "$tagList",
            "count": {"$sum" : 1},
        }},
        {"$sort": {"count": -1}},
    ], (err, doc)=>{
        if(err) return res.json({success:false, err});

        return res.json({success:true, result: doc});
    })
    .limit(20);
});

// 작품 search api
router.get('/search_photo', (req, res)=>{
    // 검색단어와 제목이 유사한 작품 db를 뽑아온다.
    PhotoModel.find({title: {$regex: ".*" + req.query.searchTxt + ".*"} }, (err, doc)=>{
            if(err) return res.json({ success:false, err });

            return res.json({ success:true, result: doc });
        }).limit(100);
});

// 테그 search api
router.get('/search_tag', (req, res)=>{
    // 검색 단어와 유사한 테그들을 db에서 가져온다.
    PhotoModel.find({tagList: {$all : req.query.searchTxt} }, (err, doc)=>{
            if(err) return res.json({ success:false, err });
        
            return res.json({ success:true, result: doc });
        }).limit(100);
});

module.exports = router;

