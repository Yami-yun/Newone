// api의 middleware
const { User } = require('../models/User');

const auth = (req, res, next) => {

    let token = req.cookies.w_auth;
    

    User.findByToken(token, (err, user) => {
        if(err) throw err;

        // db 값이 없을 경우, 인증 실패를 보낸다.
        if(!user){
            return res.json({
                isAuth:false,
                error:true,
            })
        }
            // token을 찾았으면
        console.log("Client Request : ");
        console.log(token);
        // console.log(user);
        req.token = token;
        req.user = user;
        next();
        console.log(req.user);
    });

};

module.exports = { auth };