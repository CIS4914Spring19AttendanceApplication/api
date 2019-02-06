let router = require('express').Router();
var user_controller = require('../controllers/user-controller');

router.get('/', (req, res) => res.send('user'));
router.post('/onboardcheck', user_controller.onboardCheck);
router.post('/registeruser', user_controller.registerUser);

module.exports = router;
