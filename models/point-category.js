var mongoose = require('mongoose');

var PointCategory = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: false,
        default: 1
    },
    date_created: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('PointCategory', PointCategory);