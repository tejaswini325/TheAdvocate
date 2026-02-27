const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(authorize('Admin'), userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser);

module.exports = router;