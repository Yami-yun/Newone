const mongoose = require("mongoose");

// 작품 스키마
const photoSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    tagList:{
        type: Array,
        default: [],
    },
    photoName:{
        type: String,
    },
    photoPath:{
        type: String,
    },
    photoType:{
        //"ILLUST" : 0 | "CARTOON" : 1 | "CALLI" : 2
        type: Number,
        default: 0,
    },
    createDate:{
        type: Date,
        default: Date.now,
    },
    new:{
        type:Array,
        default: [],
    },
    authorName:{
        type:String,
    },
    authorKey:{
        type:Number,
    },
});

const PhotoModel = mongoose.model('Photo', photoSchema);
module.exports = { PhotoModel };