var mongoose = require('mongoose');
var AdditionalField = require('./additional-field-model').schema;

var CheckIn = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    event_id: {
        type: String,
        required: true
    },
    organization_id: {
        type: String,
        required: true
    },
    additional_fields: [AdditionalField],
    created_date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('CheckIn', CheckIn);