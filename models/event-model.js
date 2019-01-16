var mongoose = require('mongoose');
var OrgReq = require('./organization-req-model').schema;

var Event = new mongoose.Schema({
    organization_id: {
        type: String,
        required: true
    },
    event_name: {
        type: String,
        required: true
    },
    event_date: {
        type: String,
        required: true
    },
    event_location: {
        type: String,
        required: true
    },
    event_qr_code: {
        type: String,
        required: true
    },
    event_location_enforce: {
        type: Boolean,
        required: true
    },
    event_location_radius: {
        type: String,
        required: true
    },
    event_toggle: {
        type: Boolean,
        default: false,
        required: true
    },
    event_reqs: [{
        type: String,
        required: true
    }],
    created_by: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Event', Event);