var mongoose = require('mongoose');

var Organization = mongoose.Schema({
    organization_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Organization', Organization);