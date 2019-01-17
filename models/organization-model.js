var mongoose = require('mongoose');
var OrgReq = require('./organization-req-model').schema;

var Organization = mongoose.Schema({
    org_name: {
        type: String,
        required: true
    },
    org_reqs: [OrgReq],
    org_users: [{
        type: String,
        required: false
    }],
    org_qr_code: {
        type: String,
        required: true
    },
    org_date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Organization', Organization);