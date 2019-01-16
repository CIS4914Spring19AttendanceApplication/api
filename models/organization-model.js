var mongoose = require('mongoose');
var OrgReq = require('./organization-req-model').schema;

var Organization = mongoose.Schema({
    organization_name: {
        type: String,
        required: true
    },
    reqs: [OrgReq],
    users: [{
        type: String,
        required: false
    }],
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Organization', Organization);