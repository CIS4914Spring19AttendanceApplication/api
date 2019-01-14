var mongoose = require('mongoose');
var Organization = require('./organization-model').schema;

var User = mongoose.Schema({
    organization: {
        type: Organization,
        required: true
    },
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
    hashed_pass: {
        type: Date, 
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('User', User);