const express = require('express');
const router = express.Router();
const { CommentModel } = require('../models/Comment');
const { auth } = require('../middleware/auth');

// comment add api
router.post("/add", auth, (req, res)=>{
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT ADD POST] path: ${req.route.path}, BODY : ${JSON.stringify(req.body)} `);
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT ADD POST] path: ${req.route.path}, BODY : ${JSON.stringify(req.user)} `);

    const data = {
        authorName: req.user.authorName,
        authorKey: req.user.key,
        personalImgName: req.user.personalImgName,
        personalImgPath: req.user.personalImgPath,
        commentTxt: req.body.comment,
        photoId: req.body.photoInfo._id,
    };
    const commentModel = new CommentModel(data);

    commentModel.save((err, doc)=>{
        if(err) return res.json({ success:false, err});
        return res.json({success: true, result: commentModel});
    });
});

// 현재 페이지 작품에 달린 comment db 정보 가져옴
router.get("/get", (req, res)=>{
    console.log(`[SERVER] [COMMENTe233 ROUTER] [COMMENT GET POST] path: ${req.route.path}, BODY : ${JSON.stringify(req.query._id)} `);

    CommentModel.find((err, docs)=>{
        if(err) return res.json({success: false, err});
        return res.json({success: true, result: docs});
    })
    .where('photoId',JSON.parse(req.query.data)._id)
    .sort({ createDate: -1 })
    .limit(100);

});

// comment 삭제 api
router.delete("/delete", auth, (req, res)=>{
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT DELETE POST] path: ${req.route.path}, BODY : ${JSON.stringify(req.body)} `);
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT DELETE POST] path: ${req.route.path}, USER : ${JSON.stringify(req.user)} `);

    // 댓글이 현제 로그인한 유저가 작성여부 확인
    if(req.body.authorKey === req?.user?.key){
        // db에서 찾아서 제거
        CommentModel.findOneAndDelete({_id: req.body._id}, (err, doc)=>{
            if(err) return res.json({success: false, err}); 

            return res.json({success: true, result: req.body._id});
        });
    }else{
        return res.json({success: false});
    }
    

});

// comment 변경 api
router.patch("/modify", auth, (req, res)=>{
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT MODIFY POST] path: ${req.route.path}, BODY : ${JSON.stringify(req.body)} `);
    console.log(`[SERVER] [COMMENT ROUTER] [COMMENT MODIFY POST] path: ${req.route.path}, USER : ${JSON.stringify(req.user)} `);

    // 댓글이 현제 로그인한 유저가 작성여부 확인
    if(req.body.authorKey === req?.user?.key){
        // db에서 찾아서 변경
        CommentModel.findOneAndUpdate({_id: req.body._id}, {commentTxt:req.body.modifyCommentTxt}, (err, doc)=>{
            if(err) return res.json({success: false, err}); 
            return res.json({success: true, result: req.body._id});
        });
    }else{
        return res.json({success: false});
    }
});


module.exports = router;