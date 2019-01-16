var mongoose = require('mongoose');
var Enrollments = require('./enrollment-model').schema;

var User = mongoose.Schema({
    enrollments: [Enrollments],
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
    created_date: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    hashed_pass: {
        type: String, 
        required: false
    }
});

module.exports = mongoose.model('User', User);