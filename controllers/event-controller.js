var mongoose = require("mongoose");
var Event = require("../models/event-model");

exports.createEvent = function(req, res) {
  const newEvent = new Event(req.body);
  newEvent.save()
    .then(document => {
        res.status(201).json(document);
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.toggleEvent = function(req,res) {
  const currentEvent = new Event(req.body);
  Event.findByIdAndUpdate(id, { $set: { toggle: 'large' }}, { new: true }, function (err, tank) {
    if (err) return handleError(err);
    res.send(tank);
  });

}

exports.checkIn = function(req, res) {

};
