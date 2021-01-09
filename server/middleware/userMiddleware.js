// api의 middleware
const { User } = require('../models/User');

const authorNameUnique = (req, res, next) => {

    if(req.user.authorName !== req.body.authorName){
        // author name 이 변경 되었고, 유일성을 지키지 않았는지 확인
        console.log("111111111111111111111111111111");
        User.findOne({authorName:req.body.authorName}, (err, doc)=>{
            console.log("2222222222222222222222222222222222222");
            console.log(err);
            console.log(doc);
            if(doc) {

                console.log("333333333333333333333333333333333333");
                return res.json({success: false})
            }
            next();
            
        });
    }else{
        next();
    }
    
};


module.exports = { authorNameUnique };