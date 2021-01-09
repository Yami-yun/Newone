const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    configSet:{
        type: Boolean,
        default: false,
    },
    userKey:{
        type: Number,
        unique: true,
    },
});

const ConfigModel = mongoose.model('Config', configSchema);
module.exports = { ConfigModel };