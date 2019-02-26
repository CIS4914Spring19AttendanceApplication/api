let router = require('express').Router();
var org_controller = require('../controllers/organization-controller');
var user_controller = require('../controllers/user-controller');

router.post('/create', org_controller.createOrg, user_controller.addBoardEnrollment);

router.post('/update', org_controller.updateOrg);

module.exports = router;
