var mongoose = require("mongoose");
var Event = require("../models/event-model");
var QRCode = require("qrcode");
var CheckIn = require("../models/checkin-model");
var Org = require("../models/organization-model");
var User = require("../models/user-model");

exports.getEventQR = function(req, res) {
    Event.findById(req.params.id)
        .then(doc => {
            var qrData = [{
                type: "event",
                org_name: doc.org_name,
                org_id: doc.org_id,
                event_id: doc._id,
                event_name: doc.name,
                event_type: doc.point_categories,
                location_enforce: doc.location_enforce,
                location_radius: doc.location_radius,
                point_categories: doc.point_categories,
                additional_fields: doc.additional_fields
            }];
            QRCode.toDataURL(JSON.stringify(qrData))
                .then(qr => {
                    res.status(201).json({ qr_code: qr });
                }).catch(err => {

                });
        })
        .catch(err => {
            res.status(400).json(err.message);
        })
};
exports.getEventsByOrg = function(req, res) {
    console.log(req.params.name);
    Event.find({ org_name: req.params.name })
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(400).json(err.message);
        })
};

exports.createEvent = function(req, res) {
    console.log(req.body);
    var newEvent = new Event(req.body);
    console.log(newEvent);
    newEvent
        .save()
        .then(document => {
            res.status(201).json(document);
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.updateEvent = function(req, res) {
    const reqEvent = new Event(req.body);
    var qrData = [{
        "type:": "event",
        event_id: reqEvent._id,
        event_name: reqEvent.name,
        additional_fields: reqEvent.event_additional_fields
    }];

    QRCode.toDataURL(JSON.stringify(qrData))
        .then(document => {
            Event.findOneAndUpdate({ _id: req.body._id.$oid }, {
                    $set: {
                        name: reqEvent.name,
                        point_categories: reqEvent.point_categories,
                        additional_fields: reqEvent.additional_fields,
                        date: reqEvent.date,
                        qr_code: document
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
};

exports.deleteEvent = function(req, res) {
    const reqEvent = new Event(req.body);
    Event.deleteOne({ _id: req.body._id.$oid })
        .then(document => {
            CheckIn.deleteMany({ event_id: req.body._id.$oid })
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
            updatedEvent.attendance_toggle = !updatedEvent.attendance_toggle;
            Event.findOneAndUpdate({ _id: req.body._id.$oid }, { $set: { attendance_toggle: updatedEvent.attendance_toggle } }, { new: true })
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
            updatedEvent.location_enforce = !updatedEvent.location_enforce;
            Event.findOneAndUpdate({ _id: req.body._id.$oid }, {
                    $set: { location_enforce: updatedEvent.location_enforce }
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
};

exports.orgEnroll = function(req, res, next) {
    Org.findById({ _id: req.body.org_id }).then(document => {
            if (document) {
                //search if the person is in the organization
                if (document.member.indexOf(req.body.email) == -1) {
                    document.member.push(req.body.email);
                    document.save();

                    //add the organization to the user's model
                    var conditions = {
                        email: req.body.email,
                        'enrollments.organization': { $ne: document.name }
                    };
                    var enrollment = {
                        organization: document.name,
                        member: true
                    };
                    User.findOneAndUpdate(conditions, { $push: { enrollments: enrollment } },
                        function(error) {
                            if (error) {
                                console.log(error);
                                res.status(400).json(error);
                            }
                        }
                    )
                }
                next();
            } else {
                res.status(404).json({ message: "The organization is invalid." });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.checkAttendanceToggle = function(req, res, next) {
    Event.findById({ _id: req.body.event_id }).then(document => {
            if (document) {
                if (document.attendance_toggle) {
                    next();
                } else {
                    res.status(403).json({ message: "This event is not open for sign in right now." });
                }
            } else {
                res.status(404).json({ message: "The event is invalid." });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.checkLocation = function(req, res, next) {
    Event.findById({ _id: req.body.event_id }).then(document => {
            if (document.location_enforce) {
                //compare the passed in location radius
                if (false) {
                    res.status(403).json({ message: "You are not in the proper location to sign in to this event." });
                }
            }
            next();
        })
        .catch(err => {
            console.error(err);
            res.status(400).json(err.message);
        });
};

exports.checkIn = function(req, res) {
    CheckIn.findOne({ event_id: req.body.event_id, email: req.body.email }).then(document => {
            if (document) {
                res.status(403).json({ message: "You have already signed in to this event." });
            } else {
                var newCheckIn = new CheckIn(req.body);
                newCheckIn.created_date = Date.now();
                newCheckIn
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