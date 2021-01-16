// api의 middleware
const { User } = require('../models/User');

const auth = (req, res, next) => {

    let token = req.cookies.w_auth;

    // console.log(`[SERVER] [AUTH MIDDLEWARE] path: ${req.route.path}, CLIENT TOKEN: ${JSON.stringify(token)} `);

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
        // console.log(`[SERVER] [AUTH MIDDLEWARE] path: ${req.route.path}, RESULT: TOKEN FIND!!! `);
        req.token = token;
        req.user = user;
        next();
    });

};

module.exports = { auth };