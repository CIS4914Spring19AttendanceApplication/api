let router = require('express').Router();
var org_controller = require('../controllers/organization-controller');

router.post('/create', org_controller.createOrg);

router.post('/update', org_controller.updateOrg);

module.exports = router;
