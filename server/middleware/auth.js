// api의 middleware
const { User } = require('../models/User');

// 인증 미들웨어로서 client에서 받은 cookies 값을 db에서 찾아 확인한다.
const auth = (req, res, next) => {

    let token = req.cookies.w_auth;

    console.log(`[SERVER] [AUTH MIDDLEWARE] path: ${req.route.path}, CLIENT TOKEN: ${JSON.stringify(token)} `);

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
        req.token = token;
        req.user = user;

        
        next();
    });

};

module.exports = { auth };