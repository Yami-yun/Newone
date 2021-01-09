const { PhotoModel } = require("../models/Photo");


const findPhotoModelById = (req, res, next) => {

    console.log(req.body._id);
    PhotoModel.findOne({_id: req.body._id},(err, doc)=>{
        if(err) res.json({success: false, err});

        // console.log(doc);

        req.photo = doc;

        next();
    });
};

module.exports= {findPhotoModelById};