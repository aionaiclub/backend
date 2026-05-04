const express = require('express');
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, superAdmin, getUsers)
  .post(protect, superAdmin, createUser);

router.route('/:id')
  .delete(protect, superAdmin, deleteUser);

module.exports = router;
