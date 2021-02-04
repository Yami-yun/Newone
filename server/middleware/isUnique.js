// api의 middleware
const { User } = require('../models/User');

// 작가 이름이 중복여부를 확인하는 미들웨어
const authorNameUnique = (req, res, next) => {

    if(req.user.authorName !== req.body.authorName){
        // author name 이 변경 되었고, 유일성을 지키지 않았는지 확인
        User.findOne({authorName:req.body.authorName}, (err, doc)=>{
            // 중복된 값이 찾아지면 false를 res 보냄.
            if(doc) {
                return res.json({success: false})
            }
            next();
            
        });
    }else{
        next();
    }
    
};

module.exports = { authorNameUnique };