var mongoose = require("mongoose");
var User = require("../models/user-model");

exports.onboardCheck = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(document => {
      if (document) {
        res.send(document);
      } else {
        res.status(404).json({ message: "User Not Found" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });
};