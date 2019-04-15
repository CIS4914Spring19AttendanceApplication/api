let router = require('express').Router();
var user_controller = require('../controllers/user-controller');
var org_controller = require('../controllers/organization-controller');

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

router.get('/', (req, res) => res.send('user'));
router.post('/registeruser', authCheck, user_controller.registerUser);
router.post('/update', authCheck, user_controller.updateUser);
router.get('/onboardcheck/:email', authCheck, user_controller.onboardCheck);
router.get('/get/:email', authCheck, user_controller.getUserProfile);
router.get('/history/:email', authCheck, user_controller.getCheckInHistory, user_controller.getEventHistory, user_controller.getPointReqs, user_controller.getPointHistory);
router.get('/get/enrollments/:email', authCheck, user_controller.getUserEnrollments);
router.get('/get/boardenrollments/:email', authCheck, user_controller.getUserBoardEnrollments);
router.get('/get/byevent/:id', user_controller.getUsersByEvent, user_controller.getUserProfileNoEnrollments, org_controller.getOrgMemberCount);
router.post('/set/activeorg', authCheck, user_controller.setActiveOrg);
router.get('/get/activeorg/:email', authCheck, user_controller.getActiveOrg);
router.get('/get/byorg/:id', authCheck, user_controller.getUsersByOrg);

module.exports = router;