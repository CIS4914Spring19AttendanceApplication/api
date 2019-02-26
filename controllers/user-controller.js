var mongoose = require("mongoose");
var User = require("../models/user-model");

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
      res.status(400).json(err.message);
    });
};

//need to pass email, and org name through res.locals
exports.addBoardEnrollment = function(req, res) {
  var conditions = {
    email: res.locals.email
  };
  console.log(res.locals);
  var org_name = res.locals.org.name;
  var enrollment = {
    organization: org_name, board: true 
  };

  User.findOneAndUpdate(
    { email: res.locals.email },
    { $push: { enrollments: enrollment } },
    function(error, success) {
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        res.send(success);
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
