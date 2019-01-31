var mongoose = require("mongoose");
var Event = require("../models/event-model");
var QRCode = require('qrcode');
var CheckIn = require("../models/checkin-model");

exports.createEvent = function(req, res) {
  var newEvent = new Event(req.body);
  console.log(newEvent);
  
  QRCode.toDataURL(newEvent._id.toString())
  .then(document => {
    newEvent.event_qr_code = document;
    newEvent
      .save()
      .then(document => {
        res.status(201).json(document);
      })
      .catch(err => {
        console.error(err);
        res.status(400).json(err.message);
      });
  })
  .catch(err=>{
    res.status(400).json(err.message);
  })
};

exports.updateEvent = function(req, res) {
  const reqEvent = new Event(req.body);
  Event.findOneAndUpdate(
    { _id: req.body._id.$oid },
    {
      $set: { event_name: reqEvent.event_name, event_date: reqEvent.event_date }
    },
    { new: true }
  )
    .then(document => {
      res.status(201).json(document);
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.deleteEvent = function(req, res) {
  const reqEvent = new Event(req.body);
  Event.deleteOne(
    { _id: req.body._id.$oid }  )
    .then(document => {
      CheckIn.deleteMany({event_id: req.body._id.$oid})
      .then(document => {
        res.status(201).send("All events and checkins deleted.");
      })
      .catch(err => {
        console.error(err);
        res.status(400).json(err.message);
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.toggleAttendance = function(req, res) {
  Event.findOne({ _id: req.body._id.$oid })
    .then(document => {
      updatedEvent = new Event(document);
      updatedEvent.event_toggle = !updatedEvent.event_toggle;
      Event.findOneAndUpdate(
        { _id: req.body._id.$oid },
        { $set: { event_toggle: updatedEvent.event_toggle } },
        { new: true }
      )
        .then(document => {
          res.status(201).json(document);
        })
        .catch(err => {
          console.error(err);
          res.status(400).json(err.message);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};


exports.toggleLocationEnforce = function(req, res) {
  Event.findOne({ _id: req.body._id.$oid })
    .then(document => {
      updatedEvent = new Event(document);
      updatedEvent.event_location_enforce = !updatedEvent.event_location_enforce;
      Event.findOneAndUpdate(
        { _id: req.body._id.$oid },
        {
          $set: { event_location_enforce: updatedEvent.event_location_enforce }
        },
        { new: true }
      )
        .then(document => {
          res.status(201).json(document);
        })
        .catch(err => {
          console.error(err);
          res.status(400).json(err.message);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.checkIn = function(req, res) {};