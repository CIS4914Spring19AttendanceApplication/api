var mongoose = require('mongoose');
var AdditionalField = require('./additional-field-model').schema;
var PointCategory = require('./point-category').schema;


var Event = new mongoose.Schema({
    org_name: {
        type: String,
        required: true
    },
    org_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    qr_code: {
        type: String,
        required: true
    },
    location_enforce: {
        type: Boolean,
        required: true
    },
    location_radius: {
        type: String,
        required: true
    },
    attendance_toggle: {
        type: Boolean,
        default: false,
        required: true
    },
    point_categories: [PointCategory],
    additional_fields: [AdditionalField],
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