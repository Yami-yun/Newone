const express = require('express');
const router = express.Router();
const { Config } = require('../models/Config');

const { json } = require('body-parser');

const data = {
    configSet:true,
    userKey:0,
}



// const config = new Config(data);
// config.save(data)

router.get('/get_user_key', (req, res)=>{
    Config.findOne({configSet:true}, (err, config)=>{
        console.log(config);
    });

    return res.status(200).json({success: true});
});


module.exports = router;