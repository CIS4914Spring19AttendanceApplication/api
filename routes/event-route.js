let router = require('express').Router();
var event_controller = require('../controllers/event-controller');

router.post('/create', event_controller.createEvent);

router.post('/toggleAttendance', event_controller.toggleAttendance);

router.post('/toggleLocationEnforce', event_controller.toggleLocationEnforce);

router.post('/update', event_controller.updateEvent);

router.post('/delete', event_controller.deleteEvent);

router.post('/checkin', event_controller.orgEnroll, event_controller.checkAttendanceToggle, event_controller.checkLocation, event_controller.checkIn);

router.get('/get/byorg/:name', event_controller.getEventsByOrg);

router.get('/get/qr/:id', event_controller.getEventQR);


module.exports = router;