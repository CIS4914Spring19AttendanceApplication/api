var mongoose = require("mongoose");
var User = require("../models/user-model");
var CheckIn = require("../models/checkin-model");
var Event = require("../models/event-model");
var Organization = require("../models/organization-model");
var _ = require('lodash');

exports.getUsersByOrg = function(req, res) {
    Organization.find({ _id: req.params.id }, 'member')
        .then(doc => {
            res.status(201).json(doc);

        })
        .catch(err => {
            res.status(500).json(err.message);

        });
}

exports.getActiveOrg = function(req, res) {
    User.findOne({ email: req.params.email })
        .then(doc => {
            console.log(doc[0]);
            res
                .status(201)
                .json(_.reject(doc.enrollments, ["active", false]));

        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};

exports.getUsersByEvent = function(req, res, next) {
    CheckIn.find({ event_id: req.params.id }, 'email org_id')
        .then(doc => {
            res.locals.org_id = doc[0].org_id;
            res.locals.users = doc;
            next();
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};

exports.getUserProfileNoEnrollments = function(req, res, next) {
    //console.log(res.locals.users);
    var usersEmails = _.map(res.locals.users, 'email');
    User.find({ email: { $in: usersEmails } }, 'first_name last_name email phone year')
        .then(doc => {
            res.locals.membersAttended = doc;
            next();
        });
};

exports.getUserEnrollments = function(req, res) {
    User.findOne({ email: req.params.email })
        .then(doc => {
            console.log(doc);
            res.status(201).json(doc.enrollments);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};

exports.getUserBoardEnrollments = function(req, res) {
    User.findOne({ email: req.params.email })
        .then(doc => {
            res.status(201).json(_.reject(doc.enrollments, ["board", false]));
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
};

exports.onboardCheck = function(req, res) {
    User.findOne({ email: req.params.email })
        .select('first_name last_name email year phone')
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
    var org_id = res.locals.org._id;

    var enrollment = {
        organization: org_name,
        organization_id: org_id,
        board: true
    };

    User.findOneAndUpdate({ email: res.locals.email }, { $push: { enrollments: enrollment } },
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

exports.getCheckInHistory = function(req, res, next) {
    CheckIn.find({ email: req.params.email })
        .select({ event_id: 1, _id: 0 })
        .then(document => {
            if (document) {
                res.locals.checkIns = document;
                next();
            } else {
                res.status(404).json({ message: "Error Retrieving Organizations" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.getCheckInHistory = function(req, res, next) {
    CheckIn.find({ email: req.params.email })
        .select({ 'event_id': 1, '_id': 0 })
        .then(document => {
            if (document) {
                res.locals.checkIns = document;
                next();
            } else {
                res.status(404).json({ message: "Error Retrieving CheckIns" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.getEventHistory = function(req, res, next) {
    var events = [];
    //loop through all of the check ins to save the events
    res.locals.checkIns.forEach(function(ci) {
        Event.findById(ci["event_id"])
            .select('org_name name location date point_categories')
            .then(document => {
                events.push(document);
                //if all of the events are added
                if (events.length == res.locals.checkIns.length) {
                    //sort the events by org_name
                    var result = _.chain(events)
                        .groupBy("org_name")
                        .toPairs()
                        .map(item => _.zipObject(["org", "events"], item))
                        .value();

                    res.locals.events = result;
                    next();
                }
            })
            .catch(err => {
                console.error(err);
                res.status(400).json(err.message);
            });
    });
};

exports.getPointReqs = function(req, res, next) {
    var result = [];

    res.locals.events.forEach(function(e) {
        var total_needed = 0;
        Organization.find({ "name": e["org"] })
            .select({ 'point_categories': 1, '_id': 0 })
            .then(document => {
                if (document) {
                    var org = JSON.parse(JSON.stringify(e));
                    org.point_status = [];

                    console.log(document[0].point_categories);
                    document[0].point_categories.forEach(function(pc) {
                        total_needed = total_needed + pc["points"];
                        org.point_status.push({
                            category: pc["name"],
                            total_points: pc["points"],
                            current_points: 0
                        });
                    });

                    //add final json object for total points
                    org.point_status.push({
                        category: "Complete",
                        total_points: total_needed,
                        current_points: 0
                    });

                    result.push(org);

                    if (result.length == res.locals.events.length) {
                        res.locals.points = result;
                        next();
                    }
                } else {
                    res.status(404).json({ message: "Error Retrieving Organization" });
                }
            })
            .catch(err => {
                console.error(err);
                res.status(400).json(err.message);
            });
    });

};

exports.getPointHistory = function(req, res) {
    //loop through the events
    res.locals.points.forEach(function(org) {
        var org_total = 0;
        org["events"].forEach(function(e) {
            e["point_categories"].forEach(function(p) {
                org["point_status"].forEach(function(s) {
                    if (s["category"] == p["name"]) {
                        var pointCat = JSON.parse(JSON.stringify(s));
                        var curr = pointCat.current_points + p["points"];
                        s["current_points"] = curr;
                        org_total = org_total + p["points"];
                    }
                });
            });
        });
        org.point_status[(org["point_status"].length - 1)].current_points = org_total;
    });
    res.status(200).json(res.locals.points);
};

exports.setActiveOrg = function(req, res) {
    if (res.locals.org) {
        activeOrg = res.locals.org.name;
        userEmail = res.locals.email;
    } else {
        activeOrg = req.body.org_name;
        userEmail = req.body.user_email;
    }
    console.log("orgname: " + activeOrg);
    User.updateMany({ email: userEmail }, { $set: { "enrollments.$[].active": false } }, { multi: true })
        .then(doc => {
            User.update({
                    email: userEmail,
                    enrollments: { $elemMatch: { organization: activeOrg } }
                }, {
                    $set: { "enrollments.$.active": true }
                })
                .then(doc => {
                    res.status(201).json(doc);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
};