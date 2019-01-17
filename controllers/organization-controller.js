var mongoose = require("mongoose");
var Org = require("../models/organization-model");
var OrgReq = require("../models/organization-req-model");
var QRCode = require("qrcode");

exports.createOrg = function(req, res) {
  var newOrg = new Org(req.body);
  console.log(newOrg);
  var qrData = [
    {
      type: "org",
      org_id: newOrg._id,
      org_name: newOrg.org_name
    }
  ];
  QRCode.toDataURL(JSON.stringify(qrData))
    .then(document => {
      newOrg.org_qr_code = document;
      newOrg
        .save()
        .then(document => {
          res.status(201).json(document);
        })
        .catch(err => {
          console.error(err);
          res.status(400).json(err.message);
        });
    })
    .catch(err => {
      res.status(400).json(err.message);
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
};

