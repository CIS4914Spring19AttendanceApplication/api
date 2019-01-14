var mongoose = require('mongoose');
var CheckIn = require('./checkin-model').schema;

var Event = new mongoose.Schema({

    organization: {
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
    event_toggle: {
        type: Boolean,
        default: false,
        required: true
    },
    event_checkins: [CheckIn],
    created_by: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('Event', Event);