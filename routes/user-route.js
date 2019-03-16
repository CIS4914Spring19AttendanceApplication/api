let router = require('express').Router();
var user_controller = require('../controllers/user-controller');

router.get('/', (req, res) => res.send('user'));
router.post('/registeruser', user_controller.registerUser);
router.post('/update', user_controller.updateUser);
router.get('/onboardcheck/:email', user_controller.onboardCheck);
router.get('/get/:email', user_controller.getUserProfile);
router.get('/history/:email', user_controller.getCheckInHistory, user_controller.getEventHistory);
router.get('/get/enrollments/:email', user_controller.getUserEnrollments);
router.get('/get/boardenrollments/:email', user_controller.getUserBoardEnrollments);

module.exports = router;
