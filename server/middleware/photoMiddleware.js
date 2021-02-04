const { PhotoModel } = require("../models/Photo");

// 작품 id로 작품 db를 반환하는 미들웨어
const findPhotoModelById = (req, res, next) => {

    PhotoModel.findOne({_id: req.body._id},(err, doc)=>{
        if(err) res.json({success: false, err});

        req.photo = doc;

        next();
    });
};

module.exports= {findPhotoModelById};