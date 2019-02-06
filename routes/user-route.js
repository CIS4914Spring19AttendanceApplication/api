let router = require('express').Router();
var user_controller = require('../controllers/user-controller');

router.get('/', (req, res) => res.send('user'));
router.post('/registeruser', user_controller.registerUser);
router.get('/onboardcheck/:email', user_controller.onboardCheck);

module.exports = router;
