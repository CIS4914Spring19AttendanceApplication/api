let router = require('express').Router();
var user_controller = require('../controllers/user-controller');

router.get('/', (req, res) => res.send('user'));
router.get('/onboardcheck', user_controller.onboardCheck);

module.exports = router;
