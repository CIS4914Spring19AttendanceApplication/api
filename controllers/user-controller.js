var mongoose = require("mongoose");
var User = require("../models/user-model");

exports.onboardCheck = function(req, res) {
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

exports.registerUser = function(req, res) {
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
};