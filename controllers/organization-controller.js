var mongoose = require("mongoose");
var _ = require("underscore");
var Org = require("../models/organization-model");
var CheckIn = require("../models/checkin-model");
var QRCode = require("qrcode");
var User = require("../models/user-model");
var __ = require("lodash");
//, "enrollments.organization": activeOrg.name
//, enrollments: {$elemMatch: {organization: activeOrg.name}}

exports.getOrgMemberCount = function(req, res, next) {
    Org.findOne({ _id: res.locals.org_id }, 'member')
        .then(doc => {
            User.find({ email: { $in: doc.member } }, 'first_name last_name phone year')
                .then(members => {
                    res.locals.members = members;
                    var groupedTotal = _.groupBy(members, 'year');
                    var groupedAttended = _.groupBy(res.locals.membersAttended, 'year');
                    var freshmanCounts = {
                        attended: groupedAttended.Freshman,
                        total: groupedTotal.Freshman
                    }
                    var sophomoreCounts = {
                        attended: groupedAttended.Sophomore,
                        total: groupedTotal.Sophomore
                    }
                    var juniorCounts = {
                        attended: groupedAttended.Junior,
                        total: groupedTotal.Junior
                    }
                    var seniorCounts = {
                        attended: groupedAttended.Senior,
                        total: groupedTotal.Senior
                    }
                    var totalSoph = groupedTotal.Sophomore;
                    var totalJun = groupedTotal.Junior;
                    var totalSen = groupedTotal.Senior;


                    res.status(200).json({ attended: res.locals.membersAttended, total: members, freshman: freshmanCounts, sophomore: sophomoreCounts, junior: juniorCounts, senior: seniorCounts });
                })
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};


exports.createOrg = function(req, res, next) {
    var newOrg = new Org(req.body);
    console.log(newOrg);
    var qrData = [{
        type: "org",
        org_id: newOrg._id,
        org_name: newOrg.name
    }];
    Org.findOne({ name: req.body.name })
        .then(document => {
            if (document) {
                console.log("duplicate!");
                var duplicateMessage = {
                    message: "Organization name already exists, please choose another or delete the organization if you are enrolled in it."
                };
                res.status(409).json(duplicateMessage);
            } else {
                QRCode.toDataURL(JSON.stringify(qrData))
                    .then(document => {
                        newOrg.qr_code = document;
                        newOrg.board = [req.body.email];
                        newOrg.member = [req.body.email];
                        newOrg
                            .save()
                            .then(document => {
                                res.locals.email = req.body.email;
                                res.locals.body = req.body;
                                res.locals.org = document;
                                next();
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

exports.getQR = function(req, res) {
    Org.findOne({ name: req.params.name }, 'qr_code')
        .then(doc => {
            res.status(201).json(doc.qr_code);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
}

exports.getPointCategories = function(req, res) {
    Org.findOne({ name: req.params.name }, 'point_categories')
        .then(doc => {
            res.status(201).json(__.map(doc.point_categories, 'name'));
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
}

exports.updateOrg = function(req, res) {
    const reqOrg = new Org(req.body);
    var qrData = [{
        "type:": "org",
        org_id: reqOrg._id,
        org_name: reqOrg.org_name
    }];
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
                    Org.findOneAndUpdate({ _id: req.body._id.$oid }, {
                            $set: {
                                org_name: reqOrg.org_name,
                                org_reqs: reqOrg.org_reqs,
                                org_qr_code: document
                            }
                        }, { new: true })
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

exports.addBoard = function(req, res, next) {
    Org.findById({ _id: req.body.org_id }).then(document => {
        if (document) {
            //check if the user is already enrolled as board
            if (document.board.indexOf(req.body.email) == -1) {
                document.board.push(req.body.email);
                document.save();

                res.locals.email = req.body.email;
                res.locals.body = req.body;
                res.locals.org = document;
                next();
            } else {
                res.status(404).json({ message: "You are already enrolled as a board member in this organization." });
            }
        } else {
            res.status(404).json({ message: "The organization is invalid." });
        }
    }).catch(err => {
        console.error(err);
        res.status(400).json(err.message);
    });
};