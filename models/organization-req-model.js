var mongoose = require('mongoose');

var OrgReq = mongoose.Schema({
    req_name: {
        type: String,
        required: true
    },
    req_points: {
        type: Number,
        required: true
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('OrgReq', OrgReq);