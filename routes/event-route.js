let router = require('express').Router();
var event_controller = require('../controllers/event-controller');

router.post('/create', event_controller.createEvent);

router.post('/checkin', event_controller.checkIn);

module.exports = router;
