var mongoose = require('mongoose');

var AdditionalField = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    response: {
        type: String
    }
});

module.exports = mongoose.model('AdditionalField', AdditionalField);