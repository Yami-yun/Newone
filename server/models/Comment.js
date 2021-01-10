const mongoose = require('mongoose');


const commentSchema = mongoose.Schema({
    createDate:{
        type: Date,
        default: Date.now,
    },
    authorName:{
        type:String,
    },
    authorKey:{
        type:Number,
    },
    personalImgName: {
        type:String,
    },
    personalImgPath:{
        type:String,
    },
    commentTxt:{
        type:String,
    },
    photoId:{
        type:String,
    },
});


const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = { CommentModel };
