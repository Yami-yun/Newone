// api의 middleware
const { User } = require('../models/User');

const authorNameUnique = (req, res, next) => {

    if(req.user.authorName !== req.body.authorName){
        // author name 이 변경 되었고, 유일성을 지키지 않았는지 확인
        User.findOne({authorName:req.body.authorName}, (err, doc)=>{

            if(doc) {
                return res.json({success: false})
            }
            next();
            
        });
    }else{
        next();
    }
    
};

const getUserInfo = (req, res, next) => {
    
    User.findOne({authorName: req.body.authorName}, {}, (err, doc)=>{
        if(err) res.json({success:false, err});

        req.info = doc[0];
        next();
    })
};


module.exports = { authorNameUnique, getUserInfo };