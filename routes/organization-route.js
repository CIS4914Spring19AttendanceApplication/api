let router = require('express').Router();
var org_controller = require('../controllers/organization-controller');
var user_controller = require('../controllers/user-controller');

router.post('/create', org_controller.createOrg, user_controller.addBoardEnrollment, user_controller.setActiveOrg);

router.post('/addBoard', org_controller.addBoard, user_controller.addBoardEnrollment, user_controller.setActiveOrg);

router.post('/update', org_controller.updateOrg);

router.get('/get/qr/:name', org_controller.getQR);

router.get('/activate/:name', org_controller.getQR);

router.get('/get/pointcategories/:name', org_controller.getPointCategories);

module.exports = router;