var mongoose = require("mongoose");
var User = require("../models/user-model");
var CheckIn = require("../models/checkin-model");
var Event = require("../models/event-model");
var _ = require('lodash');

exports.getUserEnrollments = function(req, res) {
  User.findOne({ email: req.params.email })
    .then(doc => {
      res.status(201).json(doc.enrollments);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
};

exports.getUserBoardEnrollments = function(req, res) {
  User.findOne({ email: req.params.email })
    .then(doc => {
      res.status(201).json(_.reject(doc.enrollments, ['board', false]));
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
};

exports.onboardCheck = function(req, res) {
  User.findOne({ email: req.params.email })
    .then(document => {
      console.log(req.params.email);
      if (document) {
        res.status(200).json(document);
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err.message);
    });
};

//need to pass email, and org name through res.locals
exports.addBoardEnrollment = function(req, res, next) {
  var org_name = res.locals.org.name;
  var enrollment = {
    organization: org_name,
    board: true
  };

  User.findOneAndUpdate(
    { email: res.locals.email },
    { $push: { enrollments: enrollment } },
    function(error, success) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        next();
      }
    }
  );
};

exports.updateUser = function(req, res) {
  User.findOneAndUpdate({ email: req.body.email }, req.body)
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
};

exports.registerUser = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(document => {
      if (document) {
        res.status(409).json(document);
      } else {
        var newUser = new User(req.body);
        newUser.created_date = Date.now();
        newUser
          .save()
          .then(document => {
            res.status(201).json(document);
          })
          .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.getUserProfile = function(req, res) {
  console.log(req.params.email);
  User.findOne({ email: req.params.email })
    .then(document => {
      if (document) {
        res.status(200).json(document);
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.getCheckInHistory = function(req, res, next){
  CheckIn.find({ email : req.params.email })
    .select({'event_id' : 1, '_id' : 0})
    .then(document => {
      if(document){
        res.locals.checkIns = document;
        next();
      }
      else{
        res.status(404).json({message: "Error Retrieving Organizations"});
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};

exports.calculateOrgPoints = function(req, res, next){

};

exports.getEventHistory = function(req, res){
  var events = [];
  //loop through all of the check ins to save the events
  res.locals.checkIns.forEach(function(ci){
    Event.findById(ci["event_id"])
      .select('org_name name location date point_categories')
      .then(document => {
        events.push(document);
        //if all of the events are added
        if(events.length == res.locals.checkIns.length){
          //sort the events by org_name
          events.sort((a, b) => a.org_name.localeCompare(b.org_name));
          res.status(200).json(events);
        }
      })
      .catch(err => {
        console.error(err);
        res.status(400).json(err.message);
      });
  });
};