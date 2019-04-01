let router = require('express').Router();
var org_controller = require('../controllers/organization-controller');
var user_controller = require('../controllers/user-controller');
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

router.post('/create', authCheck, org_controller.createOrg, user_controller.addBoardEnrollment, user_controller.setActiveOrg);

router.post('/addBoard', authCheck, org_controller.addBoard, user_controller.addBoardEnrollment, user_controller.setActiveOrg);

router.post('/update', authCheck, org_controller.updateOrg);

router.get('/get/qr/:name', authCheck, org_controller.getQR);

router.get('/activate/:name', authCheck, org_controller.getQR);

router.get('/get/pointcategories/:name', authCheck, org_controller.getPointCategories);

module.exports = router;