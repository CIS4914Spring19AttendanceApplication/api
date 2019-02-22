var mongoose = require('mongoose');
var Organization = require('./organization-model').schema;

var Enrollment = mongoose.Schema({
    organization: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Enrollment', Enrollment);