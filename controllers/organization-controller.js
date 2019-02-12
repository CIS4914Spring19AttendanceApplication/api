var mongoose = require("mongoose");
var _ = require("underscore");
var Org = require("../models/organization-model");
var CheckIn = require("../models/checkin-model");
var QRCode = require("qrcode");

exports.createOrg = function(req, res) {
  var newOrg = new Org(req.body);
  console.log(newOrg);
  var qrData = [
    {
      type: "org",
      org_id: newOrg._id,
      org_name: newOrg.name
    }
  ];
  Org.findOne({ name: req.body.name })
    .then(document => {
      if (document) {
        var duplicateMessage = {
          message:
            "Organization name already exists, please choose another or delete the organization if you are enrolled in it."
        };
        res.status(409).json(duplicateMessage);
      } else {
        QRCode.toDataURL(JSON.stringify(qrData))
          .then(document => {
            newOrg.qr_code = document;
            newOrg
              .save()
              .then(document => {
                res.status(201).json(document);
              })
              .catch(err => {
                console.error(err);
                res.status(500).json(err.message);
              });
          })
          .catch(err => {
            res.status(500).json(err.message);
          });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
};

exports.updateOrg = function(req, res) {
  const reqOrg = new Org(req.body);
  var qrData = [
    {
      "type:": "org",
      org_id: reqOrg._id,
      org_name: reqOrg.org_name
    }
  ];
  var oldReqs = [];
  for (var i = 0; i < req.body.old_org_reqs.length; i++) {
    oldReqs.push(req.body.old_org_reqs[i].req_name);
  }
  var newReqs = [];
  console.log(oldReqs);
  for (var i = 0; i < reqOrg.org_reqs.length; i++) {
    newReqs.push(reqOrg.org_reqs[i].req_name);
  }
  console.log(newReqs);

  var reqsToRemove = _.difference(oldReqs, newReqs);
  console.log(reqsToRemove);

  CheckIn.deleteMany({
    org_id: req.body.org_id,
    org_reqs: {
      $in: reqsToRemove
    }
  })
    .then(document => {
      QRCode.toDataURL(JSON.stringify(qrData))
        .then(document => {
          Org.findOneAndUpdate(
            { _id: req.body._id.$oid },
            {
              $set: {
                org_name: reqOrg.org_name,
                org_reqs: reqOrg.org_reqs,
                org_qr_code: document
              }
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
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err.message);
    });

  //   QRCode.toDataURL(JSON.stringify(qrData))
  //     .then(document => {
  //       Org.findOneAndUpdate(
  //         { _id: req.body._id.$oid },
  //         {
  //           $set: {
  //             org_name: reqOrg.org_name,
  //             org_reqs: reqOrg.org_reqs,
  //             org_qr_code: document
  //           }
  //         },
  //         { new: true }
  //       )
  //         .then(document => {
  //           res.status(201).json(document);
  //         })
  //         .catch(err => {
  //           console.error(err);
  //           res.status(400).json(err.message);
  //         });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       res.status(400).json(err.message);
  //     });
};
