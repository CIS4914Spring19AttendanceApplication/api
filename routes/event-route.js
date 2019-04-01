let router = require('express').Router();
var event_controller = require('../controllers/event-controller');
let jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 15,
        jwksUri: "https://rollcall-app.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://rollcall-api.herokuapp.com',
    issuer: "https://rollcall-app.auth0.com/",
    algorithms: ['RS256']
});

router.post('/create', authCheck, event_controller.createEvent);

router.post('/toggleAttendance', authCheck, event_controller.toggleAttendance);

router.post('/toggleLocationEnforce', authCheck, event_controller.toggleLocationEnforce);

router.post('/update', authCheck, event_controller.updateEvent);

router.post('/delete', authCheck, event_controller.deleteEvent);

router.post('/checkin', authCheck, event_controller.orgEnroll, event_controller.checkAttendanceToggle, event_controller.checkLocation, event_controller.checkIn);

router.get('/get/byorg/:name', authCheck, event_controller.getEventsByOrg);

router.get('/get/qr/:id', event_controller.getEventQR);


module.exports = router;