var mongoose = require('mongoose');
var Organization = require('./organization-model').schema;

var Enrollment = mongoose.Schema({
    organization: {
        type: String,
        required: true
    },
    board: {
        type: Boolean,
        required: true,
        default: false
    },
    member: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Enrollment', Enrollment);