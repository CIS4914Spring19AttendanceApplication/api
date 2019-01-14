var mongoose = require('mongoose');

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
    location: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now,
        required: true
    },
});

module.exports = mongoose.model('CheckIn', CheckIn);